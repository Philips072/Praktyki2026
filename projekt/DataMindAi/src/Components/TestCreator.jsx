import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'
import { toast } from 'react-toastify'
import './TestCreator.css'

const QUESTION_TYPES = {
  sql: {
    label: 'Zapytanie SQL',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
        <path d="M3 3h18M3 9h18M3 15h18M3 21h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  multiple_choice: {
    label: 'Wielokrotny wybór',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
        <path d="M9 11l3 3L22 4M9 11a2 2 0 012 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2v-9a2 2 0 012-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  true_false: {
    label: 'Prawda/Fałsz',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
        <path d="M8.5 14.5L10.5 16.5L15.5 11.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
}

const SKILL_OPTIONS = [
  'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'JOIN', 'GROUP BY', 'ORDER BY',
  'DISTINCT', 'TOP/LIMIT', 'UNION', 'SUBQUERY', 'VIEW', 'INDEX', 'TRIGGER',
  'PROCEDURE', 'FUNCTION', 'TRANSACTION', 'DDL', 'ADMIN', 'SECURITY'
]

function TestCreator() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [testTitle, setTestTitle] = useState('')
  const [testDescription, setTestDescription] = useState('')
  const [skill, setSkill] = useState('')
  const [expectedSql, setExpectedSql] = useState('')

  const [questions, setQuestions] = useState([
    { id: 1, type: 'sql', title: '', expectedSql: '', options: ['', '', '', ''], correctAnswer: '', points: 2, autoCheck: false }
  ])

  const [currentQuestionId, setCurrentQuestionId] = useState(1)
  const [saving, setSaving] = useState(false)

  const [gradingThresholds, setGradingThresholds] = useState({
    1: 0,
    2: 30,
    3: 50,
    4: 75,
    5: 90,
    6: 100
  })

  const currentQuestion = questions.find(q => q.id === currentQuestionId) || questions[0]
  const currentQuestionIndex = questions.findIndex(q => q.id === currentQuestionId)

  const addQuestion = () => {
    const newId = Math.max(...questions.map(q => q.id), 0) + 1
    const newQuestion = {
      id: newId,
      type: 'sql',
      title: '',
      expectedSql: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 2,
      autoCheck: false
    }
    setQuestions([...questions, newQuestion])
    setCurrentQuestionId(newId)
  }

  const deleteQuestion = (id) => {
    if (questions.length <= 1) {
      toast.error('Test musi mieć przynajmniej jedno pytanie')
      return
    }
    const newQuestions = questions.filter(q => q.id !== id)
    setQuestions(newQuestions)
    if (currentQuestionId === id) {
      setCurrentQuestionId(newQuestions[0].id)
    }
  }

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options]
        newOptions[optionIndex] = value
        return { ...q, options: newOptions }
      }
      return q
    }))
  }

  const addOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: [...q.options, ''] }
      }
      return q
    }))
  }

  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options.length > 2) {
        const newOptions = q.options.filter((_, i) => i !== optionIndex)
        return { ...q, options: newOptions }
      }
      return q
    }))
  }

  const updateThreshold = (grade, value) => {
    setGradingThresholds({ ...gradingThresholds, [grade]: Number(value) })
  }

  const validateForm = () => {
    if (!testTitle.trim()) {
      toast.error('Podaj tytuł testu')
      return false
    }

    for (const q of questions) {
      if (!q.title.trim()) {
        toast.error(`Pytanie ${questions.indexOf(q) + 1}: podaj treść pytania`)
        return false
      }

      if (q.type === 'sql' && !q.expectedSql.trim()) {
        toast.error(`Pytanie ${questions.indexOf(q) + 1}: podaj oczekiwane zapytanie SQL`)
        return false
      }

      if (q.type === 'multiple_choice') {
        const validOptions = q.options.filter(o => o.trim())
        if (validOptions.length < 2) {
          toast.error(`Pytanie ${questions.indexOf(q) + 1}: podaj przynajmniej 2 opcje odpowiedzi`)
          return false
        }
        if (!q.correctAnswer) {
          toast.error(`Pytanie ${questions.indexOf(q) + 1}: wskaż poprawną odpowiedź`)
          return false
        }
      }

      if (q.type === 'true_false' && !q.correctAnswer) {
        toast.error(`Pytanie ${questions.indexOf(q) + 1}: wskaż czy zdanie jest prawdziwe czy fałszywe`)
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setSaving(true)

    try {
      if (!user?.id) {
        throw new Error('Nie jesteś zalogowany')
      }

      const questionsToSave = questions.map(q => ({
        id: q.id,
        type: q.type,
        title: q.title,
        expectedSql: q.type === 'sql' ? q.expectedSql : undefined,
        options: q.type === 'multiple_choice' ? q.options.filter(o => o.trim()) : undefined,
        correctAnswer: q.correctAnswer,
        points: q.points,
        autoCheck: q.autoCheck
      }))

      const { error: testError } = await supabase
        .from('tests')
        .insert({
          title: testTitle,
          description: testDescription,
          skill: skill,
          expected_sql: questionsToSave.some(q => q.type === 'sql') ? expectedSql : null,
          questions: questionsToSave,
          grading_thresholds: gradingThresholds,
          created_by: user.id,
          created_at: new Date().toISOString()
        })

      if (testError) throw testError

      toast.success('Test utworzony pomyślnie!')
      navigate('/panel-nauczyciela')
    } catch (error) {
      console.error('Błąd podczas tworzenia testu:', error)
      toast.error(error.message || 'Nie udało się utworzyć testu')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="tc-container">
      <header className="tc-header">
        <button onClick={() => navigate('/panel-nauczyciela')} className="tc-btn-back">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Wróć
        </button>
        <h1 className="tc-title">Kreator testów</h1>
      </header>

      <div className="tc-layout">
        {/* Left Panel - Questions List */}
        <aside className="tc-left-panel">
          <div className="tc-sidebar-header">
            <h2 className="tc-sidebar-title">Pytania</h2>
            <button type="button" onClick={addQuestion} className="tc-btn-add-plus" title="Dodaj pytanie">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="tc-sidebar-questions">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className={`tc-sidebar-question ${question.id === currentQuestionId ? 'active' : ''}`}
                onClick={() => setCurrentQuestionId(question.id)}
              >
                <span className="tc-sidebar-question-number">{index + 1}</span>
                <div className="tc-sidebar-question-preview">
                  <span className="tc-sidebar-question-type">
                    {QUESTION_TYPES[question.type].label}
                  </span>
                  {question.title || 'Brak treści...'}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="tc-main">
          <form onSubmit={handleSubmit} className="tc-question-content">
            <div className="tc-question-card">
              <div className="tc-question-header">
                <div className="tc-question-meta">
                  <h3 className="tc-question-number">Pytanie {currentQuestionIndex + 1}</h3>
                  <select
                    className="tc-type-select"
                    value={currentQuestion.type}
                    onChange={e => updateQuestion(currentQuestion.id, 'type', e.target.value)}
                  >
                    {Object.entries(QUESTION_TYPES).map(([value, { label }]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <div className="tc-points-wrapper">
                    <label className="tc-label-mini">Punkty</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      className="tc-points-input"
                      value={currentQuestion.points}
                      onChange={e => updateQuestion(currentQuestion.id, 'points', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="tc-question-actions">
                  <label className="tc-auto-check-wrapper" title="Zaznacz, aby automatycznie sprawdzać odpowiedź">
                    <input
                      type="checkbox"
                      className="tc-auto-check"
                      checked={currentQuestion.autoCheck}
                      onChange={e => updateQuestion(currentQuestion.id, 'autoCheck', e.target.checked)}
                    />
                    <span className="tc-auto-check-custom">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="tc-auto-check-label">Auto-sprawdzanie</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => deleteQuestion(currentQuestion.id)}
                    className="tc-btn-delete"
                    title="Usuń pytanie"
                  >
                    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Question Title */}
              <div className="tc-form-group">
                <label className="tc-label-mini">Treść pytania:</label>
                <textarea
                  className="tc-input tc-textarea"
                  value={currentQuestion.title}
                  onChange={e => updateQuestion(currentQuestion.id, 'title', e.target.value)}
                  placeholder="Wpisz treść pytania..."
                  rows={3}
                />
              </div>

              {/* SQL Question Type */}
              {currentQuestion.type === 'sql' && (
                <div className="tc-form-group">
                  <label className="tc-label-mini">Oczekiwane zapytanie SQL:</label>
                  <textarea
                    className="tc-input tc-code-editor"
                    value={currentQuestion.expectedSql}
                    onChange={e => updateQuestion(currentQuestion.id, 'expectedSql', e.target.value)}
                    placeholder="SELECT * FROM users WHERE ..."
                    rows={4}
                  />
                </div>
              )}

              {/* Multiple Choice Question Type */}
              {currentQuestion.type === 'multiple_choice' && (
                <div className="tc-form-group">
                  <label className="tc-label-mini">Opcje odpowiedzi:</label>
                  <div className="tc-options-list">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="tc-option-row">
                        <span className="tc-option-badge">{String.fromCharCode(65 + index)}</span>
                        <input
                          type="text"
                          className="tc-input tc-option-input"
                          value={option}
                          onChange={e => updateOption(currentQuestion.id, index, e.target.value)}
                          placeholder={`Opcja ${String.fromCharCode(65 + index)}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(currentQuestion.id, index)}
                          className="tc-btn-remove-option"
                          title="Usuń opcję"
                          disabled={currentQuestion.options.length <= 2}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {currentQuestion.options.length < 6 && (
                      <button
                        type="button"
                        onClick={() => addOption(currentQuestion.id)}
                        className="tc-btn-add-option"
                      >
                        + Dodaj opcję
                      </button>
                    )}
                  </div>

                  {/* Correct Answer */}
                  <div className="tc-correct-answer">
                    <label className="tc-label-mini">Poprawna odpowiedź:</label>
                    <select
                      className="tc-input tc-select-mini"
                      value={currentQuestion.correctAnswer}
                      onChange={e => updateQuestion(currentQuestion.id, 'correctAnswer', e.target.value)}
                    >
                      <option value="">Wybierz...</option>
                      {currentQuestion.options.map((option, index) => (
                        option.trim() && (
                          <option key={index} value={String.fromCharCode(65 + index)}>
                            {String.fromCharCode(65 + index)} - {option}
                          </option>
                        )
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* True/False Question Type */}
              {currentQuestion.type === 'true_false' && (
                <div className="tc-form-group">
                  <label className="tc-label-mini">Poprawna odpowiedź:</label>
                  <div className="tc-tf-container">
                    <label className={`tc-tf-option ${currentQuestion.correctAnswer === 'true' ? 'tc-tf-option--selected' : ''}`}>
                      <input
                        type="radio"
                        name={`tf-${currentQuestion.id}`}
                        checked={currentQuestion.correctAnswer === 'true'}
                        onChange={() => updateQuestion(currentQuestion.id, 'correctAnswer', 'true')}
                      />
                      <span className="tc-tf-option-label">Prawda</span>
                    </label>
                    <label className={`tc-tf-option ${currentQuestion.correctAnswer === 'false' ? 'tc-tf-option--selected' : ''}`}>
                      <input
                        type="radio"
                        name={`tf-${currentQuestion.id}`}
                        checked={currentQuestion.correctAnswer === 'false'}
                        onChange={() => updateQuestion(currentQuestion.id, 'correctAnswer', 'false')}
                      />
                      <span className="tc-tf-option-label">Fałsz</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Question Navigation */}
              <div className="tc-question-nav">
                {currentQuestionIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionId(questions[currentQuestionIndex - 1].id)}
                    className="tc-btn tc-btn--secondary"
                  >
                    ← Poprzednie
                  </button>
                )}
                {currentQuestionIndex < questions.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionId(questions[currentQuestionIndex + 1].id)}
                    className="tc-btn tc-btn--secondary"
                  >
                    Następne →
                  </button>
                )}
              </div>
            </div>
          </form>
        </main>

        {/* Right Panel - Test Settings */}
        <aside className="tc-right-panel">
          <div className="tc-right-top">
            {/* Test Title */}
            <div className="tc-card--compact">
              <h4 className="tc-card-title-compact">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Podstawowe informacje
              </h4>
              <div className="tc-form-group">
                <label className="tc-label-mini">Tytuł testu:</label>
                <input
                  type="text"
                  className="tc-input"
                  value={testTitle}
                  onChange={e => setTestTitle(e.target.value)}
                  placeholder="np. Test z SQL - podstawy"
                />
              </div>
              <div className="tc-form-group">
                <label className="tc-label-mini">Opis:</label>
                <textarea
                  className="tc-input"
                  value={testDescription}
                  onChange={e => setTestDescription(e.target.value)}
                  placeholder="Opis testu (opcjonalny)"
                  rows={2}
                />
              </div>
              <div className="tc-form-group">
                <label className="tc-label-mini">Umiejętność:</label>
                <select
                  className="tc-input"
                  value={skill}
                  onChange={e => setSkill(e.target.value)}
                >
                  <option value="">Wybierz umiejętność...</option>
                  {SKILL_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {questions.some(q => q.type === 'sql') && (
                <div className="tc-form-group">
                  <label className="tc-label-mini">Oczekiwane SQL (dla oceny automatycznej):</label>
                  <textarea
                    className="tc-input tc-code-editor"
                    value={expectedSql}
                    onChange={e => setExpectedSql(e.target.value)}
                    placeholder="SELECT * FROM ..."
                    rows={3}
                  />
                </div>
              )}
            </div>

            {/* Grading Thresholds */}
            <div className="tc-card--compact">
              <h4 className="tc-card-title-compact">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Progi oceniania
              </h4>
              <div className="tc-thresholds-grid">
                {Object.entries(gradingThresholds).map(([grade, threshold]) => (
                  <div key={grade} className="tc-threshold-item-compact">
                    <span className="tc-threshold-grade">{grade}</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="tc-threshold-input-compact"
                      value={threshold}
                      onChange={e => updateThreshold(grade, e.target.value)}
                    />
                    <span className="tc-threshold-percent">%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={saving}
              className="tc-btn tc-btn--primary tc-btn-submit"
            >
              {saving ? 'Zapisywanie...' : 'Utwórz test'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default TestCreator
