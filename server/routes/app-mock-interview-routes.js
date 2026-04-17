import express from "express";
import { requireAuth } from "@clerk/express";
import {
  startSession,
  submitAnswer,
  getSessions,
  getSession,
  deleteSession,
} from "../controllers/mockInterviewController.js";

const router = express.Router();

router.post("/start", requireAuth(), startSession);
router.post("/answer", requireAuth(), submitAnswer);
router.get("/sessions", requireAuth(), getSessions);
router.get("/session/:id", requireAuth(), getSession);
router.delete("/session/:id", requireAuth(), deleteSession);

export default router;
