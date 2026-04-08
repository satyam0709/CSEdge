import mongoose from "mongoose";

const lectureNoteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    courseId: { type: String, required: true, index: true },
    lectureId: { type: String, required: true },
    content: { type: String, default: "" },
  },
  { timestamps: true }
);

lectureNoteSchema.index(
  { userId: 1, courseId: 1, lectureId: 1 },
  { unique: true }
);

export default mongoose.model("LectureNote", lectureNoteSchema);
