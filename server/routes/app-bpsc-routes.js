import express from "express";
import { requireAuth } from "@clerk/express";
import { getBpscAccessStatus, getBpscDashboard } from "../controllers/bpscController.js";
import { requireBpscAccess } from "../middlewares/requireBpscAccess.js";

const router = express.Router();

router.get("/access", requireAuth(), getBpscAccessStatus);
router.get("/dashboard", requireAuth(), requireBpscAccess, getBpscDashboard);

export default router;
