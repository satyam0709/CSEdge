import express from "express";
import {
  getMentorPublicInfo,
  postMentorSessionRequest,
} from "../controllers/mentorController.js";

const router = express.Router();

router.get("/info", getMentorPublicInfo);
router.post("/session-request", postMentorSessionRequest);

export default router;
