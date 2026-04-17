import Question from "../models/Question.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
====================================
ADD QUESTION
====================================
*/
export const addQuestion = async (req, res) => {
  try {
    const {
      type,
      level,
      question,
      options,
      correctAnswer,
      explanation,
      topic,
      platform,
      starterCode,
      constraints,
      sampleInput,
      sampleOutput,
    } = req.body;

    // Validation
    if (!type || !level || !question || !options || !correctAnswer) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    if (level < 1 || level > 50) {
      return res.status(400).json({
        success: false,
        message: "Level must be between 1 and 50"
      });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({
        success: false,
        message: "Correct answer must be inside options"
      });
    }

    const newQuestion = await Question.create({
      type,
      level,
      question,
      options,
      correctAnswer,
      explanation,
      topic,
      platform,
      starterCode,
      constraints,
      sampleInput,
      sampleOutput,
    });

    res.json({
      success: true,
      question: newQuestion
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
====================================
GET ALL QUESTIONS (WITH FILTER)
====================================
*/
export const getQuestions = async (req, res) => {
  try {
    const { type, level } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (level) filter.level = Number(level);

    const questions = await Question.find(filter).sort({
      level: 1,
      createdAt: -1
    });

    res.json({
      success: true,
      questions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
====================================
UPDATE QUESTION
====================================
*/
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      type,
      level,
      question,
      options,
      correctAnswer,
      explanation,
      topic
    } = req.body;

    if (level < 1 || level > 50) {
      return res.status(400).json({
        success: false,
        message: "Level must be between 1 and 50"
      });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({
        success: false,
        message: "Correct answer must be inside options"
      });
    }

    const updated = await Question.findByIdAndUpdate(
      id,
      {
        type,
        level,
        question,
        options,
        correctAnswer,
        explanation,
        topic
      },
      { new: true }
    );

    res.json({
      success: true,
      question: updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
====================================
DELETE QUESTION
====================================
*/
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    await Question.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Question deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
====================================
SEED SQL QUESTIONS  POST /api/admin/seed-sql
Reads server/data/sql.json and upserts all SQL questions.
Only removes existing type=sql documents — other types untouched.
====================================
*/
export const seedSqlQuestions = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../data/sql.json");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "sql.json not found in server/data/" });
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    if (!raw.trim()) {
      return res.status(400).json({ success: false, message: "sql.json is empty" });
    }

    const questions = JSON.parse(raw);

    // Validate
    const errors = [];
    const validated = [];
    for (let i = 0; i < questions.length; i++) {
      const q = { ...questions[i] };
      if (q.type !== "sql") { errors.push(`[${i}] type must be "sql"`); continue; }
      if (!q.level || q.level < 1 || q.level > 50) { errors.push(`[${i}] invalid level: ${q.level}`); continue; }
      if (!Array.isArray(q.options) || q.options.length < 4) { errors.push(`[${i}] needs 4 options`); continue; }
      q.question = q.question.trim();
      q.options = q.options.map(o => o.trim());
      q.correctAnswer = q.correctAnswer.trim();
      if (!q.options.includes(q.correctAnswer)) { errors.push(`[${i}] correctAnswer not in options: "${q.question.slice(0, 40)}"`); continue; }
      validated.push(q);
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation errors", errors: errors.slice(0, 10) });
    }

    // Deduplicate
    const unique = [];
    const seen = new Set();
    for (const q of validated) {
      const key = `${q.type}-${q.level}-${q.question.toLowerCase()}`;
      if (!seen.has(key)) { seen.add(key); unique.push(q); }
    }

    // Count by level for summary
    const byLevel = {};
    unique.forEach(q => { byLevel[q.level] = (byLevel[q.level] || 0) + 1; });
    const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

    // Remove old SQL questions only
    const deleted = await Question.deleteMany({ type: "sql" });

    // Insert fresh
    await Question.insertMany(unique);

    return res.json({
      success: true,
      message: `✅ Seeded ${unique.length} SQL questions across ${levels.length} levels (removed ${deleted.deletedCount} old)`,
      stats: {
        total: unique.length,
        levels: levels.length,
        levelRange: `${levels[0]} – ${levels[levels.length - 1]}`,
        duplicatesRemoved: validated.length - unique.length,
        byLevel,
      }
    });

  } catch (error) {
    console.error("seedSqlQuestions error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
