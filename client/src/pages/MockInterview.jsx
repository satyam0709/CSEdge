import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "../utils/axios";
import {
  Mic, ChevronRight, RotateCcw, Star, CheckCircle2,
  XCircle, Lightbulb, Trophy, Clock, BarChart2,
  Trash2, Eye, ArrowLeft, Loader2, BrainCircuit,
} from "lucide-react";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DSA / Algorithms",
  "System Design",
  "React Developer",
  "Node.js Developer",
  "DevOps Engineer",
  "HR / Behavioral",
];

const DIFFICULTIES = [
  { value: "easy", label: "Easy", color: "text-green-600 bg-green-50 border-green-200" },
  { value: "medium", label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { value: "hard", label: "Hard", color: "text-red-600 bg-red-50 border-red-200" },
];

const Q_COUNTS = [5, 8, 10, 15];

function ScoreStars({ score }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-5 h-5 ${s <= score ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
        />
      ))}
    </div>
  );
}

function ScoreBadge({ score }) {
  const color =
    score >= 4 ? "bg-green-100 text-green-800" :
    score >= 3 ? "bg-amber-100 text-amber-800" :
                 "bg-red-100 text-red-800";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${color}`}>
      <Star className="w-3.5 h-3.5 fill-current" />
      {score}/5
    </span>
  );
}

// ── Setup Screen ──────────────────────────────────────────────────────────────
function SetupScreen({ onStart, loading }) {
  const [role, setRole] = useState("Full Stack Developer");
  const [difficulty, setDifficulty] = useState("medium");
  const [totalQuestions, setTotalQuestions] = useState(5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg mb-4">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Mock Interview Simulator</h1>
          <p className="text-slate-500 mt-2">AI-powered interview practice tailored to your role</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Interview Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDifficulty(d.value)}
                  className={`rounded-xl border-2 py-2.5 text-sm font-bold transition ${
                    difficulty === d.value ? d.color + " scale-105 shadow-sm" : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question count */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Questions</label>
            <div className="flex gap-3 flex-wrap">
              {Q_COUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setTotalQuestions(n)}
                  className={`w-14 py-2 rounded-xl border-2 text-sm font-bold transition ${
                    totalQuestions === n
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 scale-105"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => onStart({ role, difficulty, totalQuestions })}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-white font-bold text-base shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-60 transition"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Generating questions…</>
            ) : (
              <><Mic className="w-5 h-5" /> Start Interview</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Interview Screen ──────────────────────────────────────────────────────────
function InterviewScreen({ session, onSubmit, loading }) {
  const [answer, setAnswer] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    setAnswer("");
    textareaRef.current?.focus();
  }, [session.questionNumber]);

  const progress = ((session.questionNumber - 1) / session.totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Question</span>
              <p className="text-lg font-bold text-slate-800">{session.questionNumber} / {session.totalQuestions}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">{session.role}</span>
              <p className="text-sm font-medium text-slate-600 capitalize">{session.difficulty}</p>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-lg font-semibold text-slate-900 leading-relaxed">{session.question}</p>
          </div>

          {session.hint && (
            <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
              <span><span className="font-semibold">Hint:</span> {session.hint}</span>
            </div>
          )}
        </div>

        {/* Answer box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Your Answer</label>
          <textarea
            ref={textareaRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={7}
            placeholder="Type your answer here… Be as detailed as you can."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => onSubmit(answer)}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-white font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-60 transition"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Evaluating…</>
            ) : (
              <>Submit Answer <ChevronRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Feedback Screen ───────────────────────────────────────────────────────────
function FeedbackScreen({ feedback, questionNumber, totalQuestions, onNext, isComplete }) {
  const [showSample, setShowSample] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="text-center">
          <ScoreBadge score={feedback.score} />
          <p className="mt-2 text-slate-500 text-sm">Question {questionNumber} feedback</p>
        </div>

        {/* Score stars */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
          <ScoreStars score={feedback.score} />
          <p className="mt-3 text-slate-700 leading-relaxed">{feedback.summary}</p>
        </div>

        {/* Good points */}
        {feedback.good?.length > 0 && (
          <div className="bg-green-50 rounded-2xl border border-green-200 p-5">
            <h3 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> What you did well
            </h3>
            <ul className="space-y-1.5">
              {feedback.good.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-900">
                  <span className="text-green-500 mt-0.5">✓</span> {g}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing points */}
        {feedback.missing?.length > 0 && (
          <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
            <h3 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Areas to improve
            </h3>
            <ul className="space-y-1.5">
              {feedback.missing.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-900">
                  <span className="text-red-400 mt-0.5">•</span> {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sample answer toggle */}
        {feedback.sampleAnswer && (
          <div className="bg-indigo-50 rounded-2xl border border-indigo-200 p-5">
            <button
              type="button"
              onClick={() => setShowSample((v) => !v)}
              className="flex items-center gap-2 text-sm font-bold text-indigo-700 w-full"
            >
              <Lightbulb className="w-4 h-4" />
              {showSample ? "Hide" : "Show"} sample answer
            </button>
            {showSample && (
              <p className="mt-3 text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap">
                {feedback.sampleAnswer}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-white font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
        >
          {isComplete ? (
            <><Trophy className="w-5 h-5" /> View Results</>
          ) : (
            <>Next Question <ChevronRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Summary Screen ────────────────────────────────────────────────────────────
function SummaryScreen({ summary, role, difficulty, onRetry, onHistory }) {
  const pct = Math.round((summary.overallScore / 5) * 100);
  const color = pct >= 70 ? "text-green-600" : pct >= 50 ? "text-amber-600" : "text-red-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Overall card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 mb-4">
            <Trophy className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Interview Complete!</h2>
          <p className="text-slate-500 mt-1">{role} · {difficulty}</p>
          <div className={`text-5xl font-black mt-4 ${color}`}>{summary.overallScore}<span className="text-xl text-slate-400">/5</span></div>
          <ScoreStars score={Math.round(summary.overallScore)} />
          <p className="mt-4 text-slate-600">{summary.overallFeedback}</p>
        </div>

        {/* Per-question breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Question Breakdown</h3>
          <div className="space-y-3">
            {summary.breakdown.map((b) => (
              <div key={b.index} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                  {b.index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 line-clamp-2">{b.question}</p>
                  {b.summary && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{b.summary}</p>}
                </div>
                <ScoreBadge score={b.score} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-indigo-200 bg-indigo-50 py-3.5 text-indigo-700 font-bold hover:bg-indigo-100 transition"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <button
            type="button"
            onClick={onHistory}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-white font-bold hover:bg-indigo-700 transition"
          >
            <BarChart2 className="w-4 h-4" /> History
          </button>
        </div>
      </div>
    </div>
  );
}

// ── History Screen ────────────────────────────────────────────────────────────
function HistoryScreen({ sessions, onViewSession, onDelete, onNewInterview, loadingId }) {
  if (sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Clock className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 font-medium">No past sessions yet.</p>
          <button
            type="button"
            onClick={onNewInterview}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-white font-bold hover:bg-indigo-700 transition"
          >
            Start your first interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Past Sessions</h2>
          <button
            type="button"
            onClick={onNewInterview}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm text-white font-bold hover:bg-indigo-700 transition"
          >
            + New Interview
          </button>
        </div>
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">{s.role}</p>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">
                  {s.difficulty} · {s.totalQuestions} questions · {new Date(s.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {s.status === "completed" ? (
                  <ScoreBadge score={s.overallScore} />
                ) : (
                  <span className="text-xs rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 font-semibold">In Progress</span>
                )}
                <button
                  type="button"
                  onClick={() => onViewSession(s._id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(s._id)}
                  disabled={loadingId === s._id}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-40"
                >
                  {loadingId === s._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MockInterview() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState("setup"); // setup | interview | feedback | summary | history
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Session state
  const [sessionId, setSessionId] = useState(null);
  const [sessionMeta, setSessionMeta] = useState({ role: "", difficulty: "" });
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentHint, setCurrentHint] = useState("");
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [isLastFeedback, setIsLastFeedback] = useState(false);
  const [summary, setSummary] = useState(null);

  // History
  const [sessions, setSessions] = useState([]);

  const authHeaders = async () => {
    const token = await getToken();
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchSessions = async () => {
    try {
      const cfg = await authHeaders();
      const { data } = await axios.get("/api/mock-interview/sessions", cfg);
      if (data.success) setSessions(data.sessions);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStart = async ({ role, difficulty, totalQuestions }) => {
    setLoading(true);
    setError("");
    try {
      const cfg = await authHeaders();
      const { data } = await axios.post("/api/mock-interview/start", { role, difficulty, totalQuestions }, cfg);
      if (!data.success) throw new Error(data.message);
      setSessionId(data.sessionId);
      setSessionMeta({ role, difficulty });
      setCurrentQuestion(data.question);
      setCurrentHint(data.hint || "");
      setQuestionNumber(1);
      setTotalQuestions(data.totalQuestions);
      setView("interview");
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Failed to start. Check your server AI keys.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (answer) => {
    setLoading(true);
    setError("");
    try {
      const cfg = await authHeaders();
      const { data } = await axios.post(
        "/api/mock-interview/answer",
        { sessionId, answer, questionIndex: questionNumber - 1 },
        cfg
      );
      if (!data.success) throw new Error(data.message);
      setCurrentFeedback(data.feedback);
      setIsLastFeedback(data.isComplete);
      if (data.isComplete) setSummary(data.summary);
      setView("feedback");
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Failed to submit answer.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextAfterFeedback = () => {
    if (isLastFeedback) {
      setView("summary");
    } else {
      setQuestionNumber((n) => n + 1);
      setView("interview");
    }
  };

  const handleViewHistory = async () => {
    await fetchSessions();
    setView("history");
  };

  const handleDeleteSession = async (id) => {
    setDeletingId(id);
    try {
      const cfg = await authHeaders();
      await axios.delete(`/api/mock-interview/session/${id}`, cfg);
      setSessions((prev) => prev.filter((s) => s._id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewSession = async (id) => {
    try {
      const cfg = await authHeaders();
      const { data } = await axios.get(`/api/mock-interview/session/${id}`, cfg);
      if (data.success && data.session.status === "completed") {
        const s = data.session;
        setSummary({
          overallScore: s.overallScore,
          overallFeedback: s.overallFeedback,
          totalQuestions: s.totalQuestions,
          breakdown: s.questions.map((q, i) => ({
            index: i, question: q.question, score: q.feedback?.score || 0, summary: q.feedback?.summary || "",
          })),
        });
        setSessionMeta({ role: s.role, difficulty: s.difficulty });
        setView("summary");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative">
      {/* Back nav */}
      <div className="absolute top-4 left-4 z-10">
        <button
          type="button"
          onClick={() => {
            if (view === "history" || view === "summary") { setView("setup"); return; }
            navigate(-1);
          }}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* History button */}
      {view !== "history" && (
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={handleViewHistory}
            className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
          >
            <Clock className="w-4 h-4" /> History
          </button>
        </div>
      )}

      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <XCircle className="w-4 h-4 shrink-0" />
          {error}
          <button onClick={() => setError("")} className="ml-2 font-bold">×</button>
        </div>
      )}

      {view === "setup" && <SetupScreen onStart={handleStart} loading={loading} />}
      {view === "interview" && (
        <InterviewScreen
          session={{ question: currentQuestion, hint: currentHint, questionNumber, totalQuestions, role: sessionMeta.role, difficulty: sessionMeta.difficulty }}
          onSubmit={handleSubmitAnswer}
          loading={loading}
        />
      )}
      {view === "feedback" && currentFeedback && (
        <FeedbackScreen
          feedback={currentFeedback}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          onNext={handleNextAfterFeedback}
          isComplete={isLastFeedback}
        />
      )}
      {view === "summary" && summary && (
        <SummaryScreen
          summary={summary}
          role={sessionMeta.role}
          difficulty={sessionMeta.difficulty}
          onRetry={() => setView("setup")}
          onHistory={handleViewHistory}
        />
      )}
      {view === "history" && (
        <HistoryScreen
          sessions={sessions}
          onViewSession={handleViewSession}
          onDelete={handleDeleteSession}
          onNewInterview={() => setView("setup")}
          loadingId={deletingId}
        />
      )}
    </div>
  );
}
