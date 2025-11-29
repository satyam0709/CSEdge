// src/components/coding/CodingTest.jsx
import React, { useState, useEffect } from 'react';
import { Timer, Terminal, ArrowRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const CodingTest = ({ level, questions, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(level.timeLimit);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleOptionSelect = (optionIndex) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [questions[currentIndex].id]: optionIndex });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correctCount++;
    });
    const percentage = (correctCount / questions.length) * 100;
    const passed = percentage >= level.requiredScore;

    setTimeout(() => {
      onComplete({
        score: correctCount * 10,
        correctCount,
        totalQuestions: questions.length,
        percentage,
        passed,
        levelId: level.id
      });
    }, 2000);
  };

  const currentQuestion = questions[currentIndex];
  // SMART LAYOUT CHECK
  const hasCode = currentQuestion.code && currentQuestion.code.trim().length > 0;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-purple-600" />
            {level.name}: <span className="text-purple-600">{level.topic}</span>
          </h2>
          <div className="flex gap-2 mt-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
              Q{currentIndex + 1} of {questions.length}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${level.difficulty === 'Hard' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {level.difficulty}
            </span>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
          <Timer className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* DYNAMIC GRID: 2 Cols if Code, 1 Col if Theory */}
      <div className={`grid grid-cols-1 ${hasCode ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'} gap-6`}>
        
        {/* Code Panel - Conditionally Rendered */}
        {hasCode && (
          <div className="space-y-4">
            <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg border border-gray-700 min-h-[300px] flex flex-col">
              <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-gray-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="ml-4 text-xs text-gray-400 font-mono">snippet.cpp</span>
              </div>
              <div className="p-6 overflow-x-auto flex-1">
                <pre className="font-mono text-sm md:text-base leading-relaxed text-blue-300">
                  <code>{currentQuestion.code}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Question Panel */}
        <div className="flex flex-col h-full space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Problem Statement:</h3>
            <p className="text-gray-700 text-lg leading-relaxed">{currentQuestion.question}</p>
          </div>

          <div className="space-y-3 flex-1">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentQuestion.id] === idx;
              const isCorrect = currentQuestion.correctAnswer === idx;
              let statusClass = "border-gray-200 hover:border-purple-400 hover:bg-purple-50";
              if (isSubmitted) {
                if (isCorrect) statusClass = "bg-green-100 border-green-500 text-green-800";
                else if (isSelected && !isCorrect) statusClass = "bg-red-100 border-red-500 text-red-800";
                else statusClass = "opacity-60 border-gray-200";
              } else if (isSelected) {
                statusClass = "bg-purple-100 border-purple-500 text-purple-900 shadow-sm";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${statusClass}`}
                >
                  <span className="font-medium">{option}</span>
                  {isSubmitted && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                </button>
              );
            })}
          </div>

          {isSubmitted && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg animate-in fade-in slide-in-from-bottom-2">
              <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4" /> Logic Explanation
              </h4>
              <p className="text-blue-800 text-sm">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="mt-auto pt-6 border-t flex justify-between items-center">
            <button onClick={() => !isSubmitted && onExit()} className="text-gray-500 hover:text-gray-900 font-medium px-4">Exit</button>
            <div className="flex gap-3">
               {currentIndex > 0 && (
                <button onClick={() => setCurrentIndex(prev => prev - 1)} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700">Previous</button>
              )}
              {currentIndex < questions.length - 1 ? (
                <button onClick={() => setCurrentIndex(prev => prev + 1)} className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black flex items-center gap-2">Next <ArrowRight className="w-4 h-4" /></button>
              ) : !isSubmitted && (
                <button onClick={handleSubmit} className="px-8 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold shadow-lg transition-all">Submit Test</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingTest;