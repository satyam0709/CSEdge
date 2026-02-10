import mongoose from "mongoose";

const testAttemptSchema = new mongoose.Schema({
  userId: String,
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
  type: {
    type: String,
    enum: ["aptitude", "dsa", "dev"]
  },
  level: Number,
  isCorrect: Boolean,
  timeTaken: Number
}, { timestamps: true });

export default mongoose.model("TestAttempt", testAttemptSchema);
