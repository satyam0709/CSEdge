import express from "express";
import { requireAuth } from "@clerk/express";
import { getResume, saveResume, deleteResume } from "../controllers/resumeController.js";

const router = express.Router();

router.get("/", requireAuth(), getResume);
router.post("/", requireAuth(), saveResume);
router.delete("/", requireAuth(), deleteResume);

export default router;
