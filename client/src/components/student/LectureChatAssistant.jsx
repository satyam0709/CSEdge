import { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';

const storageKey = (courseId, lectureId) =>
  `lms_lecture_chat_v1_${courseId}_${lectureId}`;

export default function LectureChatAssistant({
  courseId,
  courseTitle,
  lectureId,
  lectureTitle,
  chapterTitle,
  getToken,
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!courseId || !lectureId) return;
    try {
      const raw = sessionStorage.getItem(storageKey(courseId, lectureId));
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
  }, [courseId, lectureId]);

  useEffect(() => {
    if (!courseId || !lectureId) return;
    try {
      sessionStorage.setItem(storageKey(courseId, lectureId), JSON.stringify(messages));
    } catch {
      /* ignore quota */
    }
  }, [messages, courseId, lectureId]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextUser = { role: 'user', content: text };
    const history = [...messages, nextUser];
    setMessages(history);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const token = await getToken();
      const { data } = await axiosInstance.post(
        '/api/chat/lecture-assistant',
        {
          messages: history,
          context: {
            courseTitle: courseTitle || '',
            lectureTitle: lectureTitle || '',
            chapterTitle: chapterTitle || '',
          },
        },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 120000 }
      );

      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setError(data.message || 'No reply from assistant.');
        setMessages((prev) => prev.slice(0, -1));
      }
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.message ||
        'Could not reach the assistant. Check your connection or server configuration.';
      setError(msg);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }, [
    input,
    loading,
    messages,
    courseTitle,
    lectureTitle,
    chapterTitle,
    getToken,
  ]);

  if (!lectureId) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-4 z-[90] flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 md:right-8"
        aria-label="Open lecture assistant chat"
      >
        <MessageCircle size={20} />
        <span className="hidden sm:inline">Ask a doubt</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex justify-end bg-black/40 md:justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Lecture assistant"
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
                  <p className="text-sm font-bold truncate">Lecture assistant</p>
                  <p className="text-xs text-indigo-100 truncate">
                    {lectureTitle || 'Ask anything about this lesson'}
                  </p>
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
                  Stuck on a concept? Ask in your own words — the assistant uses your{' '}
                  <strong>course and lecture title</strong> as context (not the video audio).
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
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
                  {error}
                </p>
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
                  placeholder="Type your question…"
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
                Enter to send · Shift+Enter for new line · Chats are saved for this lecture in this
                browser session only.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
