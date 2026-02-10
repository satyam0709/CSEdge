import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["aptitude", "dsa", "dev", "development", "coding"],
    required: true
  },
  level: {
    type: Number,
    min: 1,
    max: 50,
    required: true
  },
  topic: {
    type: String,
    default: ""
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    validate: v => v.length >= 4
  },
  correctAnswer: {
    type: String,
    required: true,
    trim: true
  },
  explanation: {
    type: String,
    default: ""
  }
}, { timestamps: true });

questionSchema.index({ type: 1, level: 1 });

export default mongoose.model("Question", questionSchema);
