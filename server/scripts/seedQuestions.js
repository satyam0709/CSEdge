import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Question from "../models/Question.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load JSON manually
const loadJSON = (file) => {
  const filePath = path.join(__dirname, "../data", file);
  console.log(`Loading: ${filePath}`);

  const raw = fs.readFileSync(filePath, "utf-8");

  if (!raw || raw.trim().length === 0) {
    throw new Error(`❌ ${file} is EMPTY`);
  }

  return JSON.parse(raw);
};


const aptitude = loadJSON("aptitude.json");
const dsa = loadJSON("dsa.json");
const dev = loadJSON("dev.json");

const normalize = (str) => str.trim();

const validateQuestion = (q) => {
  if (q.level < 1 || q.level > 50) {
    throw new Error(`Invalid level: ${q.level}`);
  }

  if (!q.options || q.options.length < 4) {
    throw new Error(`Less than 4 options: ${q.question}`);
  }

  q.question = normalize(q.question);
  q.options = q.options.map(opt => normalize(opt));
  q.correctAnswer = normalize(q.correctAnswer);

  if (!q.options.includes(q.correctAnswer)) {
    throw new Error(`Correct answer not in options: ${q.question}`);
  }
};

const seed = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/LMS`);

    const allQuestions = [
      ...aptitude,
      ...dsa,
      ...dev
    ];

    allQuestions.forEach(validateQuestion);

    const unique = [];
    const seen = new Set();

    for (const q of allQuestions) {
      const key = `${q.type}-${q.question.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(q);
      }
    }

    if (unique.length < 50) {
      console.warn("⚠️ Warning: Very small dataset. Add more questions.");
    }

    await Question.deleteMany({});
    await Question.insertMany(unique);

    console.log(`✅ Seeded ${unique.length} questions`);
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
