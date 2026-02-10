import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import BackButton from "../components/BackButton";
import TestControls from "../tests/TestControls";
import TestPage from "../tests/TestPage";
import LevelSelector from "../tests/LevelSelector";
import LevelCompletionScreen from "../tests/LevelCompletionScreen";
import { LayoutGrid, CheckCircle2, Lock, PlayCircle } from "lucide-react";

export default function DevTest() {
  const navigate = useNavigate();
  const [view, setView] = useState("levels"); // "levels", "testing", or "completion"
  const [levels, setLevels] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testType, setTestType] = useState("dev"); // Track which type is being used
  
  // Level session tracking
  const [questionsInLevel, setQuestionsInLevel] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [levelAnswers, setLevelAnswers] = useState({});
  const [levelStats, setLevelStats] = useState(null);

  // timers removed by request

  // Fetch all levels and their status
 const fetchLevels = async () => {
    try {
      setLoading(true);
      let lvlData, recData;
      
      // Try 'dev' first
      const response = await axios.get(`/api/test/levels?type=dev`);
      lvlData = response.data;
      
      // Recommendation fetch
      try {
        const rResp = await axios.get(`/api/test/recommendations?type=dev`);
        recData = rResp.data;
      } catch (e) { recData = { recommendations: [] }; }

      // Robust extraction: Handle if data is {levels: []} or just []
      const rawLevels = lvlData.levels || (Array.isArray(lvlData) ? lvlData : []);
      
      const available = rawLevels
        .map(n => Number(n))
        .filter(n => !Number.isNaN(n))
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
          status: fromRec.status || 'unattempted', 
          difficulty: lvl <= 15 ? 'Beginner' : lvl <= 30 ? 'Intermediate' : 'Advanced', 
          questionsCount: 15 
        };
      });

      setLevels(built);
      setTestType("dev");
    } catch (error) {
      console.error("Error fetching levels:", error);
      setLevels([]); // Ensure empty state triggers the UI properly
    } finally {
      setLoading(false);
    }
  };

  const startLevel = async (levelNum) => {
    setSelectedLevel(levelNum);
    setView("testing");
    setCurrentQuestionIndex(0);
    setLevelAnswers({});
    fetchLevelQuestions(levelNum);
  };

  const fetchLevelQuestions = async (level) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/test/level-questions?type=${testType}&level=${level}`);
      
      if (!data.success || !data.questions || data.questions.length === 0) {
        await fetchQuestion(level, 0);
        return;
      }

      setQuestionsInLevel(data.questions);
      setCurrentQuestion({...data.questions[0], level});
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } catch (error) {
      await fetchQuestion(level, 0);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestion = async (level, questionIndex = null) => {
    try {
      setLoading(true);
      const idx = questionIndex !== null ? questionIndex : currentQuestionIndex;
      const { data } = await axios.get(`/api/test/question?type=${testType}&level=${level}&index=${idx}`);
      
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


  const handleSubmit = async (overrideAnswer = null) => {
    const finalAnswer = overrideAnswer !== null ? overrideAnswer : selectedAnswer;
    try {
      setLoading(true);
      const { data } = await axios.post("/api/test/submit", {
        questionId: currentQuestion._id,
        selectedAnswer: finalAnswer,
        type: testType
      });
      if (data.success) {
        setCurrentQuestion(prev => ({ ...prev, explanation: data.explanation, correctAnswer: data.correctAnswer }));
        setIsSubmitted(true);
        setLevelAnswers(prev => ({
          ...prev,
          [currentQuestion._id]: {
            selected: finalAnswer,
            correct: data.correct,
            explanation: data.explanation
          }
        }));
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToNextQuestion = async () => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    
    if (questionsInLevel.length > nextIndex) {
      setCurrentQuestion(questionsInLevel[nextIndex]);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      await fetchQuestion(selectedLevel, nextIndex);
    }
  };

  const calculateLevelStats = () => {
    let correctCount = 0;
    let totalQuestions = Object.keys(levelAnswers).length;

    Object.values(levelAnswers).forEach(answer => {
      if (answer.correct) correctCount++;
    });

    const stats = {
      correctCount,
      totalQuestions: totalQuestions || 15,
      passed: (correctCount / (totalQuestions || 15)) * 100 >= 60
    };

    setLevelStats(stats);
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
    if (levels.find(l => l.level === nextLevel)) {
      startLevel(nextLevel);
    } else {
      setView("levels");
    }
  };

  useEffect(() => { fetchLevels(); }, []);

  // 1. LEVEL SELECTION UI
  if (view === "levels") {
    return (
      <div>
        <LevelSelector 
          levels={levels} 
          onSelectLevel={startLevel}
          loading={loading}
          testType="Development"
          onRetry={fetchLevels}
        />
      </div>
    );
  }

  // 2. COMPLETION UI
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

  // 3. TESTING UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-10">
      {/* Header Nav */}
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
            <span className="hidden md:block text-slate-600 text-sm font-medium">Level {selectedLevel}</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
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
                canGoNextLevel={isSubmitted && currentQuestionIndex === (questionsInLevel.length - 1 || 14)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}