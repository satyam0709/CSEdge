import mongoose from "mongoose";

const testAttemptSchema = new mongoose.Schema({
  userId: String,
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
  type: {
    type: String,
    enum: ["aptitude", "dsa", "dev", "sql", "bpsc"]
  },
  level: Number,
  isCorrect: Boolean,
  timeTaken: Number,
  selectedAnswer: { type: String, default: "" },
  correctAnswer: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("TestAttempt", testAttemptSchema);
