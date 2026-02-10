import React, { useState, useEffect } from 'react';
import { Terminal, Lock, Code2, Trophy, Star } from 'lucide-react';
import axios from '../../utils/axios';
import { Link } from 'react-router-dom';
import CodingTest from './CodingTest';

const CodingDashboard = () => {
  const [activeLevel, setActiveLevel] = useState(null);
  const [progress, setProgress] = useState({});
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'test' | 'result'
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('csedge_dsa_progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  const handleLevelComplete = (result) => {
    setLastResult(result);
    const newProgress = { ...progress };
    
    // Save only if score is better or first attempt
    if (!newProgress[result.levelId] || result.percentage > newProgress[result.levelId].percentage) {
      newProgress[result.levelId] = result;
      
      // Unlock next level if passed
      if (result.passed) {
        newProgress[`unlocked_${result.levelId + 1}`] = true;
      }
      
      setProgress(newProgress);
      localStorage.setItem('csedge_dsa_progress', JSON.stringify(newProgress));
    }
    setView('result');
  };

//   const isLevelLocked = (levelId) => {
//     if (levelId === 1) return false;
//     return !progress[`unlocked_${levelId}`];
//   };

const isLevelLocked = (levelId) => false;


  // --- VIEW: RESULTS SCREEN ---
  if (view === 'result' && lastResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${lastResult.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {lastResult.passed ? <Trophy className="w-12 h-12" /> : <Code2 className="w-12 h-12" />}
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{lastResult.passed ? 'Level Cleared!' : 'Keep Practicing'}</h2>
            <p className="text-gray-500 mt-2">
              {lastResult.passed ? 'Great job mastering this topic.' : 'Review the explanations and try again.'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <div className="text-4xl font-extrabold text-gray-900 mb-1">{Math.round(lastResult.percentage)}%</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Score</div>
          </div>

          <button 
            onClick={() => setView('dashboard')}
            className="w-full py-3.5 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all transform hover:scale-[1.02]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW: TEST SCREEN ---
  if (view === 'test' && activeLevel) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <CodingTest 
          level={activeLevel} 
          // fetch questions from backend for the DSA level
          questions={activeLevel.questions || []}
          onComplete={handleLevelComplete}
          onExit={() => setView('dashboard')}
        />
      </div>
    );
  }

  // --- VIEW: DASHBOARD ---
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex justify-end">
          <Link to="/" className="text-sm bg-gray-100 px-3 py-1 rounded">Home</Link>
        </div>

        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-bold mb-2">
            <Terminal className="w-4 h-4" /> CSEdge Coding Arena
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Master Data Structures
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            50 Progressive levels from Basic Syntax to Advanced Algorithms. 
            Prepare for technical rounds at TCS, Wipro, and Infosys.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {['Basics', 'Arrays', 'Trees', 'Graphs'].map((topic) => (
             <div key={topic} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
               <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">{topic}</div>
               <div className="text-gray-900 font-bold text-lg">
                 {Object.values(progress).filter(p => p.passed).length} Cleared
               </div>
             </div>
           ))}
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 50 }, (_, i) => ({ id: i+1, name: `Level ${i+1}`, topic: 'General', difficulty: i+1 <=10 ? 'Easy' : i+1<=30 ? 'Medium' : 'Hard' })).map((level) => {
            const isLocked = isLevelLocked(level.id);
            const levelProgress = progress[level.id];
            
            return (
              <button
                key={level.id}
                disabled={isLocked}
                onClick={async () => { 
                  // fetch questions for this level
                  try {
                    const { data } = await axios.get('/api/test/questions', { params: { type: 'dsa', level: level.id, limit: 10 } });
                    if (data.success) {
                      level.questions = data.questions.map(q => ({ id: q._id, question: q.question, options: q.options }));
                    }
                  } catch (err) { console.error(err); }
                  setActiveLevel(level); setView('test');
                }}
                className={`relative group p-6 rounded-2xl border text-left transition-all duration-300 ${
                  isLocked 
                    ? 'bg-gray-100 border-gray-200 opacity-60' 
                    : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider ${
                    level.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700' : 
                    level.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {level.difficulty}
                  </span>
                  
                  {isLocked ? (
                    <Lock className="w-5 h-5 text-gray-300" />
                  ) : levelProgress?.passed ? (
                    <div className="bg-green-100 p-1 rounded-full">
                      <Star className="w-4 h-4 text-green-600 fill-current" />
                    </div>
                  ) : (
                    <div className="bg-purple-100 p-1 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Code2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900 text-lg">{level.name}</h3>
                  <p className="text-sm text-gray-500 font-medium truncate">{level.topic}</p>
                </div>

                {/* Progress Bar for completed levels */}
                {levelProgress && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className={levelProgress.passed ? "text-green-600" : "text-red-500"}>
                        {Math.round(levelProgress.percentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${levelProgress.passed ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{ width: `${levelProgress.percentage}%` }} 
                      />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CodingDashboard;