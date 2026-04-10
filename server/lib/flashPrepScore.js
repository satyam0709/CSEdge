/** Score Flash-Prep MCQ attempt (≥80% correct = pass). */
export function scoreFlashPrepAnswers(correctIndices, selectedIndices) {
  if (!Array.isArray(correctIndices) || !Array.isArray(selectedIndices)) {
    return { correct: 0, total: 0, passed: false }
  }
  const total = correctIndices.length
  if (selectedIndices.length !== total) {
    return { correct: 0, total, passed: false }
  }
  let correct = 0
  for (let i = 0; i < total; i++) {
    if (Number(selectedIndices[i]) === correctIndices[i]) correct++
  }
  const minCorrect = Math.ceil(total * 0.8)
  const passed = correct >= minCorrect
  return { correct, total, passed, minCorrect }
}
