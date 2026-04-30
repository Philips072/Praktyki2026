import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { toast } from 'react-toastify'
import './TestGradingModal.css'

function TestGradingModal({ onClose, tests, preSelectedTestId = null, preSelectedAssignmentId = null }) {
  const [selectedTestId, setSelectedTestId] = useState(preSelectedTestId)
  const [testDetails, setTestDetails] = useState(null)
  const [studentAssignments, setStudentAssignments] = useState([])
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(preSelectedAssignmentId || null)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Punkty dla pytan (questionId: points)
  const [questionPoints, setQuestionPoints] = useState({})

  // Reczny wynik (jesli nauczyciel chce nadpisac)
  const [manualScore, setManualScore] = useState('')
  const [useManualScore, setUseManualScore] = useState(false)

  // Obliczony wynik (na podstawie punktow)
  const [calculatedScore, setCalculatedScore] = useState(0)
  const [letterGrade, setLetterGrade] = useState('---')

  // Pobierz szczegoly testu gdy wybrano
  useEffect(() => {
    const fetchTestDetails = async () => {
      if (!selectedTestId) {
        setTestDetails(null)
        setStudentAssignments([])
        setSelectedAssignmentId(null)
        setSelectedAssignment(null)
        setQuestionPoints({})
        return
      }

      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('tests')
          .select('id, title, description, skill, questions, grading_thresholds')
          .eq('id', selectedTestId)
          .single()

        if (error) throw error
        setTestDetails(data)

        // Inicjalizuj questionPoints (punkty startowe = 0)
        const initialPoints = {}
        data.questions?.forEach(q => {
          initialPoints[q.id] = 0
        })
        setQuestionPoints(initialPoints)

        // Pobierz przypisania do tego testu (ukonczone lub ocenione)
        await fetchStudentAssignments(selectedTestId)
      } catch (error) {
        toast.error('Blad pobierania testu: ' + error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTestDetails()
  }, [selectedTestId])

  // Pobierz przypisania uczniow do tego testu
  const fetchStudentAssignments = async (testId) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          id,
          student_id,
          status,
          score,
          question_answers,
          question_scores,
          assigned_at,
          profiles!assignments_student_id_fkey (
            id,
            name
          )
        `)
        .eq('test_id', testId)
        .in('status', ['completed', 'graded'])
        .order('assigned_at', { ascending: false })

      if (error) throw error
      setStudentAssignments(data || [])

      // Jezli mamy pre-selected assignment, ustaw go jako aktywny
      if (preSelectedAssignmentId && data?.length > 0) {
        const found = data.find(a => a.id === preSelectedAssignmentId)
        if (found) {
          setSelectedAssignmentId(preSelectedAssignmentId)
        }
      }
    } catch (error) {
      toast.error('Blad pobierania przypisan: ' + error.message)
    }
  }

  // Pobierz szczegoly przypisania gdy wybrano ucznia
  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      if (!selectedAssignmentId) {
        setSelectedAssignment(null)
        return
      }

      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('assignments')
          .select(`
            id,
            student_id,
            status,
            score,
            question_answers,
            question_scores,
            assigned_at,
            tests (
              id,
              title,
              questions,
              grading_thresholds
            ),
            profiles!assignments_student_id_fkey (
              id,
              name
            )
          `)
          .eq('id', selectedAssignmentId)
          .single()

        if (error) throw error
        setSelectedAssignment(data)

        // Jezli mamy pre-selected assignment ale brak wybranego testu,
        // pobierz test z przypisania
        if (!selectedTestId && data.tests?.id) {
          setSelectedTestId(data.tests.id)
          setTestDetails(data.tests)

          // Inicjalizuj questionPoints
          const initialPoints = {}
          data.tests?.questions?.forEach(q => {
            initialPoints[q.id] = 0
          })
          setQuestionPoints(initialPoints)
        }

        // Wczytaj zapisane punkty dla pytan
        const savedPoints = {}
        if (data.question_scores && data.question_scores.length > 0) {
          data.question_scores.forEach(qs => {
            savedPoints[qs.questionId] = qs.points || 0
          })
        } else {
          // Brak zapisanych punktow - inicjalizuj zerami
          data.tests?.questions?.forEach(q => {
            savedPoints[q.id] = 0
          })
        }
        setQuestionPoints(savedPoints)

        // Jezli jest zapisany wynik, ustaw jako reczny
        if (data.score !== null && data.score !== undefined) {
          setManualScore(data.score)
          setUseManualScore(true)
        } else {
          setManualScore('')
          setUseManualScore(false)
        }
      } catch (error) {
        toast.error('Blad pobierania szczegolow: ' + error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignmentDetails()
  }, [selectedAssignmentId])

  // Oblicz wynik i ocene gdy zmieniaja sie punkty
  useEffect(() => {
    if (!testDetails) return

    const questions = testDetails.questions || []
    const totalPossiblePoints = questions.reduce((sum, q) => sum + (q.points || 2), 0)
    const earnedPoints = Object.values(questionPoints).reduce((sum, points) => sum + (points || 0), 0)

    const percentage = totalPossiblePoints > 0 ? Math.round((earnedPoints / totalPossiblePoints) * 100) : 0
    setCalculatedScore(percentage)

    if (!useManualScore) {
      setManualScore(percentage)
    }

    // Oblicz ocene literowa
    const grade = calculateLetterGrade(percentage, testDetails.grading_thresholds)
    setLetterGrade(grade)
  }, [questionPoints, testDetails, useManualScore])

  // Funkcja obliczajaca ocene literowa na podstawie progow
  const calculateLetterGrade = (score, thresholds) => {
    if (!thresholds) return '---'

    const entries = Object.entries(thresholds)
      .map(([grade, minPercent]) => ({ grade: String(grade), minPercent: Number(minPercent) }))
      .sort((a, b) => b.minPercent - a.minPercent)

    for (const t of entries) {
      if (score >= t.minPercent) return t.grade
    }
    return entries[entries.length - 1]?.grade || '1'
  }

  // Zmien punkty dla pytania
  const handleQuestionPointsChange = (questionId, maxPoints, value) => {
    let points = parseInt(value) || 0
    if (points < 0) points = 0
    if (points > maxPoints) points = maxPoints
    setQuestionPoints(prev => ({ ...prev, [questionId]: points }))
  }

  // Ustaw pelne punkty dla pytania
  const handleFullPoints = (questionId, maxPoints) => {
    setQuestionPoints(prev => ({ ...prev, [questionId]: maxPoints }))
  }

  // Ustaw zero punktow dla pytania
  const handleZeroPoints = (questionId) => {
    setQuestionPoints(prev => ({ ...prev, [questionId]: 0 }))
  }

  // Automatycznie sprawdz odpowiedzi i przydziel punkty
  const handleAutoCheck = () => {
    if (!selectedAssignment || !testDetails) return

    const questions = testDetails.questions || []
    const newPoints = { ...questionPoints }

    questions.forEach(question => {
      const answer = selectedAssignment.question_answers?.find(
        qa => qa.questionId === question.id
      )

      let isCorrect = false

      if (question.type === 'sql') {
        const expectedSql = question.expectedSql || question.expected_sql
        const expectedClean = expectedSql?.trim().replace(/\s+/g, ' ').toLowerCase()
        const answerClean = answer?.answer?.trim().replace(/\s+/g, ' ').toLowerCase()
        isCorrect = expectedClean && answerClean === expectedClean
      } else if (question.type === 'multiple_choice' || question.type === 'true_false') {
        isCorrect = answer?.answer === question.correctAnswer
      }

      newPoints[question.id] = isCorrect ? (question.points || 2) : 0
    })

    setQuestionPoints(newPoints)
    toast.success('Automatycznie sprawdzono odpowiedzi')
  }

  // Zapisz ocene
  const handleSaveGrade = async () => {
    if (!selectedAssignment || !testDetails) return

    setSaving(true)
    try {
      const questions = testDetails.questions || []
      const questionScores = questions.map(q => ({
        questionId: q.id,
        points: questionPoints[q.id] || 0
      }))

      const finalScore = useManualScore ? parseInt(manualScore) || 0 : calculatedScore

      const { error } = await supabase
        .from('assignments')
        .update({
          score: finalScore,
          status: 'graded',
          question_scores: questionScores
        })
        .eq('id', selectedAssignment.id)

      if (error) throw error

      toast.success('Ocena zapisana pomyslnie!')

      // Odswiez liste przypisan
      await fetchStudentAssignments(testDetails.id)
    } catch (error) {
      toast.error('Blad zapisu oceny: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  // Znajdz odpowiedz ucznia dla pytania
  const getStudentAnswer = (questionId) => {
    return selectedAssignment?.question_answers?.find(qa => qa.questionId === questionId)
  }

  // Pobierz max punkty dla pytania
  const getQuestionMaxPoints = (questionId) => {
    return testDetails?.questions?.find(q => q.id === questionId)?.points || 2
  }

  const currentTest = testDetails || tests?.find(t => t.id === selectedTestId)
  const questions = testDetails?.questions || []
  const totalPossiblePoints = questions.reduce((sum, q) => sum + (q.points || 2), 0)
  const earnedPoints = Object.values(questionPoints).reduce((sum, p) => sum + (p || 0), 0)

  // Jezli mamy pre-selected assignment, ukryj wybor testu (bo juz jest wybrany)
  const showTestSelector = !preSelectedTestId

  return (
    <div className="tgm-overlay" onClick={onClose}>
      <div className="tgm-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="tgm-header">
          <h2 className="tgm-title">Ocenianie testu</h2>
          <button className="tgm-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="tgm-content">
          {/* Krok 1: Wybor testu - pokazuj tylko gdy nie jest pre-selected */}
          {showTestSelector && (
            <div className="tgm-section">
              <label className="tgm-label">Wybierz test:</label>
              <select
                className="tgm-select"
                value={selectedTestId || ''}
                onChange={e => setSelectedTestId(e.target.value || null)}
              >
                <option value="">-- Wybierz test --</option>
                {tests.map(test => (
                  <option key={test.id} value={test.id}>{test.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Krok 2: Wybor ucznia (po wybraniu testu) */}
          {testDetails && (
            <div className="tgm-section">
              <label className="tgm-label">Wybierz ucznia do oceny:</label>
              {loading ? (
                <div className="tgm-loading">Ladowanie...</div>
              ) : studentAssignments.length === 0 ? (
                <div className="tgm-empty">Brak uczniow who ukonczyli ten test.</div>
              ) : (
                <select
                  className="tgm-select"
                  value={selectedAssignmentId || ''}
                  onChange={e => setSelectedAssignmentId(e.target.value || null)}
                >
                  <option value="">-- Wybierz ucznia --</option>
                  {studentAssignments.map(assignment => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.profiles?.name || 'Nieznany'}
                      {assignment.score !== null ? ` (${assignment.score} pkt)` : ' -- Do oceny'}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Krok 3: Ocena pytan (po wybraniu ucznia) */}
          {selectedAssignment && testDetails && (
            <>
              {/* Podsumowanie studenta i testu */}
              <div className="tgm-student-info">
                <div className="tgm-student-header">
                  <span className="tgm-avatar">
                    {selectedAssignment.profiles?.name?.charAt(0) || '?'}
                  </span>
                  <div>
                    <div className="tgm-student-name">{selectedAssignment.profiles?.name}</div>
                    <div className="tgm-test-name">{currentTest?.title}</div>
                  </div>
                </div>
                <button
                  className="tgm-auto-check-btn"
                  onClick={handleAutoCheck}
                >
                  Auto-sprawdz
                </button>
              </div>

              {/* Lista pytan */}
              <div className="tgm-questions">
                {questions.map((question, idx) => {
                  const answer = getStudentAnswer(question.id)
                  const points = questionPoints[question.id] || 0
                  const maxPoints = question.points || 2

                  // Sprawdz czy pytanie bylo juz ocenione (ma zapisane punkty)
                  const existingScore = selectedAssignment?.question_scores?.find(
                    qs => qs.questionId === question.id
                  )
                  const isAlreadyGraded = existingScore && existingScore.points > 0

                  return (
                    <div key={question.id} className={`tgm-question ${isAlreadyGraded ? 'tgm-question--graded' : ''}`}>
                      <div className="tgm-question-header">
                        <span className="tgm-question-number">Pytanie {idx + 1}</span>
                        <span className="tgm-question-type-badge">
                          {question.type === 'sql' ? 'SQL' :
                           question.type === 'multiple_choice' ? 'Wybor' : 'P/F'}
                        </span>
                        <span className="tgm-question-points">{maxPoints} pkt</span>
                        {isAlreadyGraded && (
                          <span className="tgm-graded-badge">Ocenione</span>
                        )}
                      </div>

                      <h4 className="tgm-question-title">{question.title}</h4>

                      {question.description && (
                        <p className="tgm-question-desc">{question.description}</p>
                      )}

                      {/* Odpowiedz ucznia */}
                      <div className="tgm-answer-section">
                        <label className="tgm-answer-label">Odpowiedz ucznia:</label>
                        {question.type === 'sql' ? (
                          <div className="tgm-answer-code">
                            <code>{answer?.answer || 'Brak odpowiedzi'}</code>
                            {(question.expectedSql || question.expected_sql) && (
                              <div className="tgm-expected">
                                <span className="tgm-expected-label">Oczekiwane:</span>
                                <code>{question.expectedSql || question.expected_sql}</code>
                              </div>
                            )}
                          </div>
                        ) : question.type === 'multiple_choice' ? (
                          <div className="tgm-answer-choice">
                            <span>Wybrano: <strong>{answer?.answer || '-'}</strong></span>
                            <span>Poprawne: <strong>{question.correctAnswer}</strong></span>
                            {answer?.answer && (
                              <span className={`tgm-badge ${answer.answer === question.correctAnswer ? 'correct' : 'incorrect'}`}>
                                {answer.answer === question.correctAnswer ? '✓' : '✗'}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="tgm-answer-choice">
                            <span>Wybrano: <strong>{answer?.answer === 'true' ? 'Prawda' : answer?.answer === 'false' ? 'Falsz' : '-'}</strong></span>
                            <span>Poprawne: <strong>{question.correctAnswer === 'true' ? 'Prawda' : 'Falsz'}</strong></span>
                            {answer?.answer && (
                              <span className={`tgm-badge ${answer.answer === question.correctAnswer ? 'correct' : 'incorrect'}`}>
                                {answer.answer === question.correctAnswer ? '✓' : '✗'}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Przyznawanie punktow */}
                      <div className="tgm-grading-inputs">
                        <label className="tgm-points-label">Punkty:</label>
                        <div className="tgm-points-wrapper">
                          <button
                            className="tgm-points-btn tgm-points-btn--zero"
                            onClick={() => handleZeroPoints(question.id)}
                            title="0 punktow"
                          >
                            0
                          </button>
                          <input
                            type="number"
                            className="tgm-points-input"
                            min="0"
                            max={maxPoints}
                            value={points}
                            onChange={e => handleQuestionPointsChange(question.id, maxPoints, e.target.value)}
                          />
                          <span className="tgm-points-max">/ {maxPoints}</span>
                          <button
                            className="tgm-points-btn tgm-points-btn--full"
                            onClick={() => handleFullPoints(question.id, maxPoints)}
                            title={`Pelna punktacja (${maxPoints})`}
                          >
                            Max
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Podsumowanie punktacji */}
              <div className="tgm-summary">
                <div className="tgm-summary-points">
                  <div className="tgm-summary-row">
                    <span>Zdobyte punkty:</span>
                    <strong>{earnedPoints} / {totalPossiblePoints}</strong>
                  </div>
                  <div className="tgm-summary-row">
                    <span>Procent:</span>
                    <strong>{calculatedScore}%</strong>
                  </div>
                  <div className="tgm-summary-row">
                    <span>Ocena:</span>
                    <strong className="tgm-grade-badge">{letterGrade}</strong>
                  </div>
                </div>

                {/* Progi oceniania */}
                {testDetails.grading_thresholds && (
                  <div className="tgm-thresholds">
                    <h5>Skala oceniania:</h5>
                    <div className="tgm-thresholds-list">
                      {Object.entries(testDetails.grading_thresholds)
                        .sort((a, b) => a[0] - b[0])
                        .map(([grade, threshold]) => (
                          <span key={grade} className="tgm-threshold-item">
                            <strong>{grade}</strong> {'>'}= {threshold}%
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Reczna edycja wyniku */}
                <div className="tgm-manual-score">
                  <label className="tgm-checkbox-label">
                    <input
                      type="checkbox"
                      checked={useManualScore}
                      onChange={e => setUseManualScore(e.target.checked)}
                    />
                    <span>Recznie ustaw wynik (nadpisz automatyczny)</span>
                  </label>
                  {useManualScore && (
                    <div className="tgm-manual-input">
                      <input
                        type="number"
                        className="tgm-input"
                        min="0"
                        max="100"
                        value={manualScore}
                        onChange={e => {
                          const val = parseInt(e.target.value) || 0
                          setManualScore(Math.min(100, Math.max(0, val)))
                        }}
                      />
                      <span>%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Przyciski akcji */}
              <div className="tgm-actions">
                <button
                  className="tgm-btn tgm-btn--secondary"
                  onClick={onClose}
                  disabled={saving}
                >
                  Anuluj
                </button>
                <button
                  className="tgm-btn tgm-btn--primary"
                  onClick={handleSaveGrade}
                  disabled={saving}
                >
                  {saving ? 'Zapisywanie...' : 'Zapisz ocene'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestGradingModal
