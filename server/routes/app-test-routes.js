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

// All test routes must be protected
router.use(requireAuth());

router.get("/question", getNextQuestion);
router.post("/submit", submitAnswer);
router.post("/reset", resetTest);
router.get("/analytics", getAnalytics);
router.get("/recommendations", getRecommendations);
router.get("/levels", getAvailableLevels);
router.get("/level-questions", getQuestionsByLevel);

export default router;
