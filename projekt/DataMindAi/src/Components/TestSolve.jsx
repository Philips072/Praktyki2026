import './TestSolve.css'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'
import { toast } from 'react-toastify'

function TestSolve() {
  const { user } = useAuth()
  const { assignmentId } = useParams()
  const navigate = useNavigate()

  const [assignment, setAssignment] = useState(null)
  const [test, setTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  // Stan dla nawigacji między pytaniami
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { questionId: answer }
  const [questionScores, setQuestionScores] = useState({}) // { questionId: points }
  const [result, setResult] = useState(null)
  const [running, setRunning] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showGradedView, setShowGradedView] = useState(false)

  // Ładowanie danych
  useEffect(() => {
    fetchAssignment()
  }, [assignmentId, user])

  const fetchAssignment = async () => {
    if (!user?.id || !assignmentId) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          id,
          status,
          assigned_at,
          score,
          question_answers,
          question_scores,
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
        .eq('id', assignmentId)
        .eq('student_id', user.id)
        .single()

      if (error) throw error

      if (!data) {
        setError('Nie znaleziono przypisania testu.')
        setLoading(false)
        return
      }

      setAssignment(data)
      setTest(data.tests)

      // Pobierz pytania z testu
      const testQuestions = data.tests?.questions || []
      setQuestions(testQuestions)

      // Jeśli test jest już ukończony, załaduj odpowiedzi
      if (data.status === 'completed' || data.status === 'graded') {
        setSubmitted(true)
        if (data.question_answers) {
          const loadedAnswers = {}
          data.question_answers.forEach(qa => {
            loadedAnswers[qa.questionId] = qa.answer
          })
          setAnswers(loadedAnswers)
        }
        // Załaduj wyniki pytan
        if (data.question_scores) {
          const loadedScores = {}
          data.question_scores.forEach(qs => {
            loadedScores[qs.questionId] = qs.points
          })
          setQuestionScores(loadedScores)
        }
      } else if (data.question_answers) {
        // Jeśli są zapisane odpowiedzi ale test nieukończony, załaduj je
        const loadedAnswers = {}
        data.question_answers.forEach(qa => {
          loadedAnswers[qa.questionId] = qa.answer
        })
        setAnswers(loadedAnswers)
      }

      // Zaktualizuj status na in_progress jeśli jest pending
      if (data.status === 'pending') {
        await supabase
          .from('assignments')
          .update({ status: 'in_progress' })
          .eq('id', assignmentId)
      }

      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  // Autosave odpowiedzi
  const saveAnswer = async (questionId, answer, questionType) => {
    try {
      const newAnswers = { ...answers, [questionId]: answer }
      setAnswers(newAnswers)

      // Przygotuj question_answers do zapisu
      const questionAnswers = Object.entries(newAnswers).map(([qid, ans]) => {
        const question = questions.find(q => q.id === parseInt(qid))
        return {
          questionId: parseInt(qid),
          type: question?.type || questionType,
          answer: ans,
          savedAt: new Date().toISOString()
        }
      })

      await supabase
        .from('assignments')
        .update({ question_answers: questionAnswers })
        .eq('id', assignmentId)
    } catch (err) {
      console.error('Błąd autosave:', err)
    }
  }

  // Debounce dla autosave
  useEffect(() => {
    const timer = setTimeout(() => {
      if (answers && Object.keys(answers).length > 0 && !submitted) {
        const questionAnswers = Object.entries(answers).map(([qid, ans]) => {
          const question = questions.find(q => q.id === parseInt(qid))
          return {
            questionId: parseInt(qid),
            type: question?.type,
            answer: ans,
            savedAt: new Date().toISOString()
          }
        })

        supabase
          .from('assignments')
          .update({ question_answers: questionAnswers })
          .eq('id', assignmentId)
          .catch(err => console.error('Błąd autosave:', err))
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [answers, assignmentId, submitted, questions])

  const handleRunQuery = async () => {
    const currentQuestion = questions[currentQuestionIndex]
    const currentAnswer = answers[currentQuestion.id]

    if (!currentAnswer?.trim()) {
      toast.warning('Wpisz zapytanie SQL.')
      return
    }

    setRunning(true)
    setResult(null)

    try {
      // Tutaj powinno być wywołanie do backend API który wykonuje SQL
      // Na razie symulujemy wynik
      setTimeout(() => {
        setResult({
          success: true,
          rows: [
            { id: 1, name: 'Przykłowy wynik' },
            { id: 2, name: 'Drugi wiersz' }
          ],
          message: 'Zapytanie wykonane pomyślnie'
        })
        setRunning(false)
      }, 1000)
    } catch (err) {
      setResult({
        success: false,
        error: err.message || 'Błąd wykonania zapytania'
      })
      setRunning(false)
    }
  }

  const handleSubmit = async () => {
    // Sprawdź czy wszystkie pytania mają odpowiedzi
    const unansweredQuestions = questions.filter(q => !answers[q.id] || answers[q.id].trim() === '')
    if (unansweredQuestions.length > 0) {
      if (!confirm(`Masz ${unansweredQuestions.length} nieudzielonych odpowiedzi. Czy na pewno chcesz zakończyć test?`)) {
        return
      }
    }

    setSaving(true)

    try {
      // Zapisz końcowe odpowiedzi
      const questionAnswers = questions.map(q => ({
        questionId: q.id,
        type: q.type,
        answer: answers[q.id] || '',
        savedAt: new Date().toISOString()
      }))

      const { error } = await supabase
        .from('assignments')
        .update({
          status: 'completed',
          question_answers: questionAnswers
        })
        .eq('id', assignmentId)

      if (error) throw error

      setSubmitted(true)
      toast.success('Test został przesłany! Oczekuj na ocenę.')
    } catch (err) {
      toast.error('Błąd przesyłania testu: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setResult(null)
    }
  }

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setResult(null)
    }
  }

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index)
    setResult(null)
  }

  // Obsługa klawiszy nawigacji
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (submitted) return

      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (questions[currentQuestionIndex]?.type === 'sql') {
          handleRunQuery()
        }
      }

      if (e.altKey) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          goToPrevious()
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          goToNext()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentQuestionIndex, submitted, questions])

  if (loading) {
    return (
      <div className="test-solve-page">
        <div className="test-solve-loading">
          <div className="spinner"></div>
          <p>Ładowanie testu...</p>
        </div>
      </div>
    )
  }

  if (error || !test) {
    return (
      <div className="test-solve-page">
        <div className="test-solve-error">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" />
          </svg>
          <h2>{error || 'Nie znaleziono testu'}</h2>
          <button onClick={() => navigate('/testy')} className="btn-secondary">
            Wróć do listy testów
          </button>
        </div>
      </div>
    )
  }

  if (submitted) {
    const hasScore = assignment?.score !== null && assignment?.score !== undefined
    const isGraded = assignment?.status === 'graded'

    // Oblicz ocene literowa
    const calculateLetterGrade = (score) => {
      if (!test?.grading_thresholds) return '---'
      const entries = Object.entries(test.grading_thresholds)
        .map(([grade, minPercent]) => ({ grade: String(grade), minPercent: Number(minPercent) }))
        .sort((a, b) => b.minPercent - a.minPercent)
      for (const t of entries) {
        if (score >= t.minPercent) return t.grade
      }
      return '1'
    }

    const letterGrade = hasScore ? calculateLetterGrade(assignment.score) : '---'

    return (
      <div className="test-solve-page">
        {showGradedView ? (
          <div className="test-graded-view">
            <header className="test-graded-header">
              <button onClick={() => setShowGradedView(false)} className="btn-back">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 12H5M12 19l-7-7 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Wróć
              </button>
              <h2>{test.title}</h2>
              {isGraded && <span className="graded-badge">GRADED</span>}
            </header>

            <div className="test-graded-content">
              <div className="test-graded-summary">
                <div className="graded-score-card">
                  <span className="graded-score-label">Twój wynik</span>
                  <span className="graded-score-value">{hasScore ? assignment.score : '--'}%</span>
                  {hasScore && (
                    <>
                      <span className="graded-grade-badge">{letterGrade}</span>
                      <span className="graded-status-text">Oceniono przez nauczyciela</span>
                    </>
                  )}
                </div>
              </div>

              <div className="graded-questions-list">
                {questions.map((question, idx) => {
                  const answer = answers[question.id]
                  const score = questionScores[question.id]
                  const maxPoints = question.points || 2
                  const isFullScore = score === maxPoints

                  return (
                    <div key={question.id} className="graded-question-card">
                      <div className="graded-question-header">
                        <span className="graded-question-number">Pytanie {idx + 1}</span>
                        {isGraded && score !== undefined && (
                          <span className={`graded-points-badge ${isFullScore ? 'full' : 'partial'}`}>
                            {score} / {maxPoints} pkt
                          </span>
                        )}
                      </div>

                      <h3 className="graded-question-title">{question.title}</h3>

                      {question.description && (
                        <p className="graded-question-desc">{question.description}</p>
                      )}

                      <div className="graded-answer-section">
                        <label className="graded-answer-label">Twoja odpowiedź:</label>
                        {question.type === 'sql' ? (
                          <div className="graded-code-block">
                            <code>{answer || 'Brak odpowiedzi'}</code>
                          </div>
                        ) : question.type === 'multiple_choice' ? (
                          <div className="graded-choice-answer">
                            <span>Wybrano: <strong>{answer || '-'}</strong></span>
                          </div>
                        ) : (
                          <div className="graded-choice-answer">
                            <span>Wybrano: <strong>{answer === 'true' ? 'Prawda' : answer === 'false' ? 'Fałsz' : '-'}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="test-solve-completed">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M9 12l3 3 5-6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            {isGraded && <span className="completion-graded-badge">GRADED</span>}
            <h1>{hasScore ? 'Twój wynik' : 'Test ukończony!'} {hasScore && '🎉'}</h1>

            {hasScore ? (
              <>
                <div className="test-solve-score">
                  <span className="test-solve-score-value">{assignment.score}</span>
                  <span className="test-solve-score-label">%</span>
                </div>
                <div className="test-solve-grade-badge">{letterGrade}</div>
                <p>Oceniono przez nauczyciela</p>
                <button onClick={() => setShowGradedView(true)} className="btn-primary btn-view-answers">
                  Zobacz swoje odpowiedzi
                </button>
              </>
            ) : (
              <>
                <p>Odpowiedzi zostały przesłane.</p>
                <p>Oczekuj na ocenę nauczyciela.</p>
              </>
            )}
            <button onClick={() => navigate('/testy')} className="btn-secondary">
              Wróć do listy testów
            </button>
          </div>
        )}
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = answers[currentQuestion?.id] || ''

  // Oblicz postęp
  const answeredCount = Object.keys(answers).filter(key => answers[key]?.trim()).length
  const progress = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0

  return (
    <div className="test-solve-page">
      <header className="test-solve-header">
        <button onClick={() => navigate('/testy')} className="btn-back">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Wróć
        </button>
        <div className="test-solve-status">
          <span className="status-indicator status-active"></span>
          <span>W trakcie rozwiązywania</span>
          <span className="hint">•</span>
          <span className="hint">Pytanie {currentQuestionIndex + 1} z {questions.length}</span>
        </div>
        <div className="test-progress">
          <span className="progress-text">{progress}%</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </header>

      <div className="test-solve-content">
        {/* Lista pytań */}
        <div className="test-questions-nav">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id]?.trim()
            const isActive = idx === currentQuestionIndex
            return (
              <button
                key={q.id}
                className={`question-dot ${isActive ? 'active' : ''} ${isAnswered ? 'answered' : ''}`}
                onClick={() => goToQuestion(idx)}
                title={`Pytanie ${idx + 1}${isAnswered ? ' - odpowiedziano' : ' - bez odpowiedzi'}`}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>

        {/* Karta pytania */}
        <div className="test-question-card">
          <div className="question-header">
            <span className="question-number">Pytanie {currentQuestionIndex + 1}</span>
            <span className="question-points">{currentQuestion.points || 2} pkt</span>
            {currentQuestion.skill && (
              <span className="question-skill">{currentQuestion.skill}</span>
            )}
          </div>

          <h2 className="question-title">{currentQuestion.title}</h2>

          {currentQuestion.description && (
            <div className="question-description">
              <p>{currentQuestion.description}</p>
            </div>
          )}

          {/* SQL Question */}
          {currentQuestion.type === 'sql' && (
            <div className="sql-editor-card">
              <div className="sql-editor-header">
                <h3>Edytor SQL</h3>
                <button onClick={handleRunQuery} className="btn-run" disabled={running}>
                  {running ? (
                    <>
                      <div className="spinner-small"></div>
                      Uruchamianie...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M14.7 6.3a1 1 0 0 0 0 1.4l-1.6 1.6a1 1 0 0 0-1.4 0l-1.6-1.6a1 1 0 0 0-1.4 1.4l1.6 1.6a1 1 0 0 0 1.4 0l1.6-1.6a1 1 0 0 0 0-1.4z"
                          fill="currentColor"
                        />
                      </svg>
                      Uruchom
                    </>
                  )}
                </button>
              </div>

              <textarea
                className="sql-editor"
                value={currentAnswer}
                onChange={e => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                placeholder="Wpisz zapytanie SQL tutaj..."
                spellCheck={false}
              />

              <div className="sql-editor-footer">
                <span className="hint">Naciśnij Ctrl+Enter aby uruchomić</span>
                <span className="hint">{currentAnswer.trim() ? '✓ Zapisano' : ''}</span>
              </div>
            </div>
          )}

          {/* Multiple Choice Question */}
          {currentQuestion.type === 'multiple_choice' && (
            <div className="multiple-choice-card">
              {currentQuestion.options?.map((option, idx) => (
                <label
                  key={idx}
                  className={`mc-option ${currentAnswer === String.fromCharCode(65 + idx) ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={String.fromCharCode(65 + idx)}
                    checked={currentAnswer === String.fromCharCode(65 + idx)}
                    onChange={e => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                  />
                  <span className="mc-option-badge">{String.fromCharCode(65 + idx)}</span>
                  <span className="mc-option-text">{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* True/False Question */}
          {currentQuestion.type === 'true_false' && (
            <div className="true-false-card">
              <label className={`tf-option ${currentAnswer === 'true' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value="true"
                  checked={currentAnswer === 'true'}
                  onChange={e => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                />
                <span className="tf-option-badge">✓</span>
                <span>Prawda</span>
              </label>
              <label className={`tf-option ${currentAnswer === 'false' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value="false"
                  checked={currentAnswer === 'false'}
                  onChange={e => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                />
                <span className="tf-option-badge">✗</span>
                <span>Fałsz</span>
              </label>
            </div>
          )}

          {/* Wynik zapytania SQL */}
          {result && currentQuestion.type === 'sql' && (
            <div className={`result-panel ${result.success ? 'result-success' : 'result-error'}`}>
              <h4>
                {result.success ? '📊 Wynik' : '❌ Błąd'}
              </h4>
              {result.success && result.rows && (
                <table className="result-table">
                  <thead>
                    <tr>
                      {Object.keys(result.rows[0] || {}).map(key => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((value, i) => (
                          <td key={i}>{String(value)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {result.message && <p>{result.message}</p>}
              {result.error && <p className="error-message">{result.error}</p>}
            </div>
          )}

          {/* Nawigacja */}
          <div className="question-navigation">
            <button
              className="nav-btn nav-btn--prev"
              onClick={goToPrevious}
              disabled={currentQuestionIndex === 0}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Poprzednie
            </button>
            <button
              className="nav-btn nav-btn--next"
              onClick={goToNext}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Następne
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Sekcja przesyłania */}
        <div className="submit-section">
          <button onClick={handleSubmit} className="btn-submit" disabled={saving}>
            {saving ? 'Przesyłanie...' : 'Zakończ i prześlij test'}
          </button>
          <p className="submit-hint">
            Przesyłając test zatwierdzasz wszystkie odpowiedzi. Nie będzie możliwości edycji po przesłaniu.
          </p>
          <p className="submit-hint hint">Skróty klawiszowe: Alt+← Poprzednie pytanie, Alt+→ Następne pytanie</p>
        </div>
      </div>
    </div>
  )
}

export default TestSolve