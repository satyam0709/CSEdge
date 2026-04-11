/**
 * Generate MCQs strictly from video lecture context (transcript + metadata) using the same
 * API keys as the lecture chat assistant (Gemini and/or OpenAI).
 */

import {
  buildGeminiModelList,
  isRetryableGeminiError,
  sleep,
} from "./geminiModelRotation.js";

function parseJsonFromModelText(raw) {
  if (!raw || typeof raw !== "string") throw new Error("Empty model response");
  let t = raw.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "");
  }
  try {
    const data = JSON.parse(t);
    if (!data || !Array.isArray(data.questions)) {
      throw new Error("missing questions array");
    }
    return data.questions;
  } catch {
    const start = t.indexOf("{");
    const end = t.lastIndexOf("}");
    if (start >= 0 && end > start) {
      const slice = t.slice(start, end + 1);
      const data = JSON.parse(slice);
      if (data && Array.isArray(data.questions)) return data.questions;
    }
    throw new Error(
      "The AI returned invalid JSON. Try Generate again, or check server logs."
    );
  }
}

function validateQuestions(rawList, expectedCount) {
  if (rawList.length !== expectedCount) {
    throw new Error(`Expected exactly ${expectedCount} questions, got ${rawList.length}`);
  }
  const out = [];
  for (let i = 0; i < rawList.length; i++) {
    const q = rawList[i];
    const question = String(q.question || "").trim();
    const options = Array.isArray(q.options) ? q.options.map((o) => String(o).trim()) : [];
    const correctIndex = Number(q.correctIndex);
    const explanation = String(q.explanation || "").trim();
    const topic = String(q.topic || "").trim();

    if (question.length < 8 || question.length > 800) {
      throw new Error(`Question ${i + 1}: invalid length`);
    }
    if (options.length !== 4 || options.some((o) => !o)) {
      throw new Error(`Question ${i + 1}: need exactly 4 non-empty options`);
    }
    const set = new Set(options.map((o) => o.toLowerCase()));
    if (set.size !== 4) {
      throw new Error(`Question ${i + 1}: options must be distinct`);
    }
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) {
      throw new Error(`Question ${i + 1}: correctIndex must be 0–3`);
    }
    out.push({ question, options, correctIndex, explanation, topic });
  }
  return out;
}

function buildPrompt(contextBlock, questionCount) {
  return `You write revision flashcards for ONE video lecture only.

Rules:
- Use ONLY facts, terms, and ideas that appear in the VIDEO CONTEXT below (transcript, YouTube description, titles, course excerpt).
- Do NOT use generic aptitude puzzles or unrelated trivia.
- If the transcript is missing or thin, still write questions grounded in the visible titles and descriptions only; do not invent specific claims not hinted in the context.
- Exactly ${questionCount} multiple-choice questions.
- Each question: exactly 4 options, one clearly correct from the context.
- correctIndex is 0-based index into the "options" array.

Return ONLY valid JSON (no markdown) in this exact shape:
{"questions":[{"question":"string","options":["A","B","C","D"],"correctIndex":0,"explanation":"one short sentence","topic":"short label e.g. Definitions"}]}

VIDEO CONTEXT (this is the ONLY source of truth for content):
---
${contextBlock}
---
`;
}

async function callOpenAIJson(prompt) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: Math.min(Number(process.env.OPENAI_MAX_TOKENS) || 4096, 8192),
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You output only valid JSON objects. No markdown fences. Follow the user's schema exactly.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(data?.error?.message || r.statusText || "OpenAI request failed");
  }
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty OpenAI response");
  return text;
}

async function callGeminiJsonOnce(prompt, model, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: Math.min(Number(process.env.GEMINI_MAX_TOKENS) || 8192, 8192),
        responseMimeType: "application/json",
      },
    }),
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg =
      data?.error?.message || data?.error?.status || r.statusText || "Gemini request failed";
    return { ok: false, errMsg: msg, httpStatus: r.status };
  }
  const parts = data?.candidates?.[0]?.content?.parts;
  const text = Array.isArray(parts)
    ? parts.map((p) => p.text || "").join("").trim()
    : "";
  const blockReason = data?.candidates?.[0]?.finishReason;
  if (!text) {
    return {
      ok: false,
      errMsg:
        blockReason === "SAFETY"
          ? "Reply was blocked by safety filters."
          : "Empty Gemini response.",
      httpStatus: r.status,
    };
  }
  return { ok: true, text };
}

/**
 * Try multiple Gemini models (same order as lecture chat). Avoids gemini-2.0-flash-only when quota is 0.
 */
