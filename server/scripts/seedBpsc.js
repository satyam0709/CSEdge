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

function levelFromDifficulty(difficulty, indexInBucket) {
  const d = String(difficulty || "easy").toLowerCase();
  const step = Math.floor(indexInBucket / 15);
  if (d === "hard") return Math.min(50, 35 + step);
  if (d === "medium") return Math.min(34, 18 + step);
  return Math.min(17, 1 + step);
}

function flattenQuestions(raw) {
  const rows = [];
  for (const exam of raw || []) {
    for (const section of exam.sections || []) {
      for (const q of section.questions || []) {
        const options = Array.isArray(q.options) ? q.options.map(cleanText).filter(Boolean) : [];
        const question = cleanText(q.question_text);
        const correctAnswer = cleanText(q.correct_answer);
        if (!question || options.length < 4 || !correctAnswer) continue;
        rows.push({
          difficulty: cleanText(q.level || "easy").toLowerCase(),
          topic: cleanText(q.topic || section.section_name || "General"),
          question,
          options,
          correctAnswer,
          explanation: cleanText(q.explanation || ""),
        });
      }
    }
  }
  return rows;
}

async function seed() {
  await mongoose.connect(`${process.env.MONGODB_URI}/LMS`);
  const raw = loadBpscJson();
  const rows = flattenQuestions(raw);

  const buckets = { easy: [], medium: [], hard: [] };
  for (const r of rows) {
    const key = r.difficulty === "hard" ? "hard" : r.difficulty === "medium" ? "medium" : "easy";
    buckets[key].push(r);
  }

  const docs = [];
  for (const key of ["easy", "medium", "hard"]) {
    buckets[key].forEach((r, idx) => {
      docs.push({
        type: "bpsc",
        level: levelFromDifficulty(key, idx),
        topic: r.topic,
        question: r.question,
        options: r.options,
        correctAnswer: r.correctAnswer,
        explanation: r.explanation,
      });
    });
  }

  const seen = new Set();
  const unique = docs.filter((d) => {
    const k = `${d.level}-${d.question.toLowerCase()}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  await Question.deleteMany({ type: "bpsc" });
  await Question.insertMany(unique);
  console.log(`Seeded BPSC questions: ${unique.length}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
