import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getNextQuestion,
  submitAnswer,
  resetTest,
  getAnalytics,
  getRecommendations,
  getQuestionsByLevel,
  getAvailableLevels
} from "../controllers/testController.js";

const router = express.Router();

// Only protect routes that require a user context. Public endpoints like
// available levels and questions by level are exposed so the frontend can
// display level lists without requiring authentication. Protected routes
// still require Clerk auth.
router.get("/levels", getAvailableLevels);
router.get("/level-questions", getQuestionsByLevel);

router.get("/question", requireAuth(), getNextQuestion);
router.post("/submit", requireAuth(), submitAnswer);
router.post("/reset", requireAuth(), resetTest);
router.get("/analytics", requireAuth(), getAnalytics);
router.get("/recommendations", requireAuth(), getRecommendations);

export default router;
