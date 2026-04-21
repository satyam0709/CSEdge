import mongoose from "mongoose";

const mentorSettingsSchema = new mongoose.Schema(
  {
    notifyEmail: { type: String, default: "", trim: true, maxlength: 320 },
    googleMeetLink: { type: String, default: "", trim: true, maxlength: 2000 },
    availabilityText: { type: String, default: "", trim: true, maxlength: 8000 },
    isLive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("MentorSettings", mentorSettingsSchema);