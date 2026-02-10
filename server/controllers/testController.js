import Question from "../models/Question.js";
import TestProgress from "../models/TestProgress.js";
import TestAttempt from "../models/TestAttempt.js";

/*
=====================================
GET NEXT QUESTION (LEVEL SYSTEM)
=====================================
*/
export const getNextQuestion = async (req, res) => {
  try {
    const userId = req.auth().userId;
    let { type } = req.query;

    // Normalize type aliases
    const typeMap = {
      'dev': ['dev', 'development'],
      'development': ['dev', 'development'],
      'dsa': ['dsa', 'coding'],
      'coding': ['dsa', 'coding'],
      'aptitude': ['aptitude']
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
        options: question.options
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

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    const isCorrect = question.correctAnswer === selectedAnswer;

    const progress = await TestProgress.findOne({
      userId,
      testType: type
    });

    if (!progress) {
      return res.status(400).json({
        success: false,
        message: "Test progress not found"
      });
    }

    // Save attempted question
    progress.attemptedQuestions.push(questionId);
    await progress.save();

    // Save attempt for analytics
    await TestAttempt.create({
      userId,
      questionId,
      type,
      level: question.level,
      isCorrect,
      timeTaken
    });

    res.json({
      success: true,
      correct: isCorrect,
      explanation: question.explanation
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

    const progress = await TestProgress.findOne({
      userId,
      testType: type
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

    const attempts = await TestAttempt.find({
      userId,
      type
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

    const attempts = await TestAttempt.find({ userId, type });

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
    let { type } = req.query;
    if (!type) return res.status(400).json({ success: false, message: 'type required' });

    // Normalize type aliases
    const typeMap = {
      'dev': ['dev', 'development'],
      'development': ['dev', 'development'],
      'dsa': ['dsa', 'coding'],
      'coding': ['dsa', 'coding'],
      'aptitude': ['aptitude']
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
    const { type, level, limit } = req.query;
    if (!type || !level) {
      return res.status(400).json({ success: false, message: 'type and level required' });
    }

    const qLimit = Math.max(1, Math.min(50, Number(limit) || 10));

    const questions = await Question.find({ type, level: Number(level) })
      .limit(qLimit)
      .select('_id question options');

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
