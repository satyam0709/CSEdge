import Question from "../models/Question.js";
import TestProgress from "../models/TestProgress.js";
import TestAttempt from "../models/TestAttempt.js";
import { emitUserAnalyticsUpdate } from "../socket/adminAnalyticsSocket.js";
import { emitActiveSprintLeaderboardUpdate } from "../socket/weeklySprintSocket.js";
import { hasBpscAccess } from "../lib/bpscAccess.js";

/** Single canonical type for TestProgress + consistent analytics. */
function normalizeProgressType(type) {
  const t = String(type || "").toLowerCase();
  if (t === "coding" || t === "dsa") return "dsa";
  if (t === "development" || t === "dev") return "dev";
  if (t === "sql" || t === "database") return "sql";
  if (t === "bpsc") return "bpsc";
  if (t === "aptitude") return "aptitude";
  return t || "aptitude";
}

async function enforceBpscAccessIfNeeded(userId, rawType) {
  const t = normalizeProgressType(rawType);
  if (t !== "bpsc") return { ok: true };
  const allowed = await hasBpscAccess(userId);
  if (!allowed) {
    return {
      ok: false,
      status: 403,
      message: "BPSC practice is restricted to approved email IDs only.",
    };
  }
  return { ok: true };
}

function normStr(v) {
  return String(v ?? "").trim();
}

