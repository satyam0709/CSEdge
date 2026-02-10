// src/components/aptitude/AptitudeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Lock, Play, Star, TrendingUp, BookOpen } from 'lucide-react';
import axios from '../../utils/axios';
import AptitudeTest from './AptitudeTest';

const AptitudeDashboard = () => {
  const [activeLevel, setActiveLevel] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'test' | 'result'
  const [lastResult, setLastResult] = useState(null);
  const [questionsForLevel, setQuestionsForLevel] = useState([]);

  // Load progress from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('csedge_aptitude_progress');
    if (saved) {
      setUserProgress(JSON.parse(saved));
    }
  }, []);

  const startLevel = (level) => {
    if (isLevelLocked(level.id)) return;
    setActiveLevel(level);
    // fetch questions from backend for this level
    (async () => {
      try {
        const { data } = await axios.get('/api/test/questions', {
          params: { type: 'aptitude', level: level.id, limit: level.questionsCount || 10 }
        });
        if (data.success) {
          // map server fields to what AptitudeTest expects
          const qlist = data.questions.map(q => ({ id: q._id, question: q.question, options: q.options, explanation: '' }));
          setQuestionsForLevel(qlist);
          setView('test');
        }
      } catch (err) {
        console.error(err);
      }
    })();
  };

  const handleTestComplete = (result) => {
    setLastResult(result);
    
    // Update progress
    const newProgress = { ...userProgress };
    const currentLevelId = result.levelId;
    
    // Only update if score is better or first time
    if (!newProgress[currentLevelId] || result.percentage > newProgress[currentLevelId].percentage) {
      newProgress[currentLevelId] = {
        score: result.score,
        percentage: result.percentage,
        passed: result.passed,
        timestamp: new Date().toISOString()
      };
      
      // Unlock next level if passed
      if (result.passed) {
        newProgress[`unlocked_${currentLevelId + 1}`] = true;
      }
      
      setUserProgress(newProgress);
      localStorage.setItem('csedge_aptitude_progress', JSON.stringify(newProgress));
    }
    
    setView('result');
  };

//   const isLevelLocked = (levelId) => {
//     if (levelId === 1) return false;
//     // Level is unlocked if previous level is passed or explicitly unlocked
//     const prevLevel = userProgress[levelId - 1];
//     return !(prevLevel?.passed || userProgress[`unlocked_${levelId}`]);
//   };


// ALWAYS RETURN FALSE so nothing is ever locked
const isLevelLocked = (levelId) => false;

  const getChartData = () => {
    return Object.entries(userProgress)
      .filter(([key]) => !key.startsWith('unlocked'))
      .map(([key, value]) => ({
        name: `Lvl ${key}`,
        score: value.percentage
      }));
  };

  // ---------------- Views ----------------

  if (view === 'test' && activeLevel) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <AptitudeTest 
          level={activeLevel} 
          questions={questionsForLevel}
          onComplete={handleTestComplete}
          onExit={() => setView('dashboard')}
        />
      </div>
    );
  }

  if (view === 'result' && lastResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${lastResult.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {lastResult.passed ? <Trophy className="w-10 h-10" /> : <TrendingUp className="w-10 h-10" />}
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{lastResult.passed ? 'Level Complete!' : 'Try Again'}</h2>
            <p className="text-gray-500 mt-2">You scored {Math.round(lastResult.percentage)}%</p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{lastResult.correctCount}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{lastResult.totalQuestions}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Total</div>
            </div>
          </div>

          <button 
            onClick={() => setView('dashboard')}
            className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              Aptitude Training Center
            </h1>
            <p className="text-gray-500 mt-1">Master your skills across 50 progressive levels.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-sm bg-gray-100 px-3 py-1 rounded">Home</Link>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 flex items-center gap-3">
             <div className="flex items-center gap-2">
               <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
               <span className="font-bold text-gray-800">
                 {Object.values(userProgress).filter(p => p.passed).length} / 50
               </span>
               <span className="text-xs text-gray-500 uppercase">Levels Cleared</span>
             </div>
          </div>
        </div>

        {/* Stats Chart */}
        {Object.keys(userProgress).length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Performance History</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            name: `Level ${i + 1}`,
            difficulty: i + 1 <= 10 ? 'Beginner' : i + 1 <= 25 ? 'Intermediate' : i + 1 <= 40 ? 'Advanced' : 'Expert',
            questionsCount: 10
          })).map((level) => {
            const locked = isLevelLocked(level.id);
            const progress = userProgress[level.id];
            
            return (
              <div 
                key={level.id}
                className={`relative group p-6 rounded-xl border transition-all duration-200 ${
                  locked 
                    ? 'bg-gray-100 border-gray-200 opacity-70' 
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer'
                }`}
                onClick={() => startLevel(level)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${locked ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600'}`}>
                    {locked ? <Lock className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                  </div>
                  {progress && (
                    <span className={`px-2 py-1 text-xs font-bold rounded ${progress.passed ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {Math.round(progress.percentage)}%
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-1">{level.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{level.difficulty}</span>
                  <span>•</span>
                  <span>{level.questionsCount} Questions</span>
                </div>

                {!locked && (
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AptitudeDashboard;