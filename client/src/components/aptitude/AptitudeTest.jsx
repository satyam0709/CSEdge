// src/components/aptitude/AptitudeTest.jsx
import React, { useState, useEffect } from 'react';
import { Timer, AlertCircle, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const AptitudeTest = ({ level, questions, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(level.timeLimit);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Timer Logic
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
      // Use loose equality (==) just in case types differ, but strict (===) is better if types match
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = (correctCount / questions.length) * 100;
    const passed = percentage >= level.requiredScore;

    // Wait a moment then send data back
    setTimeout(() => {
      onComplete({
        score: correctCount * 10,
        correctCount,
        totalQuestions: questions.length,
        percentage,
        passed,
        levelId: level.id
      });
    }, 1500);
  };

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{level.name} Assessment</h2>
          <span className="text-sm text-gray-500">Question {currentIndex + 1} of {questions.length}</span>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
          <Timer className="w-5 h-5" />
          <span className="font-bold text-xl">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Question Area */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = answers[currentQuestion.id] === idx;
            const isCorrect = currentQuestion.correctAnswer === idx;
            
            let buttonStyle = "border-gray-200 hover:bg-gray-50 hover:border-blue-300";
            if (isSubmitted) {
              if (isCorrect) buttonStyle = "bg-green-100 border-green-500 text-green-800";
              else if (isSelected && !isCorrect) buttonStyle = "bg-red-100 border-red-500 text-red-800";
              else buttonStyle = "opacity-50 border-gray-200";
            } else if (isSelected) {
              buttonStyle = "bg-blue-50 border-blue-500 text-blue-700 shadow-sm";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isSubmitted}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between group ${buttonStyle}`}
              >
                <span className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white border text-sm font-bold text-gray-500 group-hover:border-blue-400">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </span>
                {isSubmitted && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-800 mb-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Explanation
            </h4>
            <p className="text-blue-700 text-sm">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Footer / Navigation */}
      <div className="flex justify-between items-center pt-6 border-t">
        <button
          onClick={() => !isSubmitted && onExit()}
          className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2"
        >
          Exit Test
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            !isSubmitted && (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Submit Test
              </button>
            )
          ) : (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-md"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AptitudeTest;