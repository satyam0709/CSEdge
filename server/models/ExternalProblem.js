import mongoose from "mongoose";

const externalProblemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  url: { type: String, required: true },
  title: { type: String, default: '' },
  source: { type: String, default: '' },
  type: { type: String, enum: ['dsa', 'dev', 'aptitude', 'coding', 'other'], default: 'dsa' },
  solved: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('ExternalProblem', externalProblemSchema);
