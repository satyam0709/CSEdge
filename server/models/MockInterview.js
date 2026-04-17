import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    score: { type: Number, min: 1, max: 5, default: 3 },
    good: [{ type: String }],
    missing: [{ type: String }],
    summary: { type: String, default: "" },
    sampleAnswer: { type: String, default: "" },
  },
  { _id: false }
);

const questionEntrySchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    hint: { type: String, default: "" },
    answer: { type: String, default: "" },
    feedback: { type: feedbackSchema, default: null },
    answeredAt: { type: Date },
  },
  { _id: false }
);

const mockInterviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    role: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    totalQuestions: { type: Number, default: 5 },
    questions: [questionEntrySchema],
    currentIndex: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    overallScore: { type: Number, default: 0 },
    overallFeedback: { type: String, default: "" },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

mockInterviewSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("MockInterview", mockInterviewSchema);
