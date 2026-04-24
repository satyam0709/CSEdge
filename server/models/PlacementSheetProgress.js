import mongoose from "mongoose";
import { PLACEMENT_SHEET_KEYS } from "../lib/placementSheetProgress.js";

const sheetsShape = {};
for (const key of PLACEMENT_SHEET_KEYS) {
  sheetsShape[key] = { type: Number, default: 0, min: 0 };
}

const placementSheetProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    sheets: {
      type: new mongoose.Schema(sheetsShape, { _id: false }),
      default: {},
    },
    dailyTarget: { type: Number, default: 5, min: 1, max: 300 },
    activityDays: [{ type: String }],
    dailySolvedMap: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

const PlacementSheetProgress = mongoose.model("PlacementSheetProgress", placementSheetProgressSchema);
export default PlacementSheetProgress;
