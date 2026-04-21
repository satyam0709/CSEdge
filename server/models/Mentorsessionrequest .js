import mongoose from "mongoose";

const mentorSessionRequestSchema = new mongoose.Schema(
  {
    fromName: { type: String, required: true, trim: true, maxlength: 200 },
    fromEmail: { type: String, required: true, trim: true, maxlength: 320 },
    topic: { type: String, required: true, trim: true, maxlength: 300 },
    message: { type: String, required: true, trim: true, maxlength: 8000 },
    status: {
      type: String,
      enum: ["pending", "seen", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

mentorSessionRequestSchema.index({ createdAt: -1 });
mentorSessionRequestSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("MentorSessionRequest", mentorSessionRequestSchema);