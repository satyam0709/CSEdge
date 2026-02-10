import express from "express";
import { getAllCourse, getCourseId } from "../controllers/courseController.js";

const router = express.Router();

// Public
router.get("/all", getAllCourse);
router.get("/:id", getCourseId);

export default router;
