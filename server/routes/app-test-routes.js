import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getNextQuestion,
  submitAnswer,
  resetTest,
  getAnalytics,
  getRecommendations,
  getQuestionsByLevel,
  getAvailableLevels,
  getLevelSummary,
} from "../controllers/testController.js";

const router = express.Router();

// All /api/test/* routes use Clerk. The client must send Authorization: Bearer <token>
// for levels, level-questions, analytics, and recommendations.
router.get("/levels", requireAuth(), getAvailableLevels);
router.get("/level-questions", requireAuth(), getQuestionsByLevel);
router.get("/questions", requireAuth(), getQuestionsByLevel);

router.get("/question", requireAuth(), getNextQuestion);
router.post("/submit", requireAuth(), submitAnswer);
router.post("/level-summary", requireAuth(), getLevelSummary);
router.post("/reset", requireAuth(), resetTest);
router.get("/analytics", requireAuth(), getAnalytics);
router.get("/recommendations", requireAuth(), getRecommendations);

export default router;
