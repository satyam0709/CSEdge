/**
 * Lecture assistant — supports:
 * - Google Gemini (free tier via AI Studio) — set GEMINI_API_KEY or GOOGLE_AI_API_KEY
 * - OpenAI — set OPENAI_API_KEY (paid / credits)
 *
 * Provider: CHAT_PROVIDER=auto|gemini|openai
 *   auto → Gemini if GEMINI_API_KEY is set, else OpenAI. OpenAI fallback after Gemini failure
 *   only if CHAT_FALLBACK_OPENAI=true (avoids surprise OpenAI quota errors).
 */

import {
  buildGeminiModelList,
  isRetryableGeminiError,
  sleep,
} from "../lib/geminiModelRotation.js";

const MAX_USER_MESSAGE = 3000;
const MAX_HISTORY_MESSAGES = 16;

function buildSystemPrompt(context) {
  const parts = [
    'You are a patient, clear teaching assistant for an online learning platform (LMS).',
    'Keep answers focused and easy to follow. Use short paragraphs or bullet points when helpful.',
    'If the user pastes an error message or describes a bug, explain likely causes and step-by-step fixes.',
    'Do not encourage academic dishonesty (e.g. completing graded work for them); do help them learn and debug.',
  ];
  if (context?.pageTitle || context?.pagePath) {
    parts.push(
      `Student location in the app: ${context.pageTitle || 'Unknown'}${context.pagePath ? ` (URL path: ${context.pagePath})` : ''}. They may be taking a practice test, viewing the dashboard, or browsing courses — tailor help to that context.`
    );
  }
  if (context?.courseTitle) {
    parts.push(`Course: ${context.courseTitle}`);
  }
  if (context?.chapterTitle) {
    parts.push(`Chapter / section: ${context.chapterTitle}`);
  }
  if (context?.lectureTitle) {
    parts.push(`Current lecture title: ${context.lectureTitle}`);
    parts.push(
      'They may be watching a video lecture; help with concepts, definitions, and problem-solving approaches.'
    );
  }
  return parts.join('\n');
}

function normalizeMessages(body) {
  const { messages, context } = body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return { error: { status: 400, message: 'Send a non-empty messages array.' } };
  }

  const trimmed = messages
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string'
    )
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_USER_MESSAGE),
    }))
    .slice(-MAX_HISTORY_MESSAGES);

  const lastUser = [...trimmed].reverse().find((m) => m.role === 'user');
  if (!lastUser?.content?.trim()) {
    return { error: { status: 400, message: 'Include a user message.' } };
  }

  return { trimmed, context: context || {} };
}

async function callOpenAI(trimmed, context) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      message:
        'No OpenAI key. Add OPENAI_API_KEY or use a free Gemini key: https://aistudio.google.com/apikey',
    };
  }

  const payload = {
    model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'system', content: buildSystemPrompt(context) }, ...trimmed],
    max_tokens: Math.min(Number(process.env.OPENAI_MAX_TOKENS) || 1200, 4096),
    temperature: 0.6,
  };

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await r.json().catch(() => ({}));

  if (!r.ok) {
    const errMsg = data?.error?.message || r.statusText || 'OpenAI request failed';
    console.error('[lectureChat] OpenAI error:', errMsg);
    return { ok: false, status: 502, message: errMsg };
  }

  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    return { ok: false, status: 502, message: 'Empty response from assistant.' };
  }
  return { ok: true, reply };
}

/** Model order: see ../lib/geminiModelRotation.js (GEMINI_MODEL + fallbacks). */

async function callGeminiOnce(model, trimmed, context, apiKey) {
  const contents = [];
  for (const m of trimmed) {
    contents.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    });
  }

  const body = {
    systemInstruction: {
      parts: [{ text: buildSystemPrompt(context) }],
    },
    contents,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: Math.min(Number(process.env.GEMINI_MAX_TOKENS) || 2048, 8192),
    },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await r.json().catch(() => ({}));

  if (!r.ok) {
    const errMsg =
      data?.error?.message ||
      data?.error?.status ||
      r.statusText ||
      'Gemini request failed';
    return { ok: false, errMsg, model, httpStatus: r.status };
  }

  const parts = data?.candidates?.[0]?.content?.parts;
  const reply = Array.isArray(parts)
    ? parts.map((p) => p.text || '').join('').trim()
    : '';

  const blockReason = data?.candidates?.[0]?.finishReason;
  if (!reply) {
    return {
      ok: false,
      errMsg:
        blockReason === 'SAFETY'
          ? 'Reply was blocked by safety filters. Rephrase your question.'
          : 'Empty response from Gemini.',
      model,
      httpStatus: r.status,
    };
  }

  return { ok: true, reply, model, httpStatus: r.status };
}

