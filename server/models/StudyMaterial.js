import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 2000, default: "" },
    examFocus: {
      type: String,
      required: true,
      enum: [
        "placement",
        "gate",
        "cat",
        "banking",
        "ssc",
        "upsc",
        "jee",
        "neet",
        "general",
      ],
      default: "general",
    },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ["image", "pdf"], required: true },
    /** Cloudinary public_id for deletion */
    cloudinaryPublicId: { type: String, required: true },
    cloudinaryResourceType: { type: String, enum: ["image", "raw"], required: true },
    uploaderId: { type: String, required: true, index: true },
    uploaderName: { type: String, default: "Student" },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

studyMaterialSchema.index({ examFocus: 1, createdAt: -1 });

export default mongoose.model("StudyMaterial", studyMaterialSchema);
