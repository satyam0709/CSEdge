import Resume from "../models/Resume.js";

/** GET /api/resume */
export const getResume = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const resume = await Resume.findOne({ userId });
    return res.json({ success: true, resume: resume || null });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

/** POST /api/resume  — create or update */
export const saveResume = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { personal, education, experience, projects, skills, certifications, achievements, template } = req.body;

    const resume = await Resume.findOneAndUpdate(
      { userId },
      { $set: { personal, education, experience, projects, skills, certifications, achievements, template } },
      { new: true, upsert: true, runValidators: true }
    );

    return res.json({ success: true, resume });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

/** DELETE /api/resume */
export const deleteResume = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    await Resume.deleteOne({ userId });
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
