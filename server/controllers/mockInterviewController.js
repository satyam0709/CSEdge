/**
 * Mock Interview Simulator controller
 * Uses Gemini (primary) / OpenAI (fallback) to generate questions and evaluate answers.
 * Follows the same AI call pattern as chatController.js
 */

import MockInterview from "../models/MockInterview.js";
import {
  buildGeminiModelList,
  isRetryableGeminiError,
  sleep,
} from "../lib/geminiModelRotation.js";

// ── AI helpers ────────────────────────────────────────────────────────────────

/** Strip markdown code fences and parse JSON from AI response */
function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  return JSON.parse(raw.trim());
}

async function callGeminiRaw(prompt) {
  const apiKey =
    process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_AI_API_KEY?.trim();
  if (!apiKey) return { ok: false, status: 503, message: "No Gemini API key configured." };

  const models = buildGeminiModelList();
  const retryDelayMs = Math.min(
    Math.max(Number(process.env.GEMINI_RETRY_DELAY_MS) || 2500, 500),
    15000
  );
  const maxAttempts = Math.min(
    Math.max(Number(process.env.GEMINI_MAX_ATTEMPTS_PER_MODEL) || 2, 1),
    4
  );

  let lastErr = "Gemini request failed";
  for (const model of models) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (attempt > 0) await sleep(retryDelayMs);
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          model
        )}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const r = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
          }),
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
          lastErr = data?.error?.message || r.statusText || lastErr;
          if (!isRetryableGeminiError(lastErr, r.status)) return { ok: false, status: 502, message: lastErr };
          continue;
        }
        const parts = data?.candidates?.[0]?.content?.parts;
        const reply = Array.isArray(parts) ? parts.map((p) => p.text || "").join("").trim() : "";
        if (!reply) { lastErr = "Empty Gemini response"; continue; }
        return { ok: true, reply };
      } catch (e) {
        lastErr = e.message || lastErr;
      }
    }
  }
  return { ok: false, status: 503, message: lastErr };
}

async function callOpenAIRaw(prompt) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return { ok: false, status: 503, message: "No OpenAI API key configured." };
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, status: 502, message: data?.error?.message || r.statusText };
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) return { ok: false, status: 502, message: "Empty OpenAI response." };
    return { ok: true, reply };
  } catch (e) {
    return { ok: false, status: 502, message: e.message };
  }
}

async function callAI(prompt) {
  const provider = (process.env.CHAT_PROVIDER || "auto").toLowerCase();
  const hasGemini = !!(process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_AI_API_KEY?.trim());
  const hasOpenAI = !!process.env.OPENAI_API_KEY?.trim();
  const allowFallback = String(process.env.CHAT_FALLBACK_OPENAI || "").toLowerCase() === "true";

  if (provider === "openai") return callOpenAIRaw(prompt);
  if (provider === "gemini") return callGeminiRaw(prompt);

  // auto
  if (hasGemini) {
    const r = await callGeminiRaw(prompt);
    if (r.ok || !hasOpenAI || !allowFallback) return r;
    return callOpenAIRaw(prompt);
  }
  if (hasOpenAI) return callOpenAIRaw(prompt);
  return { ok: false, status: 503, message: "No AI API key configured. Add GEMINI_API_KEY or OPENAI_API_KEY to server/.env" };
}

// ── Question generation ───────────────────────────────────────────────────────

async function generateQuestions(role, difficulty, count) {
  const prompt = `You are an expert technical interviewer for software engineering roles.
Generate exactly ${count} interview questions for a "${role}" interview at ${difficulty} difficulty level.
Mix question types: conceptual, practical, problem-solving, and behavioral (for HR roles).

Return ONLY a valid JSON array with no markdown, no extra text, in this exact format:
[
  {
    "question": "...",
    "hint": "one-line tip for a strong answer",
    "sampleAnswer": "a concise ideal answer (2-4 sentences)"
  }
]`;

  const result = await callAI(prompt);
  if (!result.ok) return { ok: false, message: result.message };

  try {
    const parsed = extractJson(result.reply);
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Invalid questions array");
    const questions = parsed.slice(0, count).map((q) => ({
      question: String(q.question || "").trim(),
      hint: String(q.hint || "").trim(),
      answer: "",
      feedback: null,
    }));
    return { ok: true, questions };
  } catch (e) {
    console.error("[mockInterview] Failed to parse questions JSON:", e.message, "\nRaw:", result.reply?.slice(0, 300));
    return { ok: false, message: "AI returned malformed questions. Please try again." };
  }
}

// ── Answer evaluation ─────────────────────────────────────────────────────────

