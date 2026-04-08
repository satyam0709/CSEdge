import { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';

function makeStorageKey({ courseId, lectureId, pagePath }) {
  if (courseId && lectureId) {
    return `lms_lecture_chat_v1_${courseId}_${lectureId}`;
  }
  const path = (pagePath || 'app').replace(/\s/g, '_');
  return `lms_page_chat_v1_${path}`;
}

/**
 * AI assistant — lecture mode (course + lecture) or page mode (dashboard, practice tests, etc.).
 * Same backend: POST /api/chat/lecture-assistant
 */
export default function LectureChatAssistant({
  courseId,
  courseTitle,
  lectureId,
  lectureTitle,
  chapterTitle,
  getToken,
  /** Page mode: when not on a specific lecture */
  pagePath,
  pageTitle,
  /** Lower z-index when another chat might exist (unused; global uses same z) */
  variant = 'lecture',
}) {
  const isLectureMode = Boolean(courseId && lectureId);
  const scopeKey = makeStorageKey({
    courseId,
    lectureId,
    pagePath: pagePath || '',
  });

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const lastPromptRef = useRef('');

  const headerTitle = isLectureMode ? 'Lecture assistant' : 'Study assistant';
  const headerSubtitle =
    (isLectureMode && lectureTitle) ||
    pageTitle ||
    'Ask questions · paste errors · get unstuck';

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(scopeKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setMessages(parsed);
        else setMessages([]);
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    }
    setError(null);
    setInput('');
  }, [scopeKey]);

  useEffect(() => {
    try {
      sessionStorage.setItem(scopeKey, JSON.stringify(messages));
    } catch {
      /* ignore quota */
    }
  }, [messages, scopeKey]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, loading]);

  const sendOnce = useCallback(
    async (history) => {
      const token = await getToken();
      const { data } = await axiosInstance.post(
        '/api/chat/lecture-assistant',
        {
          messages: history,
          context: {
            courseTitle: courseTitle || '',
            lectureTitle: lectureTitle || '',
            chapterTitle: chapterTitle || '',
            pagePath: pagePath || '',
            pageTitle: pageTitle || '',
          },
        },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 120000 }
      );
      return data;
    },
    [courseTitle, lectureTitle, chapterTitle, pagePath, pageTitle, getToken]
  );

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    lastPromptRef.current = text;

    const nextUser = { role: 'user', content: text };
    const history = [...messages, nextUser];
    setMessages(history);
    setInput('');
    setError(null);
    setLoading(true);

    const run = async (attempt) => {
      try {
        const data = await sendOnce(history);
        if (data.success && data.reply) {
          setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
          return true;
        }
        const msg = data.message || 'No reply from assistant.';
        if (
          attempt === 0 &&
          (msg.toLowerCase().includes('high demand') ||
            msg.toLowerCase().includes('quota') ||
            msg.toLowerCase().includes('503') ||
            msg.toLowerCase().includes('try again'))
        ) {
          await new Promise((r) => setTimeout(r, 2200));
          const data2 = await sendOnce(history);
          if (data2.success && data2.reply) {
            setMessages((prev) => [...prev, { role: 'assistant', content: data2.reply }]);
            return true;
          }
          setError(data2.message || msg);
        } else {
          setError(msg);
        }
        setMessages((prev) => prev.slice(0, -1));
        return false;
      } catch (e) {
        const msg =
          e.response?.data?.message ||
          e.message ||
          'Could not reach the assistant. Check your connection or server configuration.';
        if (attempt === 0 && (!e.response || e.response.status >= 500)) {
          await new Promise((r) => setTimeout(r, 1800));
          try {
            const data2 = await sendOnce(history);
            if (data2.success && data2.reply) {
              setMessages((prev) => [...prev, { role: 'assistant', content: data2.reply }]);
              return true;
            }
            setError(data2.message || msg);
          } catch {
            setError(msg);
          }
        } else {
          setError(msg);
        }
        setMessages((prev) => prev.slice(0, -1));
        return false;
      }
    };

    try {
      await run(0);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, sendOnce]);

  if (!getToken) return null;
  if (!isLectureMode && !pagePath) return null;

  const fabLabel =
    variant === 'global' ? 'Help' : isLectureMode ? 'Ask a doubt' : 'Help';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-4 z-[90] flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 md:right-8"
        aria-label="Open assistant chat"
      >
        <MessageCircle size={20} />
        <span className="hidden sm:inline">{fabLabel}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex justify-end bg-black/40 md:justify-end"
          role="dialog"
          aria-modal="true"
          aria-label={headerTitle}
          onClick={() => setOpen(false)}
        >
          <div
            className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl md:max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles size={20} className="shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{headerTitle}</p>
                  <p className="text-xs text-indigo-100 truncate">{headerSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 hover:bg-white/10"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.length === 0 && (
                <p className="text-sm text-slate-600 rounded-xl bg-white border border-slate-200 p-4">
                  {isLectureMode ? (
                    <>
                      Stuck on a concept? Ask in your own words — the assistant uses your{' '}
                      <strong>course and lecture title</strong> as context (not the video audio).
                    </>
                  ) : (
                    <>
                      Ask about <strong>practice questions</strong>, <strong>errors</strong>, or how
                      to use this page. Paste full error text for faster help.
                    </>
                  )}
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-md'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                    <Loader2 size={16} className="animate-spin" />
                    Thinking…
                  </div>
                </div>
              )}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 space-y-2">
                  <p>{error}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setInput(lastPromptRef.current || '');
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Put my question back and try again
                  </button>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-gray-200 p-3 bg-white">
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={2}
                  placeholder="Type your question or paste an error…"
                  className="flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  disabled={loading}
                  maxLength={3000}
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="self-end rounded-xl bg-indigo-600 p-3 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none"
                  aria-label="Send message"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Enter to send · Shift+Enter for new line · Saved per page in this browser session ·
                Auto-retry once on busy servers
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
