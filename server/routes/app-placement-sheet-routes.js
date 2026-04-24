import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getMyPlacementSheetProgress,
  getGlobalPlacementSheetLeaderboard,
  updateMyPlacementDailyTarget,
  updateMyPlacementSheetProgress,
} from "../controllers/placementSheetController.js";

const router = express.Router();

router.use(requireAuth());
router.get("/me", getMyPlacementSheetProgress);
router.patch("/me", updateMyPlacementSheetProgress);
router.patch("/me/daily-target", updateMyPlacementDailyTarget);
router.get("/leaderboard", getGlobalPlacementSheetLeaderboard);

export default router;