async function callGemini(trimmed, context) {
  const apiKey =
    process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_AI_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      message:
        'No Gemini key. Get a free API key at https://aistudio.google.com/apikey and set GEMINI_API_KEY in server/.env',
    };
  }

  const models = buildGeminiModelList();
  let lastErr = 'Gemini request failed';
  const retryDelayMs = Math.min(
    Math.max(Number(process.env.GEMINI_RETRY_DELAY_MS) || 2500, 500),
    15000
  );
  const maxAttemptsPerModel = Math.min(
    Math.max(Number(process.env.GEMINI_MAX_ATTEMPTS_PER_MODEL) || 2, 1),
    4
  );

  for (const model of models) {
    for (let attempt = 0; attempt < maxAttemptsPerModel; attempt++) {
      if (attempt > 0) {
        await sleep(retryDelayMs);
        console.warn(
          `[lectureChat] Retry ${attempt + 1}/${maxAttemptsPerModel} for ${model} after transient error`
        );
      }
      const one = await callGeminiOnce(model, trimmed, context, apiKey);
      if (one.ok) {
        if (model !== models[0]) {
          console.warn(`[lectureChat] Using Gemini model: ${model}`);
        }
        return { ok: true, reply: one.reply };
      }
      lastErr = one.errMsg || lastErr;
      console.error(`[lectureChat] Gemini (${model}):`, one.errMsg);
      const retryable = isRetryableGeminiError(one.errMsg, one.httpStatus);
      if (!retryable) {
        return { ok: false, status: 502, message: lastErr };
      }
      const canRetrySameModel = attempt < maxAttemptsPerModel - 1;
      if (!canRetrySameModel) break;
    }
  }

  let hint = lastErr;
  if (String(lastErr).toLowerCase().includes('high demand')) {
    hint +=
      ' — Google is busy on that model; the server already retried and tried other models. Wait a minute and send again, or set GEMINI_MODEL=gemini-1.5-flash in server/.env to prefer a quieter model.';
  } else if (
    String(lastErr).includes('limit: 0') ||
    String(lastErr).toLowerCase().includes('quota')
  ) {
    hint +=
      ' — Your Google project may have no free quota for these models. In Google AI Studio enable billing (free tier still applies) or create a new API key. See https://ai.google.dev/gemini-api/docs/rate-limits';
  }

  return { ok: false, status: 503, message: hint };
}

export const lectureChat = async (req, res) => {
  try {
    const parsed = normalizeMessages(req.body);
    if (parsed.error) {
      return res.status(parsed.error.status).json({
        success: false,
        message: parsed.error.message,
      });
    }

    const { trimmed, context } = parsed;
    const provider = (process.env.CHAT_PROVIDER || 'auto').toLowerCase();
    const hasGemini = !!(
      process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_AI_API_KEY?.trim()
    );
    const hasOpenAI = !!process.env.OPENAI_API_KEY?.trim();

    let result;
    if (provider === 'openai') {
      result = await callOpenAI(trimmed, context);
    } else if (provider === 'gemini') {
      result = await callGemini(trimmed, context);
    } else {
      // auto
      const allowOpenAiFallback =
        String(process.env.CHAT_FALLBACK_OPENAI || '').toLowerCase() === 'true';
      if (hasGemini) {
        result = await callGemini(trimmed, context);
        if (!result.ok && hasOpenAI && allowOpenAiFallback) {
          console.warn('[lectureChat] Gemini failed, falling back to OpenAI');
          result = await callOpenAI(trimmed, context);
        }
      } else if (hasOpenAI) {
        result = await callOpenAI(trimmed, context);
      } else {
        return res.status(503).json({
          success: false,
          message:
            'Lecture assistant needs an API key. Free option: get Gemini key at https://aistudio.google.com/apikey and set GEMINI_API_KEY in server/.env. Or add OPENAI_API_KEY for OpenAI.',
        });
      }
    }

    if (!result.ok) {
      return res.status(result.status || 502).json({
        success: false,
        message: result.message,
      });
    }

    return res.json({ success: true, reply: result.reply });
  } catch (e) {
    console.error('[lectureChat]', e);
    return res.status(500).json({
      success: false,
      message: e.message || 'Chat failed',
    });
  }
};
