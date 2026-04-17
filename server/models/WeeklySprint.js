import mongoose from "mongoose";

const weeklySprintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isPublished: { type: Boolean, default: true },
    featuredCount: { type: Number, default: 5, min: 1, max: 20 },
  },
  { timestamps: true }
);

weeklySprintSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model("WeeklySprint", weeklySprintSchema);
