import mongoose from "mongoose";

const flashPrepSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    courseId: { type: String, required: true },
    lectureId: { type: String, required: true },
    videoId: { type: String, default: "" },
    correctIndices: { type: [Number], required: true },
    explanations: { type: [String], default: [] },
    expiresAt: { type: Date, required: true },
  },
  { minimize: false }
);

flashPrepSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
flashPrepSessionSchema.index({ userId: 1, courseId: 1, lectureId: 1 });

export default mongoose.model("FlashPrepSession", flashPrepSessionSchema);