/*
=====================================
GET NEXT QUESTION (LEVEL SYSTEM)
=====================================
*/
export const getNextQuestion = async (req, res) => {
  try {
    const userId = req.auth().userId;
    let { type } = req.query;
    const gate = await enforceBpscAccessIfNeeded(userId, type);
    if (!gate.ok) return res.status(gate.status).json({ success: false, message: gate.message });

    // Normalize type aliases
    const typeMap = {
      'dev': ['dev', 'development'],
      'development': ['dev', 'development'],
      'dsa': ['dsa', 'coding'],
      'coding': ['dsa', 'coding'],
      'aptitude': ['aptitude'],
      'sql': ['sql'],
      'bpsc': ['bpsc']
    };

    const typesToCheck = typeMap[type] || [type];
    const primaryType = typesToCheck[0]; // Use primary type for storage

    let progress = await TestProgress.findOne({
      userId,
      testType: primaryType
    });

    // First time user
    if (!progress) {
      progress = await TestProgress.create({
        userId,
        testType: primaryType,
        currentLevel: 1,
        attemptedQuestions: []
      });
    }

    // Try to get unanswered question from current level (check all mapped types)
    let question = await Question.findOne({
      type: { $in: typesToCheck },
      level: progress.currentLevel,
      _id: { $nin: progress.attemptedQuestions }
    });

    // If no questions left in this level → move to next level
    if (!question) {
      progress.currentLevel += 1;
      progress.attemptedQuestions = [];
      await progress.save();

      question = await Question.findOne({
        type: { $in: typesToCheck },
        level: progress.currentLevel
      });
    }

    // If no more questions at all
    if (!question) {
      return res.json({
        success: false,
        message: "Test completed"
      });
    }

    // Never send correct answer to frontend
    res.json({
      success: true,
      level: progress.currentLevel,
      question: {
        _id: question._id,
        question: question.question,
        options: question.options,
        topic: question.topic,
        level: question.level,
        platform: question.platform,
        starterCode: question.starterCode,
        constraints: question.constraints,
        sampleInput: question.sampleInput,
        sampleOutput: question.sampleOutput,
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
=====================================
SUBMIT ANSWER (SERVER VALIDATION)
=====================================
*/
export const submitAnswer = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const { questionId, selectedAnswer, type, timeTaken } = req.body;
    const gate = await enforceBpscAccessIfNeeded(userId, type);
    if (!gate.ok) return res.status(gate.status).json({ success: false, message: gate.message });

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    let selected = selectedAnswer;
    if (typeof selectedAnswer === "number" && Number.isInteger(selectedAnswer)) {
      selected = question.options?.[selectedAnswer];
    }
    const isCorrect =
      normStr(question.correctAnswer).toLowerCase() === normStr(selected).toLowerCase();

    const progressType = normalizeProgressType(type);

    let progress = await TestProgress.findOne({
      userId,
      testType: progressType,
    });

    if (!progress) {
      progress = await TestProgress.create({
        userId,
        testType: progressType,
        currentLevel: 1,
        attemptedQuestions: [],
      });
    }

    // Save attempted question
    progress.attemptedQuestions.push(questionId);
    await progress.save();

    // Save attempt for analytics (use question DB type, normalized)
    const attemptType = normalizeProgressType(question.type);
    await TestAttempt.create({
      userId,
      questionId,
      type: attemptType,
      level: question.level,
      isCorrect,
      timeTaken,
      selectedAnswer: normStr(selected),
      correctAnswer: normStr(question.correctAnswer),
    });

    // Push live admin analytics updates for this user, if any admin is subscribed.
    emitUserAnalyticsUpdate(userId).catch((err) => {
      console.error("[admin-analytics] emitUserAnalyticsUpdate failed:", err.message);
    });
    emitActiveSprintLeaderboardUpdate().catch((err) => {
      console.error("[weekly-sprint] emitActiveSprintLeaderboardUpdate failed:", err.message);
    });

    res.json({
      success: true,
      correct: isCorrect,
      explanation: question.explanation,
      correctAnswer: question.correctAnswer
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
=====================================
LEVEL SUMMARY (CORRECT/WRONG OVERVIEW)
Returns latest attempt per question in the level
=====================================
*/
export const getLevelSummary = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const { type, level, questionIds = [] } = req.body || {};
    const gate = await enforceBpscAccessIfNeeded(userId, type);
    if (!gate.ok) return res.status(gate.status).json({ success: false, message: gate.message });
    const t = normalizeProgressType(type);
    const lvl = Number(level);
    if (!lvl) {
      return res.status(400).json({ success: false, message: "level is required" });
    }

    const qFilter = Array.isArray(questionIds) && questionIds.length
      ? { questionId: { $in: questionIds } }
      : {};

    const attempts = await TestAttempt.find({
      userId,
      type: t,
      level: lvl,
      ...qFilter,
    })
      .sort({ createdAt: -1 })
      .lean();

    const latestByQuestion = new Map();
    for (const a of attempts) {
      const qid = String(a.questionId || "");
      if (!qid || latestByQuestion.has(qid)) continue;
      latestByQuestion.set(qid, a);
    }

    const uniqueQuestionIds = Array.from(latestByQuestion.keys());
    const questions = await Question.find({ _id: { $in: uniqueQuestionIds } })
      .select("_id question options")
      .lean();
    const questionMap = new Map(questions.map((q) => [String(q._id), q]));

    const rows = uniqueQuestionIds.map((qid) => {
      const a = latestByQuestion.get(qid);
      const q = questionMap.get(qid);
      return {
        questionId: qid,
        question: q?.question || "Question",
        options: Array.isArray(q?.options) ? q.options : [],
        selectedAnswer: a?.selectedAnswer || "",
        correctAnswer: a?.correctAnswer || "",
        isCorrect: Boolean(a?.isCorrect),
      };
    });

    const correctCount = rows.filter((r) => r.isCorrect).length;
    const wrongCount = rows.length - correctCount;
    const totalQuestions = rows.length;
    const score = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return res.json({
      success: true,
      summary: {
        level: lvl,
        type: t,
        totalQuestions,
        correctCount,
        wrongCount,
        score,
        passed: score >= 60,
        rows,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*
=====================================
RESET TEST
mode:
  "level" → retry current level
  "full"  → restart entire test
=====================================
*/
export const resetTest = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const { type, mode } = req.body;
    const gate = await enforceBpscAccessIfNeeded(userId, type);
    if (!gate.ok) return res.status(gate.status).json({ success: false, message: gate.message });
    const progressType = normalizeProgressType(type);

    const progress = await TestProgress.findOne({
      userId,
      testType: progressType,
    });

    if (!progress) {
      return res.json({ success: true });
    }

    if (mode === "level") {
      progress.attemptedQuestions = [];
    }

    if (mode === "full") {
      progress.currentLevel = 1;
      progress.attemptedQuestions = [];
    }

    await progress.save();

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
=====================================
ANALYTICS
Accuracy, Avg Time, Weak Levels
=====================================
*/
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const { type } = req.query;
    const gate = await enforceBpscAccessIfNeeded(userId, type);
    if (!gate.ok) return res.status(gate.status).json({ success: false, message: gate.message });
    const t = normalizeProgressType(type);

    const attempts = await TestAttempt.find({
      userId,
      type: t,
    });

    if (!attempts.length) {
      return res.json({
        success: true,
        analytics: null
      });
    }

    const total = attempts.length;
    const correct = attempts.filter(a => a.isCorrect).length;
    const avgTime =
      attempts.reduce((sum, a) => sum + a.timeTaken, 0) / total;

    const weakLevels = {};
    attempts.forEach(a => {
      if (!a.isCorrect) {
        weakLevels[a.level] = (weakLevels[a.level] || 0) + 1;
      }
    });

    res.json({
      success: true,
      analytics: {
        attempts: total,
        accuracy: ((correct / total) * 100).toFixed(2),
        avgTime: avgTime.toFixed(2),
        weakLevels
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
=====================================
PERSONALIZED LEVEL RECOMMENDATIONS
=====================================
*/
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const { type } = req.query;
    const gate = await enforceBpscAccessIfNeeded(userId, type);
    if (!gate.ok) return res.status(gate.status).json({ success: false, message: gate.message });
    const t = normalizeProgressType(type);

    const attempts = await TestAttempt.find({ userId, type: t });

    const levelStats = {};

    attempts.forEach(a => {
      if (!levelStats[a.level]) {
        levelStats[a.level] = { total: 0, correct: 0 };
      }
      levelStats[a.level].total++;
      if (a.isCorrect) levelStats[a.level].correct++;
    });

    const recommendations = Object.keys(levelStats).map(level => {
      const stat = levelStats[level];
      const accuracy = (stat.correct / stat.total) * 100;

      let status = "strong";
      if (accuracy < 60) status = "weak";
      else if (accuracy < 80) status = "average";

      return {
        level: Number(level),
        accuracy: accuracy.toFixed(2),
        status
      };
    });

    res.json({
      success: true,
      recommendations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
=====================================
AVAILABLE LEVELS
Return all distinct levels available for a test type
Query: ?type=aptitude
=====================================
*/
export const getAvailableLevels = async (req, res) => {
  try {
    const userId = req.auth().userId;
    let { type } = req.query;
    if (!type) return res.status(400).json({ success: false, message: 'type required' });
    const gate = await enforceBpscAccessIfNeeded(userId, type);
    if (!gate.ok) return res.status(gate.status).json({ success: false, message: gate.message });

    // Normalize type aliases
    const typeMap = {
      'dev': ['dev', 'development'],
      'development': ['dev', 'development'],
      'dsa': ['dsa', 'coding'],
      'coding': ['dsa', 'coding'],
      'aptitude': ['aptitude'],
      'sql': ['sql'],
      'bpsc': ['bpsc']
    };

    const typesToCheck = typeMap[type] || [type];
    
    // Query for any of the mapped types
    const levels = await Question.distinct('level', { type: { $in: typesToCheck } });
    const numeric = levels.map(l => Number(l)).filter(n => !Number.isNaN(n)).sort((a,b) => a-b);

    res.json({ success: true, levels: numeric });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
=====================================
GET QUESTIONS BY LEVEL (BATCH)
Public for authenticated users to fetch a set of questions
Returns questions without correctAnswer field
Query: ?type=aptitude&level=1&limit=10
=====================================
*/
export const getQuestionsByLevel = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const { type, level, limit } = req.query;
    if (!type || !level) {
      return res.status(400).json({ success: false, message: 'type and level required' });
    }
    const gate = await enforceBpscAccessIfNeeded(userId, type);
    if (!gate.ok) return res.status(gate.status).json({ success: false, message: gate.message });

    const typeMap = {
      dev: ["dev", "development"],
      development: ["dev", "development"],
      dsa: ["dsa", "coding"],
      coding: ["dsa", "coding"],
      aptitude: ["aptitude"],
      sql: ["sql"],
      bpsc: ["bpsc"]
    };

    const typesToQuery = typeMap[type] || [type];
    const isBpsc = typesToQuery.includes("bpsc");
    const maxLimit = isBpsc ? 500 : 50;
    const defaultLimit = isBpsc ? 200 : 10;
    const qLimit = Math.max(1, Math.min(maxLimit, Number(limit) || defaultLimit));

    const questions = await Question.find({
      type: { $in: typesToQuery },
      level: Number(level)
    })
      .limit(qLimit)
      .select(
        "_id question options topic level platform starterCode constraints sampleInput sampleOutput"
      );

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
