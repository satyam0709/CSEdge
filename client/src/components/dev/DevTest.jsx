// src/components/dev/DevTest.jsx — matches AptitudeTest: server-side grading + explanations
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { AlertCircle, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from '../../utils/axios';
import { withClerkAuth } from '../../utils/testApiAuth';

const DevTest = ({ level, questions: questionsProp, onComplete, onExit }) => {
  const { getToken } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questions, setQuestions] = useState(questionsProp);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setQuestions(questionsProp);
    setCurrentIndex(0);
    setAnswers({});
    setIsSubmitted(false);
  }, [questionsProp]);

  const qKey = (q) => q._id || q.id;

  const handleOptionSelect = (optionIndex) => {
    if (isSubmitted || submitting) return;
    setAnswers({ ...answers, [qKey(questions[currentIndex])]: optionIndex });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    let correctCount = 0;
    const next = questions.map((q) => ({ ...q }));
    for (let i = 0; i < next.length; i++) {
      const q = next[i];
      const idx = answers[qKey(q)];
      const selectedText =
        typeof idx === 'number' && q.options?.[idx] !== undefined ? q.options[idx] : idx;
      try {
        const { data } = await axios.post(
          '/api/test/submit',
          {
            questionId: qKey(q),
            selectedAnswer: selectedText,
            type: 'dev',
          },
          await withClerkAuth(getToken)
        );

        if (data.success && data.correct) correctCount++;
        if (data.explanation) q.explanation = data.explanation;
        if (data.correctAnswer != null && q.options) {
          const cidx = q.options.findIndex(
            (o) =>
              String(o).trim().toLowerCase() === String(data.correctAnswer).trim().toLowerCase()
          );
          if (cidx >= 0) q.correctAnswer = cidx;
        }
      } catch (err) {
        console.error('submit error', err);
      }
    }
    setQuestions(next);
    setIsSubmitted(true);
    setSubmitting(false);

    const percentage = next.length ? (correctCount / next.length) * 100 : 0;
    const passed = percentage >= (level.requiredScore ?? 50);

    setTimeout(() => {
      onComplete({
        score: Math.round(percentage),
        correctCount,
        totalQuestions: next.length,
        percentage,
        passed,
        levelId: level.id
      });
    }, 600);
  };

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) return <div className="text-slate-300">Loading...</div>;

  if (submitting) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-slate-300">
        Grading your answers…
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-800/80 rounded-xl shadow-lg border border-slate-700">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-600">
        <div>
          <h2 className="text-2xl font-bold text-white">{level.name} — Full Stack</h2>
          <span className="text-sm text-slate-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-slate-100 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = answers[qKey(currentQuestion)] === idx;
            const isCorrect =
              Number.isInteger(currentQuestion.correctAnswer) &&
              currentQuestion.correctAnswer === idx;

            let buttonStyle = 'border-slate-600 hover:bg-slate-700/50 hover:border-blue-500';
            if (isSubmitted) {
              if (isCorrect) buttonStyle = 'bg-emerald-900/40 border-emerald-500 text-emerald-200';
              else if (isSelected && !isCorrect) buttonStyle = 'bg-rose-900/40 border-rose-500 text-rose-200';
              else buttonStyle = 'opacity-50 border-slate-600';
            } else if (isSelected) {
              buttonStyle = 'bg-blue-900/40 border-blue-500 text-blue-100';
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isSubmitted}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between ${buttonStyle}`}
              >
                <span className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 border text-sm font-bold text-slate-300">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </span>
                {isSubmitted && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
              </button>
            );
          })}
        </div>

        {isSubmitted && currentQuestion.explanation && (
          <div className="mt-6 p-4 bg-slate-900/80 rounded-lg border border-slate-600">
            <h4 className="font-bold text-blue-300 mb-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Explanation
            </h4>
            <p className="text-slate-300 text-sm">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-slate-600">
        <button
          onClick={() => !isSubmitted && onExit()}
          className="text-slate-400 hover:text-white font-medium px-4 py-2"
        >
          Exit
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 disabled:opacity-50 flex items-center gap-2 text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            !isSubmitted && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-medium disabled:opacity-50"
              >
                Submit Test
              </button>
            )
          ) : (
            <button
              onClick={() =>
                setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevTest;
