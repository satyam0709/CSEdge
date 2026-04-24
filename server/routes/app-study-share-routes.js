import express from "express";
import { requireAuth } from "@clerk/express";
import { uploadStudyFile } from "../configs/multerStudy.js";
import {
  listStudyMaterials,
  uploadStudyMaterial,
  deleteStudyMaterial,
  viewStudyMaterial,
} from "../controllers/studyShareController.js";

const router = express.Router();

router.get("/", listStudyMaterials);
router.get("/:id/view", viewStudyMaterial);

router.post("/", requireAuth(), (req, res, next) => {
  uploadStudyFile.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Invalid file",
      });
    }
    next();
  });
}, uploadStudyMaterial);

router.delete("/:id", requireAuth(), deleteStudyMaterial);

export default router;
