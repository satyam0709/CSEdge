import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Question from "../models/Question.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const loadJSON = (file) => {
  const filePath = path.join(__dirname, "../data", file);
  console.log(`📂 Loading: ${filePath}`);
  const raw = fs.readFileSync(filePath, "utf-8");
  if (!raw || raw.trim().length === 0) throw new Error(`❌ ${file} is EMPTY`);
  return JSON.parse(raw);
};

const validate = (q, idx) => {
  if (!q.type || q.type !== "sql")
    throw new Error(`[${idx}] type must be "sql", got: ${q.type}`);
  if (!q.level || q.level < 1 || q.level > 50)
    throw new Error(`[${idx}] invalid level: ${q.level}`);
  if (!Array.isArray(q.options) || q.options.length < 4)
    throw new Error(`[${idx}] needs 4 options: "${q.question?.slice(0, 40)}"`);
  q.question = q.question.trim();
  q.options = q.options.map((o) => o.trim());
  q.correctAnswer = q.correctAnswer.trim();
  if (!q.options.includes(q.correctAnswer))
    throw new Error(`[${idx}] correctAnswer not in options: "${q.question?.slice(0, 40)}"`);
};

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set in server/.env");
    }

    await mongoose.connect(`${process.env.MONGODB_URI}/LMS`);
    console.log("✅ Connected to MongoDB");

    const questions = loadJSON("sql.json");
    console.log(`📊 Loaded ${questions.length} SQL questions from sql.json`);

    // Validate every question
    questions.forEach((q, i) => validate(q, i));
    console.log("✅ All questions validated");

    // Deduplicate by (type + level + question text)
    const unique = [];
    const seen = new Set();
    for (const q of questions) {
      const key = `${q.type}-${q.level}-${q.question.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(q);
      }
    }
    console.log(`🔑 ${unique.length} unique questions (${questions.length - unique.length} duplicates removed)`);

    // Count by level
    const byLevel = {};
    unique.forEach((q) => { byLevel[q.level] = (byLevel[q.level] || 0) + 1; });
    const levels = Object.keys(byLevel).sort((a, b) => Number(a) - Number(b));
    console.log(`📈 Covering levels: ${levels[0]} → ${levels[levels.length - 1]}  (${levels.length} levels)`);

    // Remove ONLY existing sql questions — other types untouched
    const deleted = await Question.deleteMany({ type: "sql" });
    console.log(`🗑️  Removed ${deleted.deletedCount} old SQL questions`);

    // Insert new ones
    await Question.insertMany(unique);
    console.log(`\n🎉 Successfully seeded ${unique.length} SQL questions across ${levels.length} levels!\n`);

    // Summary table
    console.log("Level | Count");
    console.log("------+------");
    levels.forEach((lvl) => {
      console.log(`  ${String(lvl).padStart(2, "0")}  |  ${byLevel[lvl]}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