async function callGeminiJsonWithRotation(prompt) {
  const apiKey =
    process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_AI_API_KEY?.trim();
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const models = buildGeminiModelList();
  const retryDelayMs = Math.min(
    Math.max(Number(process.env.GEMINI_RETRY_DELAY_MS) || 2500, 500),
    15000
  );
  const maxAttemptsPerModel = Math.min(
    Math.max(Number(process.env.GEMINI_MAX_ATTEMPTS_PER_MODEL) || 2, 1),
    4
  );

  let lastErr = "Gemini request failed";

  for (const model of models) {
    for (let attempt = 0; attempt < maxAttemptsPerModel; attempt++) {
      if (attempt > 0) {
        await sleep(retryDelayMs);
        console.warn(`[flashPrep] Retry ${attempt + 1}/${maxAttemptsPerModel} for ${model}`);
      }
      const one = await callGeminiJsonOnce(prompt, model, apiKey);
      if (one.ok) {
        if (model !== models[0]) {
          console.warn(`[flashPrep] Using Gemini model: ${model}`);
        }
        return one.text;
      }
      lastErr = one.errMsg || lastErr;
      console.error(`[flashPrep] Gemini (${model}):`, one.errMsg);
      const retryable = isRetryableGeminiError(one.errMsg, one.httpStatus);
      if (!retryable) {
        throw new Error(lastErr);
      }
      const noQuotaForModel = /limit:\s*0|quota exceeded for metric/i.test(
        String(one.errMsg)
      );
      if (noQuotaForModel) {
        break;
      }
      if (attempt < maxAttemptsPerModel - 1) continue;
      break;
    }
  }

  let hint = lastErr;
  if (/limit:\s*0|quota|exceeded your current quota/i.test(String(lastErr))) {
    hint +=
      " — Try GEMINI_MODEL=gemini-2.5-flash-lite or gemini-1.5-flash in server/.env, or set GEMINI_MODEL_FALLBACK=gemini-1.5-flash,gemini-2.5-flash-lite. If all Gemini models fail, add OPENAI_API_KEY and CHAT_FALLBACK_OPENAI=true. See https://ai.google.dev/gemini-api/docs/rate-limits";
  }
  throw new Error(hint);
}

async function runModelJson(prompt) {
  const provider = (process.env.CHAT_PROVIDER || "auto").toLowerCase();
  const hasGemini = !!(
    process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_AI_API_KEY?.trim()
  );
  const hasOpenAI = !!process.env.OPENAI_API_KEY?.trim();
  const allowOpenAiFallback =
    String(process.env.CHAT_FALLBACK_OPENAI || "").toLowerCase() === "true";
  const flashPrepOpenAiFallback =
    String(process.env.FLASH_PREP_OPENAI_FALLBACK || "").toLowerCase() === "true";

  if (provider === "openai") {
    return callOpenAIJson(prompt);
  }
  if (provider === "gemini") {
    try {
      return await callGeminiJsonWithRotation(prompt);
    } catch (e) {
      if (hasOpenAI) {
        console.warn("[flashPrep] Gemini failed, falling back to OpenAI:", e.message);
        return callOpenAIJson(prompt);
      }
      throw e;
    }
  }

  if (hasGemini) {
    try {
      return await callGeminiJsonWithRotation(prompt);
    } catch (e) {
      if (hasOpenAI && (allowOpenAiFallback || flashPrepOpenAiFallback)) {
        console.warn("[flashPrep] Gemini failed, falling back to OpenAI:", e.message);
        return callOpenAIJson(prompt);
      }
      throw e;
    }
  }
  if (hasOpenAI) {
    return callOpenAIJson(prompt);
  }
  throw new Error(
    "Configure GEMINI_API_KEY or OPENAI_API_KEY for Flash-Prep (same as the lecture assistant)."
  );
}

/**
 * @returns {{ questionsForClient: object[], correctIndices: number[], explanations: string[] }}
 */
export async function generateVideoFlashPrepMcqs({ contextBlock, questionCount }) {
  const n = Math.min(10, Math.max(5, Math.floor(Number(questionCount) || 7)));
  const prompt = buildPrompt(contextBlock, n);
  const rawText = await runModelJson(prompt);
  const rawList = parseJsonFromModelText(rawText);
  const validated = validateQuestions(rawList, n);

  const correctIndices = validated.map((q) => q.correctIndex);
  const explanations = validated.map((q) => q.explanation || "");

  const questionsForClient = validated.map((q, index) => ({
    index,
    question: q.question,
    options: q.options,
    category: q.topic || "This lecture",
  }));

  return { questionsForClient, correctIndices, explanations };
}
