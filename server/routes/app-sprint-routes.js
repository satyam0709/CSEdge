import express from "express";
import {
  getActiveWeeklySprintPublic,
  getWeeklySprintBySlugPublic,
} from "../controllers/sprintController.js";

const router = express.Router();

// Public endpoints for homepage + arena.
router.get("/active", getActiveWeeklySprintPublic);
router.get("/:slug", getWeeklySprintBySlugPublic);

export default router;
