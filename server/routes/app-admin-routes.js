import express from "express";
import { requireAuth } from "@clerk/express";
import {
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  seedSqlQuestions,
} from "../controllers/adminController.js";
import {
  getSkillHeatmap,
  getPredictivePlacementScore,
  getAnalyticsUserOptions,
  getReadinessLeaderboard,
  exportReadinessLeaderboardCsv,
} from "../controllers/adminAnalyticsController.js";
import {
  createWeeklySprint,
  updateWeeklySprint,
  listWeeklySprintsAdmin,
} from "../controllers/sprintController.js";
import {
  getMentorSettingsAdmin,
  putMentorSettingsAdmin,
  listMentorSessionRequestsAdmin,
} from "../controllers/mentorController.js";
import {
  createCourse,
  getAllCoursesAdmin,
  updateCourse,
  deleteCourse
} from "../controllers/courseController.js";
import  protectEducator  from "../middlewares/authMiddleware.js";
import { skipOptionsBeforeAuth } from "../middlewares/skipOptionsBeforeAuth.js";

const router = express.Router();

router.use(skipOptionsBeforeAuth);
// Only educators/admins allowed
router.use(requireAuth());
router.use(protectEducator);

/*
====================================
ADMIN QUESTION ROUTES
====================================
*/

// Add new question
router.post("/question", addQuestion);
router.get("/questions", getQuestions);
router.put("/question/:id", updateQuestion);
router.delete("/question/:id", deleteQuestion);

// Seed SQL questions from server/data/sql.json (educator auth)
router.post("/seed-sql", seedSqlQuestions);

// Course management
router.post("/course", createCourse);
router.get("/courses", getAllCoursesAdmin);
router.put("/course/:id", updateCourse);
router.delete("/course/:id", deleteCourse);

// Admin / Analytics layer
router.get("/analytics/users", getAnalyticsUserOptions);
router.get("/analytics/skill-heatmap", getSkillHeatmap);
router.get("/analytics/predictive-readiness", getPredictivePlacementScore);
router.get("/analytics/readiness-leaderboard", getReadinessLeaderboard);
router.get("/analytics/readiness-leaderboard/export.csv", exportReadinessLeaderboardCsv);

// Weekly sprints (admin-managed, public-facing leaderboards)
router.post("/sprints", createWeeklySprint);
router.get("/sprints", listWeeklySprintsAdmin);
router.put("/sprints/:id", updateWeeklySprint);

// Free 1:1 career mentor (settings + inbound requests)
router.get("/mentor-settings", getMentorSettingsAdmin);
router.put("/mentor-settings", putMentorSettingsAdmin);
router.get("/mentor-session-requests", listMentorSessionRequestsAdmin);

export default router;
