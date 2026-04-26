import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "../utils/axios";
import { withClerkAuth } from "../utils/testApiAuth";
import TestControls from "../tests/TestControls";
import TestPage from "../tests/TestPage";
import LevelSelector from "../tests/LevelSelector";
import LevelCompletionScreen from "../tests/LevelCompletionScreen";

const TYPE = "bpsc";

function getDifficulty(lvl) {
  if (lvl <= 17) return "Easy";
  if (lvl <= 34) return "Medium";
  return "Hard";
}

export default function BpscTest() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [accessDenied, setAccessDenied] = useState("");
  const [view, setView] = useState("levels");
  const [levels, setLevels] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questionsInLevel, setQuestionsInLevel] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [levelAnswers, setLevelAnswers] = useState({});
  const [levelStats, setLevelStats] = useState(null);

  const ensureAccess = async () => {
    setCheckingAccess(true);
    setAccessDenied("");
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/bpsc/access", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!data?.allowed) {
        setAccessDenied("This BPSC section is restricted to approved email IDs.");
      }
    } catch (e) {
      setAccessDenied(e?.response?.data?.message || "Access check failed.");
    } finally {
      setCheckingAccess(false);
    }
  };

  const fetchLevels = async () => {
    try {
      setLoading(true);
      const opts = await withClerkAuth(getToken);
      const response = await axios.get(`/api/test/levels?type=${TYPE}`, opts);
      const lvlData = response.data;
      const recResp = await axios.get(`/api/test/recommendations?type=${TYPE}`, opts);
      const recs = (recResp.data?.recommendations || []).reduce((acc, r) => {
        acc[r.level] = r;
        return acc;
      }, {});
      const rawLevels = lvlData.levels || [];
      const built = rawLevels
        .map((n) => Number(n))
        .filter((n) => !Number.isNaN(n))
        .sort((a, b) => a - b)
        .map((lvl) => ({
          level: lvl,
          accuracy: recs[lvl]?.accuracy || 0,
          status: recs[lvl]?.status || "unattempted",
          difficulty: getDifficulty(lvl),
          questionsCount: 15,
        }));
      setLevels(built);
    } catch (error) {
      setAccessDenied(error?.response?.data?.message || "Could not load BPSC levels.");
      setLevels([]);
    } finally {
      setLoading(false);
    }
  };

  const startLevel = (levelNum) => {
    setSelectedLevel(levelNum);
    setView("testing");
    setCurrentQuestionIndex(0);
    setLevelAnswers({});
    fetchLevelQuestions(levelNum);
  };

  const fetchLevelQuestions = async (level) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/test/level-questions?type=${TYPE}&level=${level}&limit=15`,
        await withClerkAuth(getToken)
      );
      if (!data.success || !data.questions?.length) {
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

  const fetchQuestion = async (level, index = null) => {
    try {
      setLoading(true);
      const idx = index !== null ? index : currentQuestionIndex;
      const { data } = await axios.get(
        `/api/test/question?type=${TYPE}&level=${level}&index=${idx}`,
        await withClerkAuth(getToken)
      );
      if (!data.success) {
        await calculateLevelStats();
        return;
      }
      setCurrentQuestion({ ...data.question, level });
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/test/submit",
        { questionId: currentQuestion._id, selectedAnswer, type: TYPE },
        await withClerkAuth(getToken)
      );
      if (data.success) {
        setCurrentQuestion((prev) => {
          const idx = prev.options?.indexOf(data.correctAnswer);
          return { ...prev, explanation: data.explanation, correctAnswer: idx >= 0 ? idx : undefined };
        });
        setIsSubmitted(true);
        const nextAnswers = {
          ...levelAnswers,
          [currentQuestion._id]: { selected: selectedAnswer, correct: data.correct },
        };
        setLevelAnswers(nextAnswers);
        if (questionsInLevel.length > 0 && currentQuestionIndex >= questionsInLevel.length - 1) {
          await calculateLevelStats(nextAnswers);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const goToNextQuestion = async () => {
    const next = currentQuestionIndex + 1;
    setCurrentQuestionIndex(next);
    if (questionsInLevel.length > next) {
      setCurrentQuestion({ ...questionsInLevel[next], level: selectedLevel });
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      await fetchQuestion(selectedLevel, next);
    }
  };

  const calculateLevelStats = async (answersSnapshot = levelAnswers) => {
    const questionIds = Object.keys(answersSnapshot);
    let stats = {
      correctCount: Object.values(answersSnapshot).filter((a) => a.correct).length,
      totalQuestions: questionIds.length || 15,
      passed: false,
      reviewRows: [],
    };
    stats.passed = (stats.correctCount / stats.totalQuestions) * 100 >= 60;
    if (questionIds.length > 0) {
      try {
        const { data } = await axios.post(
          "/api/test/level-summary",
          { type: TYPE, level: selectedLevel, questionIds },
          await withClerkAuth(getToken)
        );
        if (data?.success) {
          stats = {
            correctCount: data.summary.correctCount,
            totalQuestions: data.summary.totalQuestions,
            passed: data.summary.passed,
            reviewRows: data.summary.rows || [],
          };
        }
      } catch {}
    }
    setLevelStats(stats);
    setView("completion");
  };

  const handleNextLevel = () => {
    const nextLevel = selectedLevel + 1;
    if (levels.find((l) => l.level === nextLevel)) startLevel(nextLevel);
    else setView("levels");
  };

  useEffect(() => {
    ensureAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!checkingAccess && !accessDenied) fetchLevels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkingAccess, accessDenied]);

  if (checkingAccess) return <div className="p-8 text-slate-600">Checking BPSC access...</div>;
  if (accessDenied) return <div className="p-8 text-red-600 font-semibold">{accessDenied}</div>;

  if (view === "levels") {
    return (
      <LevelSelector
        levels={levels}
        onSelectLevel={startLevel}
        loading={loading}
        testType="BPSC Practice"
        onRetry={fetchLevels}
      />
    );
  }

  if (view === "completion" && levelStats) {
    return (
      <LevelCompletionScreen
        levelNumber={selectedLevel}
        score={Math.round((levelStats.correctCount / levelStats.totalQuestions) * 100)}
        correctCount={levelStats.correctCount}
        totalQuestions={levelStats.totalQuestions}
        passed={levelStats.passed}
        reviewRows={levelStats.reviewRows || []}
        onRetry={() => startLevel(selectedLevel)}
        onNextLevel={handleNextLevel}
        onDashboard={() => navigate("/practice/bpsc-dashboard")}
        onExit={() => setView("levels")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-10">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button onClick={() => setView("levels")} className="text-slate-600 hover:text-indigo-600 font-bold">
            ← Back to Levels
          </button>
          <span className="text-slate-600 text-sm font-medium">BPSC · Level {selectedLevel}</span>
        </div>
      </nav>
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
                onSubmit={handleSubmit}
                onNext={goToNextQuestion}
                onNextLevel={handleNextLevel}
                onExit={() => setView("levels")}
                canGoNextLevel={isSubmitted && currentQuestionIndex === (questionsInLevel.length - 1 || 14)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