async function evaluateAnswer(role, question, answer, difficulty) {
  const prompt = `You are evaluating a candidate's answer in a mock interview for a "${role}" position (${difficulty} level).

Question: ${question}
Candidate's answer: ${answer || "(no answer given)"}

Evaluate the answer fairly. Return ONLY valid JSON with no markdown, no extra text:
{
  "score": <integer 1 to 5>,
  "good": ["strength 1", "strength 2"],
  "missing": ["gap 1", "gap 2"],
  "summary": "one concise paragraph of overall feedback",
  "sampleAnswer": "a model answer (3-5 sentences)"
}`;

  const result = await callAI(prompt);
  if (!result.ok) {
    return {
      ok: true,
      feedback: {
        score: 3,
        good: ["Answer received"],
        missing: ["Detailed evaluation unavailable (AI error)"],
        summary: "Could not evaluate this answer automatically. Review it manually.",
        sampleAnswer: "",
      },
    };
  }

  try {
    const parsed = extractJson(result.reply);
    return {
      ok: true,
      feedback: {
        score: Math.min(5, Math.max(1, Number(parsed.score) || 3)),
        good: Array.isArray(parsed.good) ? parsed.good : [],
        missing: Array.isArray(parsed.missing) ? parsed.missing : [],
        summary: String(parsed.summary || ""),
        sampleAnswer: String(parsed.sampleAnswer || ""),
      },
    };
  } catch (e) {
    console.error("[mockInterview] Failed to parse feedback JSON:", e.message);
    return {
      ok: true,
      feedback: {
        score: 3,
        good: [],
        missing: [],
        summary: "Evaluation could not be parsed. Please review your answer.",
        sampleAnswer: "",
      },
    };
  }
}

// ── Route handlers ────────────────────────────────────────────────────────────

/** POST /api/mock-interview/start */
export const startSession = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { role = "Full Stack Developer", difficulty = "medium", totalQuestions = 5 } = req.body;
    const count = Math.min(Math.max(Number(totalQuestions) || 5, 3), 15);

    const gen = await generateQuestions(role, difficulty, count);
    if (!gen.ok) return res.status(503).json({ success: false, message: gen.message });

    const session = await MockInterview.create({
      userId,
      role,
      difficulty,
      totalQuestions: gen.questions.length,
      questions: gen.questions,
      currentIndex: 0,
      status: "active",
    });

    return res.json({
      success: true,
      sessionId: session._id,
      question: gen.questions[0].question,
      hint: gen.questions[0].hint,
      questionNumber: 1,
      totalQuestions: gen.questions.length,
    });
  } catch (e) {
    console.error("[mockInterview/start]", e);
    return res.status(500).json({ success: false, message: e.message || "Failed to start session" });
  }
};

/** POST /api/mock-interview/answer */
export const submitAnswer = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { sessionId, answer = "", questionIndex } = req.body;
    if (!sessionId) return res.status(400).json({ success: false, message: "sessionId is required" });

    const session = await MockInterview.findOne({ _id: sessionId, userId });
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    if (session.status === "completed") return res.status(400).json({ success: false, message: "Session already completed" });

    const idx = Number.isInteger(Number(questionIndex)) ? Number(questionIndex) : session.currentIndex;
    if (idx >= session.questions.length) {
      return res.status(400).json({ success: false, message: "Invalid question index" });
    }

    // Evaluate the answer
    const q = session.questions[idx];
    const evalResult = await evaluateAnswer(session.role, q.question, answer, session.difficulty);
    const feedback = evalResult.feedback;

    // Persist answer + feedback
    session.questions[idx].answer = answer;
    session.questions[idx].feedback = feedback;
    session.questions[idx].answeredAt = new Date();

    const nextIndex = idx + 1;
    const isComplete = nextIndex >= session.questions.length;

    if (isComplete) {
      // Compute overall score
      const scores = session.questions.map((q) => q.feedback?.score || 0);
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      session.overallScore = Math.round(avg * 10) / 10;
      session.overallFeedback = `You completed all ${session.questions.length} questions for "${session.role}". Overall rating: ${session.overallScore}/5.`;
      session.status = "completed";
      session.completedAt = new Date();
    } else {
      session.currentIndex = nextIndex;
    }

    session.markModified("questions");
    await session.save();

    const response = {
      success: true,
      feedback,
      isComplete,
    };

    if (!isComplete) {
      response.nextQuestion = session.questions[nextIndex].question;
      response.nextHint = session.questions[nextIndex].hint;
      response.questionNumber = nextIndex + 1;
      response.totalQuestions = session.totalQuestions;
    } else {
      response.summary = {
        overallScore: session.overallScore,
        overallFeedback: session.overallFeedback,
        totalQuestions: session.totalQuestions,
        breakdown: session.questions.map((q, i) => ({
          index: i,
          question: q.question,
          score: q.feedback?.score || 0,
          summary: q.feedback?.summary || "",
        })),
      };
    }

    return res.json(response);
  } catch (e) {
    console.error("[mockInterview/answer]", e);
    return res.status(500).json({ success: false, message: e.message || "Failed to submit answer" });
  }
};

/** GET /api/mock-interview/sessions */
export const getSessions = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const sessions = await MockInterview.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("_id role difficulty status overallScore totalQuestions createdAt completedAt");

    return res.json({ success: true, sessions });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

/** GET /api/mock-interview/session/:id */
export const getSession = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const session = await MockInterview.findOne({ _id: req.params.id, userId });
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    return res.json({ success: true, session });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

/** DELETE /api/mock-interview/session/:id */
export const deleteSession = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    await MockInterview.deleteOne({ _id: req.params.id, userId });
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
