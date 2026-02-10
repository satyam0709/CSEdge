import express from "express";
import { requireAuth } from "@clerk/express";
import {
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion
} from "../controllers/adminController.js";
import  protectEducator  from "../middlewares/authMiddleware.js";

const router = express.Router();

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

export default router;
