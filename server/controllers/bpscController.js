import TestAttempt from "../models/TestAttempt.js";
import Question from "../models/Question.js";
import { getRequesterEmail, hasBpscAccess } from "../lib/bpscAccess.js";

export async function getBpscAccessStatus(req, res) {
  try {
    const userId = req.auth()?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const email = await getRequesterEmail(userId);
    const allowed = await hasBpscAccess(userId);
    return res.json({ success: true, allowed, email });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getBpscDashboard(req, res) {
  try {
    const userId = req.auth()?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const attempts = await TestAttempt.find({ userId, type: "bpsc" }).sort({ createdAt: -1 }).lean();
    const totalAttempts = attempts.length;
    const correctCount = attempts.filter((a) => a.isCorrect).length;
    const wrongCount = totalAttempts - correctCount;
    const accuracy = totalAttempts ? Number(((correctCount / totalAttempts) * 100).toFixed(2)) : 0;

    const perLevelMap = new Map();
    for (const a of attempts) {
      const lvl = Number(a.level || 1);
      if (!perLevelMap.has(lvl)) perLevelMap.set(lvl, { level: lvl, attempts: 0, correct: 0 });
      const row = perLevelMap.get(lvl);
      row.attempts += 1;
      if (a.isCorrect) row.correct += 1;
    }
    const perLevel = Array.from(perLevelMap.values())
      .sort((a, b) => a.level - b.level)
      .map((r) => ({
        ...r,
        wrong: r.attempts - r.correct,
        accuracy: r.attempts ? Number(((r.correct / r.attempts) * 100).toFixed(2)) : 0,
      }));

    const latestQuestionIds = attempts.slice(0, 20).map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: latestQuestionIds } })
      .select("_id question topic level")
      .lean();
    const qMap = new Map(questions.map((q) => [String(q._id), q]));
    const recentReview = attempts.slice(0, 20).map((a) => ({
      questionId: String(a.questionId),
      question: qMap.get(String(a.questionId))?.question || "Question",
      topic: qMap.get(String(a.questionId))?.topic || "",
      level: qMap.get(String(a.questionId))?.level || a.level || 1,
      selectedAnswer: a.selectedAnswer || "",
      correctAnswer: a.correctAnswer || "",
      isCorrect: Boolean(a.isCorrect),
      createdAt: a.createdAt,
    }));

    return res.json({
      success: true,
      dashboard: {
        totalAttempts,
        correctCount,
        wrongCount,
        accuracy,
        perLevel,
        recentReview,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
