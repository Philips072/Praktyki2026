import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { toast } from 'react-toastify'
import './GradingSection.css'

function GradingSection() {
  console.log('GradingSection: Renderowanie komponentu...')

  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [grading, setGrading] = useState(false)

  const fetchAssignments = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('GradingSection: Pobieranie przypisań...')

      // Najpierw pobierz wszystkie przypisania, aby zobaczyć jakie statusy są
      const { data: allAssignments, error: allError } = await supabase
        .from('assignments')
        .select('id, status, assigned_at, score, question_answers, student_id, tests (id, title)')
        .order('assigned_at', { ascending: false })

      console.log('GradingSection: Wszystkie przypisania:', allAssignments?.length, 'statusy:', allAssignments?.map(a => a.status))

      if (allError) {
        console.error('GradingSection: Błąd pobierania wszystkich:', allError)
      }

      // Pobierz przypisania do oceny
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select(`
          id,
          status,
          assigned_at,
          score,
          question_answers,
          student_id,
          tests (
            id,
            title,
            description,
            skill,
            expected_sql,
            questions,
            grading_thresholds
          )
        `)
        .in('status', ['completed', 'graded'])
        .order('assigned_at', { ascending: false })

      if (assignmentsError) {
        console.error('GradingSection: Błąd:', assignmentsError)
        throw assignmentsError
      }

      console.log('GradingSection: Przypisania do oceny:', assignmentsData?.length)

      // Pobierz dane uczniów oddzielnie
      const studentIds = assignmentsData?.map(a => a.student_id).filter(Boolean) || []
      let studentsMap = {}

      if (studentIds.length > 0) {
        const { data: studentsData } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', studentIds)

        studentsMap = Object.fromEntries(
          (studentsData || []).map(s => [s.id, s])
        )
        console.log('GradingSection: Uczniowie:', Object.keys(studentsMap).length)
      }

      // Połącz dane
      const assignmentsWithStudents = (assignmentsData || []).map(assignment => ({
        ...assignment,
        student: studentsMap[assignment.student_id] || { id: assignment.student_id, name: 'Nieznany' }
      }))

      console.log('GradingSection: Ustawiam assignments:', assignmentsWithStudents.length)
      setAssignments(assignmentsWithStudents)
    } catch (err) {
      console.error('GradingSection: Błąd w try/catch:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, [])

  // Oblicz ocenę automatycznie
  const calculateAutoGrade = (test, questionAnswers) => {
    if (!test?.questions || !questionAnswers) {
      console.log('calculateAutoGrade: Brak danych', { test, questionAnswers })
      return 0
    }

    let totalPoints = 0
    let earnedPoints = 0

    console.log('calculateAutoGrade: Pytania:', test.questions.length, 'Odpowiedzi:', questionAnswers.length)

    test.questions.forEach(question => {
      totalPoints += question.points || 2

      const answer = questionAnswers.find(qa => qa.questionId === question.id)
      if (!answer) {
        console.log(`Pytanie ${question.id}: Brak odpowiedzi`)
        return
      }

      if (question.type === 'sql') {
        // Sprawdź czy SQL pasuje do wzorcowego (obsługa camelCase i snake_case)
        const expectedSql = question.expectedSql || question.expected_sql
        const expectedClean = expectedSql?.trim().replace(/\s+/g, ' ').toLowerCase()
        const answerClean = answer.answer?.trim().replace(/\s+/g, ' ').toLowerCase()

        console.log(`SQL Q${question.id}: oczekiwane="${expectedClean}", odpowiedz="${answerClean}"`)

        if (expectedClean && answerClean === expectedClean) {
          earnedPoints += question.points || 2
        }
      } else if (question.type === 'multiple_choice' || question.type === 'true_false') {
        console.log(`Q${question.id} (${question.type}): odpowiedz="${answer.answer}", poprawne="${question.correctAnswer}"`)
        if (answer.answer === question.correctAnswer) {
          earnedPoints += question.points || 2
        }
      }
    })

    const result = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
    console.log(`calculateAutoGrade: Wynik=${result} (${earnedPoints}/${totalPoints} pkt)`)
    return result
  }

  // Oblicz ocenę tekstową (1-5 lub 1-6)
  const getLetterGrade = (score, thresholds) => {
    if (!thresholds) return 'ndst'

    // Obsługa formatu obiektowego {1: 0, 2: 30, ...}
    if (typeof thresholds === 'object' && !Array.isArray(thresholds)) {
      const entries = Object.entries(thresholds)
        .map(([grade, minPercent]) => ({ grade: String(grade), minPercent: Number(minPercent) }))
        .sort((a, b) => b.minPercent - a.minPercent)
      for (const t of entries) {
        if (score >= t.minPercent) return t.grade
      }
      return entries[entries.length - 1]?.grade || '1'
    }

    // Obsługa formatu tablicowego [{grade: '1', minPercent: 0}, ...]
    if (Array.isArray(thresholds) && thresholds.length > 0) {
      const sorted = [...thresholds].sort((a, b) => b.minPercent - a.minPercent)
      for (const t of sorted) {
        if (score >= t.minPercent) return t.grade
      }
      return sorted[sorted.length - 1]?.grade || '1'
    }

    return 'ndst'
  }

  // Sprawdź czy skala jest 1-6
  const hasGrade6 = (thresholds) => {
    if (!thresholds) return false

    // Obsługa formatu obiektowego
    if (typeof thresholds === 'object' && !Array.isArray(thresholds)) {
      return '6' in thresholds
    }

    // Obsługa formatu tablicowego
    if (Array.isArray(thresholds)) {
      return thresholds.some(t => t.grade === '6' || t.grade === 6)
    }

    return false
  }

  const handleGrade = async (assignmentId, score, questionScores) => {
    setGrading(true)
    try {
      const { error } = await supabase
        .from('assignments')
        .update({
          score: Number(score),
          status: 'graded',
          question_scores: questionScores
        })
        .eq('id', assignmentId)

      if (error) throw error

      toast.success('Ocena została zapisana')
      fetchAssignments()
      setSelectedAssignment(null)
    } catch (err) {
      toast.error('Błąd zapisu oceny: ' + err.message)
    } finally {
      setGrading(false)
    }
  }

  const handleAutoGrade = (assignment) => {
    const autoScore = calculateAutoGrade(assignment.tests, assignment.question_answers)

    const questionScores = assignment.tests?.questions?.map(q => {
      const answer = assignment.question_answers?.find(qa => qa.questionId === q.id)
      let isCorrect = false

      if (q.type === 'sql') {
        const expectedSql = q.expectedSql || q.expected_sql
        const expectedClean = expectedSql?.trim().replace(/\s+/g, ' ').toLowerCase()
        const answerClean = answer?.answer?.trim().replace(/\s+/g, ' ').toLowerCase()
        isCorrect = expectedClean && answerClean === expectedClean
      } else if (q.type === 'multiple_choice' || q.type === 'true_false') {
        isCorrect = answer?.answer === q.correctAnswer
      }

      return {
        questionId: q.id,
        isCorrect,
        points: isCorrect ? (q.points || 2) : 0
      }
    }) || []

    handleGrade(assignment.id, autoScore, questionScores)
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="gs-section">
        <div className="gs-loading">
          <div className="gs-spinner"></div>
          <p>Ładowanie testów do oceny...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="gs-section">
        <div className="gs-error">
          <p>Błąd: {error}</p>
          <button onClick={fetchAssignments} className="gs-btn gs-btn--secondary">
            Spróbuj ponownie
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="gs-section">
      <div className="gs-header">
        <h2 className="gs-title">Ocena testów <span className="gs-count">({assignments.length})</span></h2>
        <button onClick={fetchAssignments} className="gs-btn gs-btn--secondary">
          Odśwież
        </button>
      </div>

      {assignments.length === 0 ? (
        <div className="gs-empty">
          <div className="gs-empty-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3>Brak testów do oceny</h3>
          <p>Żaden uczeń nie ukończył jeszcze żadnego testu.</p>
        </div>
      ) : (
        <div className="gs-list">
          {assignments.map(assignment => {
            const test = assignment.tests
            const student = assignment.student
            const isGraded = assignment.score !== null
            const answeredCount = assignment.question_answers?.length || 0
            const totalQuestions = test?.questions?.length || 0

            return (
              <div key={assignment.id} className="gs-card">
                <div className="gs-card-header">
                  <div className="gs-card-student">
                    <span className="gs-avatar">{student?.name?.charAt(0) || '?'}</span>
                    <div className="gs-student-info">
                      <span className="gs-student-name">{student?.name || 'Nieznany'}</span>
                      <span className="gs-test-title">{test?.title || 'Bez tytułu'}</span>
                    </div>
                  </div>
                  <div className="gs-card-status">
                    {isGraded ? (
                      <span className="gs-badge gs-badge--graded">
                        {assignment.score} pkt
                      </span>
                    ) : (
                      <span className="gs-badge gs-badge--pending">
                        Do oceny
                      </span>
                    )}
                  </div>
                </div>

                <div className="gs-card-meta">
                  <span className="gs-progress">
                    {answeredCount}/{totalQuestions} pytań
                  </span>
                  {test?.skill && <span className="gs-skill">{test.skill}</span>}
                  <span className="gs-date">{formatDate(assignment.assigned_at)}</span>
                </div>

                <div className="gs-card-actions">
                  <button
                    onClick={() => setSelectedAssignment(assignment)}
                    className="gs-btn gs-btn--primary"
                  >
                    {isGraded ? 'Zobacz ocenę' : 'Oceń'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal oceny */}
      {selectedAssignment && (
        <GradingModal
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          onGrade={handleGrade}
          onAutoGrade={handleAutoGrade}
          getLetterGrade={getLetterGrade}
          calculateAutoGrade={calculateAutoGrade}
          grading={grading}
        />
      )}
    </div>
  )
}

// Modal oceny - oddzielny komponent
function GradingModal({
  assignment,
  onClose,
  onGrade,
  onAutoGrade,
  getLetterGrade,
  calculateAutoGrade,
  grading
}) {
  // Własny stan auto-grade dla tego modala
  const [autoGrade, setAutoGrade] = useState(false)

  // Konwertuj progi do formatu tablicowego dla wyświetlania
  const convertThresholdsToArray = (thresholds) => {
    if (!thresholds) return []

    // Format tablicowy - zwróć jak jest
    if (Array.isArray(thresholds)) {
      return thresholds.map(t => ({
        grade: String(t.grade),
        minPercent: Number(t.minPercent)
      }))
    }

    // Format obiektowy {1: 0, 2: 30, ...} - konwertuj
    if (typeof thresholds === 'object') {
      return Object.entries(thresholds)
        .map(([grade, minPercent]) => ({
          grade: String(grade),
          minPercent: Number(minPercent)
        }))
        .sort((a, b) => a.minPercent - b.minPercent) // Sortuj rosnąco
    }

    return []
  }

  const displayThresholds = convertThresholdsToArray(assignment.tests?.grading_thresholds)
  const hasGrade6 = displayThresholds.some(t => t.grade === '6')

  const handleSaveGrade = async () => {
    const score = document.getElementById('gs-score-input').value
    const questionScores = assignment.tests?.questions?.map(q => {
      const input = document.querySelector(`input[data-question-id="${q.id}"]`)
      return {
        questionId: q.id,
        points: input ? parseInt(input.value) || 0 : 0
      }
    }) || []

    await onGrade(assignment.id, score, questionScores)
  }

  return (
    <div className="gs-modal-overlay" onClick={onClose}>
      <div className="gs-modal" onClick={e => e.stopPropagation()}>
        <div className="gs-modal-header">
          <h3 className="gs-modal-title">Oceń test</h3>
          <button onClick={onClose} className="gs-modal-close">×</button>
        </div>

        <div className="gs-modal-content">
          <div className="gs-modal-student">
            <span className="gs-avatar gs-avatar--lg">
              {assignment.student?.name?.charAt(0) || '?'}
            </span>
            <div>
              <div className="gs-student-name">{assignment.student?.name}</div>
              <div className="gs-test-title">{assignment.tests?.title}</div>
            </div>
          </div>

          {assignment.tests?.description && (
            <div className="gs-detail-item">
              <span className="gs-detail-label">Instrukcja:</span>
              <span className="gs-detail-value">{assignment.tests.description}</span>
            </div>
          )}

          {/* Lista pytań */}
          <div className="gs-questions-list">
            {assignment.tests?.questions?.map((question, idx) => {
              const answer = assignment.question_answers?.find(
                qa => qa.questionId === question.id
              )
              const existingScore = assignment.question_scores?.find(
                qs => qs.questionId === question.id
              )
              const questionPoints = question.points || 2

              return (
                <div key={question.id} className="gs-question-item">
                  <div className="gs-question-header">
                    <span className="gs-question-number">Pytanie {idx + 1}</span>
                    <span className="gs-question-type">
                      {question.type === 'sql' ? 'SQL' :
                       question.type === 'multiple_choice' ? 'Wybór' : 'P/F'}
                    </span>
                    <span className="gs-question-points">{questionPoints} pkt</span>
                  </div>

                  <h4 className="gs-question-title">{question.title}</h4>

                  {question.description && (
                    <p className="gs-question-desc">{question.description}</p>
                  )}

                  <div className="gs-answer-section">
                    <span className="gs-detail-label">Odpowiedź ucznia:</span>

                    {question.type === 'sql' ? (
                      <div className="gs-answer-content gs-answer-content--code">
                        <code>{answer?.answer || 'Brak odpowiedzi'}</code>
                        {(question.expectedSql || question.expected_sql) && (
                          <div className="gs-expected">
                            <span className="gs-detail-label">Oczekiwane:</span>
                            <code>{question.expectedSql || question.expected_sql}</code>
                          </div>
                        )}
                      </div>
                    ) : question.type === 'multiple_choice' ? (
                      <div className="gs-answer-content gs-answer-content--choice">
                        <span className="gs-choice-answer">
                          Wybrano: <strong>{answer?.answer || '-'}</strong>
                        </span>
                        <span className="gs-choice-correct">
                          Poprawne: <strong>{question.correctAnswer}</strong>
                        </span>
                        {answer?.answer && (
                          <span className={`gs-choice-badge ${
                            answer.answer === question.correctAnswer ? 'correct' : 'incorrect'
                          }`}>
                            {answer.answer === question.correctAnswer ? '✓ Dobrze' : '✗ Źle'}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="gs-answer-content gs-answer-content--tf">
                        <span className="gs-choice-answer">
                          Wybrano: <strong>{answer?.answer === 'true' ? 'Prawda' :
                                          answer?.answer === 'false' ? 'Fałsz' : '-'}</strong>
                        </span>
                        <span className="gs-choice-correct">
                          Poprawne: <strong>{question.correctAnswer === 'true' ? 'Prawda' : 'Fałsz'}</strong>
                        </span>
                        {answer?.answer && (
                          <span className={`gs-choice-badge ${
                            answer.answer === question.correctAnswer ? 'correct' : 'incorrect'
                          }`}>
                            {answer.answer === question.correctAnswer ? '✓ Dobrze' : '✗ Źle'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Punktacja dla tego pytania */}
                  <div className="gs-question-grading">
                    <label className="gs-grading-label-small">Punkty:</label>
                    <div className="gs-points-input-group">
                      <input
                        type="number"
                        min="0"
                        max={questionPoints}
                        step="1"
                        defaultValue={existingScore?.points || 0}
                        data-question-id={question.id}
                        className="gs-points-input-small"
                      />
                      <span className="gs-points-max">/ {questionPoints}</span>
                    </div>
                    <label className="gs-checkbox-label">
                      <input
                        type="checkbox"
                        data-auto-points={question.id}
                        defaultChecked={existingScore?.points === questionPoints}
                        onChange={(e) => {
                          const input = document.querySelector(`input[data-question-id="${question.id}"]`)
                          if (input) {
                            input.value = e.target.checked ? questionPoints : 0
                          }
                        }}
                      />
                      <span>Pełna punktacja</span>
                    </label>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="gs-grading-summary">
          <div className="gs-auto-grade-section">
            <label className="gs-checkbox-label">
              <input
                type="checkbox"
                checked={autoGrade}
                onChange={(e) => {
                  setAutoGrade(e.target.checked)
                  if (e.target.checked) {
                    const autoScore = calculateAutoGrade(
                      assignment.tests,
                      assignment.question_answers
                    )
                    document.getElementById('gs-score-input').value = autoScore

                    // Wypełnij punkty dla poszczególnych pytań
                    assignment.tests?.questions?.forEach(q => {
                      const answer = assignment.question_answers?.find(qa => qa.questionId === q.id)
                      let isCorrect = false

                      if (q.type === 'sql') {
                        const expectedSql = q.expectedSql || q.expected_sql
                        const expectedClean = expectedSql?.trim().replace(/\s+/g, ' ').toLowerCase()
                        const answerClean = answer?.answer?.trim().replace(/\s+/g, ' ').toLowerCase()
                        isCorrect = expectedClean && answerClean === expectedClean
                      } else if (q.type === 'multiple_choice' || q.type === 'true_false') {
                        isCorrect = answer?.answer === q.correctAnswer
                      }

                      const pointsInput = document.querySelector(`input[data-question-id="${q.id}"]`)
                      const checkboxInput = document.querySelector(`input[data-auto-points="${q.id}"]`)
                      if (pointsInput) {
                        pointsInput.value = isCorrect ? (q.points || 2) : 0
                      }
                      if (checkboxInput) {
                        checkboxInput.checked = isCorrect
                      }
                    })
                  }
                }}
              />
              <span>Automatycznie oblicz ocenę (na podstawie poprawnych odpowiedzi)</span>
            </label>
            <button
              onClick={() => onAutoGrade(assignment)}
              className="gs-btn gs-btn--small gs-btn--secondary"
              disabled={!autoGrade}
            >
              Oblicz
            </button>
          </div>

          <div className="gs-grading-form">
            <div>
              <label className="gs-grading-label">Wystaw ocenę (0-100):</label>
              <div className="gs-grading-inputs">
                <input
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={assignment.score || 0}
                  id="gs-score-input"
                  className="gs-score-input"
                />
                <button
                  onClick={handleSaveGrade}
                  className="gs-btn gs-btn--primary"
                  disabled={grading}
                >
                  {grading ? 'Zapisywanie...' : 'Zapisz ocenę'}
                </button>
              </div>
              {assignment.score !== null && (
                <div className="gs-grade-info">
                  <span>Ocena: </span>
                  <strong className="gs-grade-letter">
                    {getLetterGrade(assignment.score, displayThresholds)}
                  </strong>
                </div>
              )}
            </div>

            {/* Zarządzanie progami oceniania */}
            <div className="gs-thresholds-manager">
              <div className="gs-thresholds-header">
                <h4>Skala oceniania: {hasGrade6 ? '1-6' : '1-5'}</h4>
              </div>
              <div className="gs-thresholds-grid">
                {displayThresholds.map((threshold) => (
                  <div key={threshold.grade} className="gs-threshold-display-item">
                    <span className="gs-threshold-grade-badge">{threshold.grade}</span>
                    <span className="gs-threshold-value">{threshold.minPercent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GradingSection
