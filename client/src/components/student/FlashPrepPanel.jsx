import React, { useCallback, useEffect, useRef, useState } from 'react'
import axiosInstance from '../../utils/axios'
import { toast } from 'react-toastify'
import { Brain, Loader2, Sparkles } from 'lucide-react'

/**
 * Flash-Prep: MCQs for the CURRENT lecture only, from that video’s captions/metadata (server + AI).
 */
const FlashPrepPanel = ({
  courseId,
  lectureId,
  getToken,
  isLectureCompleted,
  onEarnPassToken,
}) => {
  const sectionRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [questions, setQuestions] = useState(null)
  const [quizSessionId, setQuizSessionId] = useState(null)
  const [selections, setSelections] = useState([])
  const [lastResult, setLastResult] = useState(null)
  const [contextHint, setContextHint] = useState(null)
  const [fetchError, setFetchError] = useState(null)

  const resetQuiz = useCallback(() => {
    setQuestions(null)
    setQuizSessionId(null)
    setSelections([])
    setLastResult(null)
    setContextHint(null)
    setFetchError(null)
  }, [])

  useEffect(() => {
    resetQuiz()
  }, [lectureId, resetQuiz])

  useEffect(() => {
    if (questions?.length > 0 && quizSessionId && sectionRef.current) {
      const t = setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 150)
      return () => clearTimeout(t)
    }
  }, [questions, quizSessionId])

  const generateQuiz = async () => {
    setLoading(true)
    setQuestions(null)
    setQuizSessionId(null)
    setSelections([])
    setLastResult(null)
    setContextHint(null)
    setFetchError(null)
    try {
      const token = await getToken()
      const { data } = await axiosInstance.post(
        '/api/user/flash-prep',
        { courseId, lectureId, count: 7 },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!data.success) {
        const msg =
          data.message ||
          'Could not generate quiz. Check that GEMINI_API_KEY or OPENAI_API_KEY is set on the server.'
        setFetchError(msg)
        toast.error(msg)
        return
      }
      if (!data.quizSessionId || !Array.isArray(data.questions) || data.questions.length < 5) {
        const msg = 'Invalid quiz data from server. Try again.'
        setFetchError(msg)
        toast.error(msg)
        return
      }
      setQuizSessionId(data.quizSessionId)
      setQuestions(data.questions)
      setSelections(data.questions.map(() => null))
      if (data.hasTranscript === false) {
        setContextHint(
          'No captions were found for this video; questions use the title and description only.'
        )
      } else {
        setContextHint(null)
      }
      toast.success(`Quiz ready — ${data.questions.length} questions for this lecture.`)
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.message ||
        'Network error while generating the quiz.'
      setFetchError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const setAnswer = (qIndex, optionIndex) => {
    setSelections((prev) => {
      if (!questions?.length) return prev
      const next = questions.map((_, i) => (i < prev.length ? prev[i] : null))
      next[qIndex] = optionIndex
      return next
    })
  }

  const submitQuiz = async () => {
    if (!questions?.length || !quizSessionId) return
    if (selections.length !== questions.length) {
      setSelections(questions.map((_, i) => selections[i] ?? null))
      toast.warning('Please answer all questions.')
      return
    }
    const unanswered = selections.some((s) => s === null || s === undefined)
    if (unanswered) {
      toast.warning('Answer every question before submitting.')
      return
    }
    setVerifying(true)
    setLastResult(null)
    setFetchError(null)
    try {
      const token = await getToken()
      const { data } = await axiosInstance.post(
        '/api/user/flash-prep/verify',
        {
          courseId,
          lectureId,
          quizSessionId,
          answers: selections,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!data.success) {
        const msg =
          data.message ||
          'Verification failed. Generate a new quiz if this keeps happening.'
        setFetchError(msg)
        toast.error(msg)
        return
      }
      if (data.passed) {
        setLastResult({ passed: true, correct: data.correct, total: data.total })
        onEarnPassToken?.(String(lectureId), data.flashPrepPassToken)
        toast.success(
          `Flash-Prep passed (${data.correct}/${data.total}). You can mark this lecture complete.`
        )
      } else {
        setLastResult({
          passed: false,
          correct: data.correct,
          total: data.total,
          minCorrect: data.minCorrect,
          message: data.message,
        })
        toast.error(data.message || 'Not quite — review and submit again, or regenerate.')
      }
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Network error'
      setFetchError(msg)
      toast.error(msg)
    } finally {
      setVerifying(false)
    }
  }

  if (isLectureCompleted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50/80 px-4 py-3 text-sm text-green-800">
        <span className="font-semibold">Flash-Prep:</span> This lecture is completed. Nice work.
      </div>
    )
  }

  return (
    <div
      ref={sectionRef}
      className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/90 to-white px-4 py-4 md:px-5 md:py-5 scroll-mt-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex items-start gap-2 min-w-0">
          <Brain className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" aria-hidden />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-gray-900">Flash-Prep revision</h3>
            <p className="text-xs text-gray-600 mt-0.5 max-w-xl leading-relaxed">
              Questions are generated only from this lecture&apos;s video (captions + YouTube /
              course metadata). They are not mixed with other lectures. Score at least 80% to
              unlock Mark as complete.
            </p>
            {contextHint && (
              <p className="text-xs text-amber-900 mt-2 bg-amber-50 border border-amber-100 rounded-md px-2 py-1.5">
                {contextHint}
              </p>
            )}
            {fetchError && !questions && (
              <p className="text-xs text-red-800 mt-2 bg-red-50 border border-red-100 rounded-md px-2 py-1.5">
                {fetchError}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={generateQuiz}
          disabled={loading || verifying}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors flex-shrink-0"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
          ) : (
            <Sparkles className="w-4 h-4" aria-hidden />
          )}
          {questions ? 'New quiz for this video' : 'Generate flashcards'}
        </button>
      </div>

      {loading && (
        <div className="mb-4 rounded-lg border border-indigo-100 bg-white/80 px-3 py-2.5 text-xs text-gray-700 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600 flex-shrink-0" aria-hidden />
          <span>
            Building your quiz from this video (transcript + metadata). This often takes 15–45
            seconds — please wait.
          </span>
        </div>
      )}

      {questions && (
        <div className="space-y-4 border-t border-indigo-100 pt-4 max-h-[min(70vh,720px)] overflow-y-auto pr-1">
          {questions.map((q, qi) => (
            <fieldset
              key={`${lectureId}-${q.index ?? qi}`}
              className="rounded-lg border border-gray-200 bg-white p-3 md:p-4 min-w-0"
            >
              <legend className="text-xs font-medium text-indigo-600 px-1">
                {(q.category || 'This lecture') + ` · Q${qi + 1}`}
              </legend>
              <p className="text-sm text-gray-900 font-medium mb-3 mt-1">{q.question}</p>
              <div className="space-y-2">
                {(q.options || []).map((opt, oi) => (
                  <label
                    key={oi}
                    className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer transition-colors ${
                      selections[qi] === oi
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`flash-prep-${lectureId}-${qi}`}
                      checked={selections[qi] === oi}
                      onChange={() => setAnswer(qi, oi)}
                      className="text-indigo-600"
                    />
                    <span className="text-gray-800 break-words">{opt}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          {fetchError && questions && (
            <p className="text-xs text-red-800 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {fetchError}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-2 pb-1">
            <button
              type="button"
              onClick={submitQuiz}
              disabled={verifying || loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {verifying && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
              Submit answers
            </button>
            <button
              type="button"
              onClick={resetQuiz}
              disabled={loading || verifying}
              className="text-sm text-gray-600 hover:text-gray-900 underline disabled:opacity-50"
            >
              Clear quiz
            </button>
            {!lastResult?.passed && (
              <span className="text-xs text-gray-500">
                Wrong answers? Adjust your choices and submit again — same quiz until you pass or
                regenerate.
              </span>
            )}
          </div>

          {lastResult && (
            <div
              className={`rounded-lg px-3 py-2 text-sm ${
                lastResult.passed
                  ? 'bg-green-100 text-green-900'
                  : 'bg-amber-50 text-amber-900'
              }`}
              role="status"
            >
              {lastResult.passed ? (
                <span>
                  Passed: {lastResult.correct}/{lastResult.total} correct. You can mark this lecture
                  complete.
                </span>
              ) : (
                <span>
                  {lastResult.message ||
                    `You scored ${lastResult.correct}/${lastResult.total}. Need ${lastResult.minCorrect}+ for 80%.`}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FlashPrepPanel
