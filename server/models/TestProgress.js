import mongoose from "mongoose";

const testProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  testType: {
    type: String,
    enum: ["aptitude", "dsa", "dev"],
    required: true
  },
  currentLevel: {
    type: Number,
    default: 1
  },
  attemptedQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  }]
}, { timestamps: true });

testProgressSchema.index({ userId: 1, testType: 1 }, { unique: true });

export default mongoose.model("TestProgress", testProgressSchema);
