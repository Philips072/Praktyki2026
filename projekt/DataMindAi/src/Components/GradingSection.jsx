import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { toast } from 'react-toastify'
import './GradingSection.css'

function GradingSection() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [grading, setGrading] = useState(false)
  const [autoGrade, setAutoGrade] = useState(false)

  const fetchAssignments = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          id,
          status,
          assigned_at,
          score,
          question_answers,
          tests (
            id,
            title,
            description,
            skill,
            expected_sql,
            questions,
            grading_thresholds
          ),
          student:profiles!assignments_student_id_fkey (
            id,
            name
          )
        `)
        .in('status', ['completed', 'graded'])
        .order('assigned_at', { ascending: false })

      if (error) throw error
      setAssignments(data || [])
    } catch (err) {
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
    if (!test?.questions || !questionAnswers) return 0

    let totalPoints = 0
    let earnedPoints = 0

    test.questions.forEach(question => {
      totalPoints += question.points || 2

      const answer = questionAnswers.find(qa => qa.questionId === question.id)
      if (!answer) return

      if (question.type === 'sql') {
        // Sprawdź czy SQL pasuje do wzorcowego
        const expectedClean = question.expectedSql?.trim().replace(/\s+/g, ' ').toLowerCase()
        const answerClean = answer.answer?.trim().replace(/\s+/g, ' ').toLowerCase()

        if (expectedClean && answerClean === expectedClean) {
          earnedPoints += question.points || 2
        }
      } else if (question.type === 'multiple_choice' || question.type === 'true_false') {
        if (answer.answer === question.correctAnswer) {
          earnedPoints += question.points || 2
        }
      }
    })

    return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
  }

  // Oblicz ocenę tekstową (1-6)
  const getLetterGrade = (score, thresholds) => {
    if (!thresholds) return '-'
    const sorted = [...thresholds].sort((a, b) => b.minPercent - a.minPercent)
    for (const t of sorted) {
      if (score >= t.minPercent) return t.grade
    }
    return sorted[sorted.length - 1]?.grade || '1'
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
        const expectedClean = q.expectedSql?.trim().replace(/\s+/g, ' ').toLowerCase()
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
          autoGrade={autoGrade}
          setAutoGrade={setAutoGrade}
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
  grading,
  autoGrade,
  setAutoGrade
}) {
  const [localThresholds, setLocalThresholds] = useState(assignment.tests?.grading_thresholds || [])

  // Sprawdź czy ocena 6 jest obecna
  const hasGrade6 = localThresholds.some(t => t.grade === '6')

  const addGrade6 = () => {
    const newThresholds = [...localThresholds, { minPercent: 95, grade: '6' }]
    setLocalThresholds(newThresholds)
  }

  const removeGrade6 = () => {
    const newThresholds = localThresholds.filter(t => t.grade !== '6')
    setLocalThresholds(newThresholds)
  }

  const updateThreshold = (grade, field, value) => {
    const newThresholds = localThresholds.map(t =>
      t.grade === grade ? { ...t, [field]: value } : t
    )
    setLocalThresholds(newThresholds)
  }

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
                      {question.expectedSql && (
                        <div className="gs-expected">
                          <span className="gs-detail-label">Oczekiwane:</span>
                          <code>{question.expectedSql}</code>
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
                  {getLetterGrade(assignment.score, localThresholds)}
                </strong>
              </div>
            )}
          </div>

          {/* Zarządzanie progami oceniania */}
          <div className="gs-thresholds-manager">
            <div className="gs-thresholds-header">
              <h4>Progi oceniania (skala 1-6)</h4>
            </div>
            <div className="gs-thresholds-grid">
              {localThresholds.map((threshold) => (
                <div key={threshold.grade} className="gs-threshold-manage-item">
                  <span className="gs-threshold-grade-badge">{threshold.grade}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="gs-threshold-input-small"
                    value={threshold.minPercent}
                    onChange={(e) => updateThreshold(threshold.grade, 'minPercent', Number(e.target.value))}
                  />
                  <span>%</span>
                  {threshold.grade === '6' && (
                    <button
                      onClick={removeGrade6}
                      className="gs-btn gs-btn--remove-threshold"
                      title="Usuń ocenę 6"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {!hasGrade6 && (
                <button
                  onClick={addGrade6}
                  className="gs-btn gs-btn--add-grade-6"
                  title="Dodaj ocenę opcajonalną"
                >
                  + Dodaj ocenę 6
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GradingSection
