import React, { useState, useEffect } from 'react';
import { Timer, Code2, ArrowRight, Check, X, AlertTriangle } from 'lucide-react';

const DevTest = ({ level, questions, onComplete, onExit }) => {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(level.timeLimit);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted || timeLeft <= 0) { if(timeLeft<=0) handleSubmit(); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, submitted]);

  const handleSubmit = () => {
    setSubmitted(true);
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.correctAnswer) correct++; });
    const pct = (correct / questions.length) * 100;
    setTimeout(() => onComplete({ score: correct*10, percentage: pct, passed: pct >= level.requiredScore, levelId: level.id }), 2000);
  };

  const current = questions[index];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-900 min-h-screen text-slate-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Code2 className="text-blue-400" /> {level.topic}
        </h2>
        <div className="font-mono text-xl font-bold text-blue-400">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Question Panel */}
        <div className="space-y-6">
          <div className="bg-black rounded-lg border border-slate-700 overflow-hidden">
             <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-red-500"/>
               <span className="w-2 h-2 rounded-full bg-yellow-500"/>
               <span className="w-2 h-2 rounded-full bg-green-500"/>
               <span className="ml-2 font-mono">interview_question.js</span>
             </div>
             <div className="p-6">
               {current.code ? (
                 <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">{current.code}</pre>
               ) : (
                 <div className="text-slate-500 italic text-center py-8">Concept Question (No Code)</div>
               )}
             </div>
          </div>
          
          <div className="text-lg font-medium text-white">{current.question}</div>
        </div>

        {/* Options Panel */}
        <div className="space-y-3">
          {current.options.map((opt, idx) => {
            const sel = answers[current.id] === idx;
            const cor = current.correctAnswer === idx;
            let style = "border-slate-700 bg-slate-800 hover:bg-slate-700";
            
            if (submitted) {
              if (cor) style = "bg-green-900/40 border-green-500 text-green-300";
              else if (sel) style = "bg-red-900/40 border-red-500 text-red-300";
              else style = "opacity-50 border-slate-700";
            } else if (sel) {
              style = "bg-blue-900/40 border-blue-500 text-blue-300";
            }

            return (
              <button 
                key={idx} 
                onClick={() => !submitted && setAnswers({...answers, [current.id]: idx})}
                disabled={submitted}
                className={`w-full text-left p-4 rounded-lg border transition-all flex justify-between ${style}`}
              >
                <span>{opt}</span>
                {submitted && cor && <Check className="w-5 h-5"/>}
                {submitted && sel && !cor && <X className="w-5 h-5"/>}
              </button>
            );
          })}
          
          {submitted && (
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800 rounded text-sm text-blue-300 flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5"/>
              {current.explanation}
            </div>
          )}

          <div className="pt-6 mt-auto flex justify-between">
            <button onClick={onExit} className="text-slate-500 hover:text-white">Exit</button>
            {index < questions.length - 1 ? (
              <button onClick={() => setIndex(i => i + 1)} className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-slate-200">
                Next <ArrowRight className="inline w-4 h-4"/>
              </button>
            ) : !submitted && (
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-500">
                Submit Answers
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevTest;