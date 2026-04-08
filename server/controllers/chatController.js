/**
 * Lecture assistant — supports:
 * - Google Gemini (free tier via AI Studio) — set GEMINI_API_KEY or GOOGLE_AI_API_KEY
 * - OpenAI — set OPENAI_API_KEY (paid / credits)
 *
 * Provider: CHAT_PROVIDER=auto|gemini|openai  (default auto → Gemini if key exists, else OpenAI)
 */

const MAX_USER_MESSAGE = 3000;
const MAX_HISTORY_MESSAGES = 16;

function buildSystemPrompt(context) {
  const parts = [
    'You are a patient, clear teaching assistant for an online learning platform.',
    'The student is watching a video lecture. Help them understand concepts, definitions, and problem-solving approaches.',
    'Keep answers focused and easy to follow. Use short paragraphs or bullet points when helpful.',
    'If you are unsure about something specific to their video, say so and explain the general idea instead.',
    'Do not encourage academic dishonesty (e.g. completing graded work for them); do help them learn.',
  ];
  if (context?.courseTitle) {
    parts.push(`Course: ${context.courseTitle}`);
  }
  if (context?.chapterTitle) {
    parts.push(`Chapter / section: ${context.chapterTitle}`);
  }
  if (context?.lectureTitle) {
    parts.push(`Current lecture title: ${context.lectureTitle}`);
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

/**
 * Gemini — free quota via Google AI Studio (key usually starts with AIza...).
 * @see https://aistudio.google.com/apikey
 */
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

  const model =
    process.env.GEMINI_MODEL?.trim() ||
    'gemini-2.0-flash';

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
    console.error('[lectureChat] Gemini error:', errMsg);
    let hint = errMsg;
    if (String(errMsg).includes('not found') || r.status === 404) {
      hint += ` — Try GEMINI_MODEL=gemini-1.5-flash or gemini-2.0-flash in server/.env`;
    }
    return { ok: false, status: 502, message: hint };
  }

  const parts = data?.candidates?.[0]?.content?.parts;
  const reply = Array.isArray(parts)
    ? parts.map((p) => p.text || '').join('').trim()
    : '';

  const blockReason = data?.candidates?.[0]?.finishReason;
  if (!reply) {
    return {
      ok: false,
      status: 502,
      message:
        blockReason === 'SAFETY'
          ? 'Reply was blocked by safety filters. Rephrase your question.'
          : 'Empty response from Gemini.',
    };
  }

  return { ok: true, reply };
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
      if (hasGemini) {
        result = await callGemini(trimmed, context);
        if (!result.ok && hasOpenAI) {
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
