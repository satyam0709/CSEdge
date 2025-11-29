// src/components/dev/DevDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Database, Layout, Server, Code, Globe, Lock, Cpu } from 'lucide-react';
import { DEV_LEVELS, getDevQuestions } from '../../lib/devData';
import DevTest from './DevTest';

const DevDashboard = () => {
  const [activeLevel, setActiveLevel] = useState(null);
  const [progress, setProgress] = useState({});
  const [view, setView] = useState('dashboard');

  useEffect(() => {
    const saved = localStorage.getItem('csedge_dev_progress');
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  const handleComplete = (result) => {
    const newProgress = { ...progress };
    if (!newProgress[result.levelId] || result.percentage > newProgress[result.levelId].percentage) {
      newProgress[result.levelId] = result;
      if (result.passed) newProgress[`unlocked_${result.levelId + 1}`] = true;
      setProgress(newProgress);
      localStorage.setItem('csedge_dev_progress', JSON.stringify(newProgress));
    }
    setView('dashboard');
  };

  const getIcon = (topic) => {
    // Helper to prevent crashes if topic is undefined (safety check)
    const t = topic || ""; 
    
    if (t.includes("HTML") || t.includes("CSS")) return <Layout className="w-5 h-5 text-blue-500" />;
    if (t.includes("React") || t.includes("JS")) return <Code className="w-5 h-5 text-yellow-500" />;
    if (t.includes("Node") || t.includes("Server")) return <Server className="w-5 h-5 text-green-500" />;
    if (t.includes("Data")) return <Database className="w-5 h-5 text-purple-500" />;
    return <Cpu className="w-5 h-5 text-gray-500" />;
  };

  if (view === 'test' && activeLevel) {
    return <DevTest level={activeLevel} questions={getDevQuestions(activeLevel.id)} onComplete={handleComplete} onExit={() => setView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8"> {/* Dark Theme for Dev */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full text-sm font-bold mb-4 border border-blue-500/20">
            FULL STACK ROADMAP
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Dev Skill Evaluation</h1>
          <p className="text-slate-400">Validate your stack expertise from Frontend to DevOps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {DEV_LEVELS.map((level) => {
            // FORCE UNLOCK: Always set locked to false
            const locked = false; 
            const p = progress[level.id];
            
            return (
              <button
                key={level.id}
                disabled={locked}
                onClick={() => { setActiveLevel(level); setView('test'); }}
                className={`relative p-6 rounded-xl border text-left transition-all ${
                  locked 
                    ? 'bg-slate-900/50 border-slate-800 opacity-50' 
                    : 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                    level.difficulty === 'Junior' ? 'bg-green-900/50 text-green-400' :
                    level.difficulty === 'Intermediate' ? 'bg-orange-900/50 text-orange-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>
                    {level.difficulty}
                  </span>
                  {locked ? <Lock className="w-4 h-4 text-slate-600" /> : getIcon(level.topic)}
                </div>

                <h3 className="text-lg font-bold text-slate-100">{level.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{level.topic}</p>

                {p && (
                   <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                     <span className="text-xs text-slate-400">Score</span>
                     <span className={`text-sm font-bold ${p.passed ? 'text-green-400' : 'text-red-400'}`}>
                       {Math.round(p.percentage)}%
                     </span>
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

export default DevDashboard;