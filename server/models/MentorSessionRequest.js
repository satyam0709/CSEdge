import mongoose from "mongoose";

const mentorSessionRequestSchema = new mongoose.Schema(
  {
    fromName: { type: String, required: true, trim: true, maxlength: 200 },
    fromEmail: { type: String, required: true, trim: true, maxlength: 320 },
    topic: { type: String, required: true, trim: true, maxlength: 300 },
    message: { type: String, required: true, trim: true, maxlength: 8000 },
  },
  { timestamps: true }
);

mentorSessionRequestSchema.index({ createdAt: -1 });

const MentorSessionRequest = mongoose.model(
  "MentorSessionRequest",
  mentorSessionRequestSchema
);
export default MentorSessionRequest;
