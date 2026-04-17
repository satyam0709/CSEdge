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

export default router;
