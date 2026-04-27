import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Question from "../models/Question.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadBpscJson() {
  const filePath = path.join(__dirname, "../data/bpsc.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function cleanText(v) {
  return String(v || "").replace(/\s+/g, " ").trim();
}

function flattenQuestions(raw) {
  const rows = [];
  (raw || []).slice(0, 6).forEach((exam, examIndex) => {
    const testNumber = examIndex + 1; // Test 1 ... Test 6
    const sectionBlocks = Array.isArray(exam.sections)
      ? exam.sections.map((s) => ({ sectionName: s.section_name || "", questions: s.questions || [] }))
      : [{ sectionName: exam.section_name || "", questions: exam.questions || [] }];

    sectionBlocks.forEach((section) => {
      (section.questions || []).forEach((q) => {
        const options = Array.isArray(q.options) ? q.options.map(cleanText).filter(Boolean) : [];
        const question = cleanText(q.question_text);
        const correctAnswer = cleanText(q.correct_answer);
        if (!question || options.length < 4 || !correctAnswer) return;
        rows.push({
          testNumber,
          topic: cleanText(q.topic || section.sectionName || "General Knowledge"),
          question,
          options,
          correctAnswer,
          explanation: cleanText(q.explanation || ""),
        });
      });
    });
  });
  return rows;
}

async function seed() {
  await mongoose.connect(`${process.env.MONGODB_URI}/LMS`);
  const raw = loadBpscJson();
  const rows = flattenQuestions(raw);

  const docs = [];
  rows.forEach((r) => {
    docs.push({
      type: "bpsc",
      level: r.testNumber, // test-wise levels: 1..6
      topic: `Test ${r.testNumber} · ${r.topic}`,
      question: r.question,
      options: r.options,
      correctAnswer: r.correctAnswer,
      explanation: r.explanation,
    });
  });

  const seen = new Set();
  const unique = docs.filter((d) => {
    const k = `${d.level}-${d.question.toLowerCase()}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  await Question.deleteMany({ type: "bpsc" });
  await Question.insertMany(unique);
  const counts = await Question.aggregate([
    { $match: { type: "bpsc" } },
    { $group: { _id: "$level", total: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  console.log(`Seeded BPSC questions: ${unique.length}`);
  console.log("BPSC test-wise totals:", counts.map((c) => `Test ${c._id}: ${c.total}`).join(", "));
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
