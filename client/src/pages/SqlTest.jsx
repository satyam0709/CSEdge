import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "../utils/axios";
import { withClerkAuth } from "../utils/testApiAuth";
import TestControls from "../tests/TestControls";
import TestPage from "../tests/TestPage";
import LevelSelector from "../tests/LevelSelector";
import LevelCompletionScreen from "../tests/LevelCompletionScreen";

const TYPE = "sql";

/** Map level number → difficulty label matching the user's spec:
 *  1–20  → Beginner / Intermediate (easy → medium)
 *  21–40 → Intermediate / Advanced  (medium → hard)
 *  41–50 → Expert (hard)
 */
function getDifficulty(lvl) {
  if (lvl <= 10) return "Beginner";
  if (lvl <= 20) return "Intermediate";
  if (lvl <= 40) return "Advanced";
  return "Expert";
}

export default function SqlTest() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState("levels"); // "levels" | "testing" | "completion"
  const [levels, setLevels] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Level session tracking
  const [questionsInLevel, setQuestionsInLevel] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [levelAnswers, setLevelAnswers] = useState({});
  const [levelStats, setLevelStats] = useState(null);

  // ── Fetch levels ────────────────────────────────────────────────────────────
  const fetchLevels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/test/levels?type=${TYPE}`);
      const lvlData = response.data;

      let recData = { recommendations: [] };
      try {
        const rResp = await axios.get(
          `/api/test/recommendations?type=${TYPE}`,
          await withClerkAuth(getToken)
        );
        recData = rResp.data || recData;
      } catch {
        /* optional when signed out */
      }

      const rawLevels = lvlData.levels || (Array.isArray(lvlData) ? lvlData : []);
      const available = rawLevels
        .map((n) => Number(n))
        .filter((n) => !Number.isNaN(n))
        .sort((a, b) => a - b);

      const recs = (recData.recommendations || []).reduce((acc, r) => {
        acc[r.level] = r;
        return acc;
      }, {});

      const built = available.map((lvl) => {
        const fromRec = recs[lvl] || {};
        return {
          level: lvl,
          accuracy: fromRec.accuracy || 0,
          status: fromRec.status || "unattempted",
          difficulty: getDifficulty(lvl),
          questionsCount: 15,
        };
      });

      setLevels(built);
    } catch (error) {
      console.error("Error fetching SQL levels:", error);
      setLevels([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Start level ─────────────────────────────────────────────────────────────
  const startLevel = (levelNum) => {
    setSelectedLevel(levelNum);
    setView("testing");
    setCurrentQuestionIndex(0);
    setLevelAnswers({});
    fetchLevelQuestions(levelNum);
  };

  // ── Fetch all questions for a level ────────────────────────────────────────
  const fetchLevelQuestions = async (level) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/test/level-questions?type=${TYPE}&level=${level}&limit=15`
      );

      if (!data.success || !data.questions || data.questions.length === 0) {
        await fetchQuestion(level, 0);
        return;
      }

      setQuestionsInLevel(data.questions);
      setCurrentQuestion({ ...data.questions[0], level });
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } catch {
      await fetchQuestion(level, 0);
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch single question by index ─────────────────────────────────────────
  const fetchQuestion = async (level, questionIndex = null) => {
    try {
      setLoading(true);
      const idx = questionIndex !== null ? questionIndex : currentQuestionIndex;
      const { data } = await axios.get(
        `/api/test/question?type=${TYPE}&level=${level}&index=${idx}`,
        await withClerkAuth(getToken)
      );

      if (!data.success) {
        calculateLevelStats();
        return;
      }

      setCurrentQuestion({ ...data.question, level });
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  // ── Submit answer ───────────────────────────────────────────────────────────
  const handleSubmit = async (overrideAnswer = null) => {
    const finalAnswer = overrideAnswer !== null ? overrideAnswer : selectedAnswer;
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/test/submit",
        {
          questionId: currentQuestion._id,
          selectedAnswer: finalAnswer,
          type: TYPE,
        },
        await withClerkAuth(getToken)
      );
      if (data.success) {
        setCurrentQuestion((prev) => {
          const idx =
            prev.options && data.correctAnswer != null
              ? prev.options.indexOf(data.correctAnswer)
              : -1;
          return {
            ...prev,
            explanation: data.explanation,
            correctAnswer: idx >= 0 ? idx : undefined,
          };
        });
        setIsSubmitted(true);
        setLevelAnswers((prev) => ({
          ...prev,
          [currentQuestion._id]: {
            selected: finalAnswer,
            correct: data.correct,
            explanation: data.explanation,
          },
        }));
      }
    } catch (error) {
      console.error("Error submitting SQL answer:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Navigate to next question ───────────────────────────────────────────────
  const goToNextQuestion = async () => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);

    if (questionsInLevel.length > nextIndex) {
      setCurrentQuestion({ ...questionsInLevel[nextIndex], level: selectedLevel });
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      await fetchQuestion(selectedLevel, nextIndex);
    }
  };

  // ── Level completion ────────────────────────────────────────────────────────
  const calculateLevelStats = () => {
    const totalQuestions = Object.keys(levelAnswers).length;
    const correctCount = Object.values(levelAnswers).filter((a) => a.correct).length;
    setLevelStats({
      correctCount,
      totalQuestions: totalQuestions || 15,
      passed: (correctCount / (totalQuestions || 15)) * 100 >= 60,
    });
    setView("completion");
  };

  const handleRetryLevel = () => {
    setCurrentQuestionIndex(0);
    setLevelAnswers({});
    setLevelStats(null);
    startLevel(selectedLevel);
  };

  const handleNextLevel = () => {
    const nextLevel = selectedLevel + 1;
    if (levels.find((l) => l.level === nextLevel)) {
      startLevel(nextLevel);
    } else {
      setView("levels");
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  // ── 1. Level selection ──────────────────────────────────────────────────────
  if (view === "levels") {
    return (
      <LevelSelector
        levels={levels}
        onSelectLevel={startLevel}
        loading={loading}
        testType="SQL & Database"
        onRetry={fetchLevels}
      />
    );
  }

  // ── 2. Completion screen ────────────────────────────────────────────────────
  if (view === "completion" && levelStats) {
    return (
      <LevelCompletionScreen
        levelNumber={selectedLevel}
        score={Math.round((levelStats.correctCount / levelStats.totalQuestions) * 100)}
        correctCount={levelStats.correctCount}
        totalQuestions={levelStats.totalQuestions}
        passed={levelStats.passed}
        onRetry={handleRetryLevel}
        onNextLevel={handleNextLevel}
        onExit={() => setView("levels")}
      />
    );
  }

  // ── 3. Testing UI ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-10">
      {/* Sticky header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => setView("levels")}
            className="text-slate-600 hover:text-indigo-600 font-bold text-sm md:text-base flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            ← Back to Levels
          </button>
          <div className="flex items-center gap-2">
            <span className="hidden md:block text-slate-400">•</span>
            <span className="hidden md:block text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              SQL Lab
            </span>
            <span className="hidden md:block text-slate-400">•</span>
            <span className="hidden md:block text-slate-600 text-sm font-medium">
              Level {selectedLevel} · {getDifficulty(selectedLevel)}
            </span>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-5xl mx-auto mt-8 px-4 md:px-6">
        {currentQuestion && (
          <>
            <TestPage
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={setSelectedAnswer}
              isSubmitted={isSubmitted}
              loading={loading}
              currentQuestionNumber={currentQuestionIndex + 1}
              totalQuestions={questionsInLevel.length || 15}
              onBack={() => setView("levels")}
            />

            <div className="mt-8 bg-white rounded-3xl border-2 border-slate-200 p-6 md:p-8 shadow-lg">
              <TestControls
                isSubmitted={isSubmitted}
                loading={loading}
                onSubmit={() => handleSubmit()}
                onNext={goToNextQuestion}
                onNextLevel={handleNextLevel}
                onExit={() => setView("levels")}
                canGoNextLevel={
                  isSubmitted &&
                  currentQuestionIndex === (questionsInLevel.length - 1 || 14)
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
