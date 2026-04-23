import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { toast } from 'react-toastify'
import './TestCreator.css'

const QUESTION_TYPES = {
  sql: {
    label: 'Zapytanie SQL',
    description: 'Uczeń musi napisać poprawne zapytanie SQL'
  },
  multiple_choice: {
    label: 'Wielokrotny wybór (A, B, C, D)',
    description: 'Uczeń wybiera jedną poprawną odpowiedź z podanych opcji'
  },
  true_false: {
    label: 'Prawda/Fałsz',
    description: 'Uczeń stwierdza czy zdanie jest prawdziwe czy fałszywe'
  }
}

// Komponent z pomocą/tooltipem
function HelpText({ children }) {
  return <span className="tc-help-text">({children})</span>
}

function TestCreator() {
  const navigate = useNavigate()

  const [testTitle, setTestTitle] = useState('')
  const [testDescription, setTestDescription] = useState('')

  // Progi oceniania (procent -> ocena)
  const [gradingThresholds, setGradingThresholds] = useState([
    { minPercent: 0, grade: '1' },
    { minPercent: 30, grade: '2' },
    { minPercent: 50, grade: '3' },
    { minPercent: 70, grade: '4' },
    { minPercent: 90, grade: '5' }
  ])

  const [questions, setQuestions] = useState([
    { id: 1, type: 'sql', title: '', description: '', expectedSql: '', options: [], correctAnswer: '', points: 2, skill: '' }
  ])
  const [saving, setSaving] = useState(false)

  const addQuestion = () => {
    const newId = Math.max(...questions.map(q => q.id), 0) + 1
    setQuestions([...questions, {
      id: newId,
      type: 'sql',
      title: '',
      description: '',
      expectedSql: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 2,
      skill: ''
    }])
  }

  const removeQuestion = (id) => {
    if (questions.length === 1) {
      toast.warning('Test musi mieć przynajmniej jedno pytanie.')
      return
    }
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id !== questionId) return q
      const newOptions = [...q.options]
      newOptions[optionIndex] = value
      return { ...q, options: newOptions }
    }))
  }

  const addOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id !== questionId) return q
      return { ...q, options: [...q.options, ''] }
    }))
  }

  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q => {
      if (q.id !== questionId) return q
      return { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
    }))
  }

  const updateThreshold = (index, field, value) => {
    const newThresholds = [...gradingThresholds]
    newThresholds[index][field] = value
    setGradingThresholds(newThresholds)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!testTitle.trim()) {
      toast.warning('Podaj tytuł testu.')
      return
    }

    // Walidacja pytań
    const validQuestions = questions.filter(q => {
      if (q.type === 'sql') {
        return q.title.trim() && q.expectedSql.trim()
      } else if (q.type === 'multiple_choice') {
        return q.title.trim() && q.options.filter(o => o.trim()).length >= 2
      } else if (q.type === 'true_false') {
        return q.title.trim()
      }
      return false
    })

    if (validQuestions.length === 0) {
      toast.warning('Test musi mieć przynajmniej jedno poprawnie wypełnione pytanie.')
      return
    }

    // Walidacja progów oceniania
    const validThresholds = gradingThresholds.filter(t => t.minPercent >= 0 && t.minPercent <= 100 && t.grade)
    if (validThresholds.length < 2) {
      toast.warning('Podaj przynajmniej dwa progi oceniania.')
      return
    }

    // Sortuj progi malejąco
    const sortedThresholds = [...validThresholds].sort((a, b) => b.minPercent - a.minPercent)

    setSaving(true)

    try {
      const { data: testData, error: testError } = await supabase
        .from('tests')
        .insert({
          title: testTitle,
          description: testDescription,
          questions: validQuestions,
          grading_thresholds: sortedThresholds,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single()

      if (testError) throw testError

      toast.success(`Test "${testTitle}" został utworzony z ${validQuestions.length} pytaniami!`)
      navigate('/panel-nauczyciela')
    } catch (err) {
      toast.error('Błąd tworzenia testu: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="tc-container">
      <div className="tc-header">
        <button onClick={() => navigate('/panel-nauczyciela')} className="tc-btn-back">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Wróć do panelu
        </button>
        <h1 className="tc-title">Kreator testów</h1>
      </div>

      <form onSubmit={handleSubmit} className="tc-content">
        {/* Sekcja informacji o teście */}
        <div className="tc-card tc-card--info">
          <h2 className="tc-card-title">Informacje o teście</h2>
          <div className="tc-form-group">
            <label className="tc-label">Tytuł testu *</label>
            <input
              type="text"
              className="tc-input"
              value={testTitle}
              onChange={e => setTestTitle(e.target.value)}
              placeholder="np. Test SQL - podstawy"
              required
            />
          </div>
          <div className="tc-form-group">
            <label className="tc-label">Opis testu</label>
            <textarea
              className="tc-input tc-textarea"
              value={testDescription}
              onChange={e => setTestDescription(e.target.value)}
              placeholder="Krótki opis tego, co sprawdza ten test..."
              rows={3}
            />
          </div>
        </div>

        {/* Sekcja progów oceniania */}
        <div className="tc-card tc-card--thresholds">
          <h2 className="tc-card-title">Progi oceniania <HelpText>jak działa?</HelpText></h2>
          <div className="tc-card-description">
            <p>Ustaw progi procentowe dla ocen. Przykład: jeśli ustawisz 30%-2, to uczeń otrzyma ocenę 2 gdy zdobędzie 30% lub więcej punktów.</p>
            <p>Progi są sortowane malejąco - najmniejszy procent daje najniższą ocenę.</p>
          </div>

          <div className="tc-thresholds-grid">
            {gradingThresholds.map((threshold, index) => (
              <div key={index} className="tc-threshold-row">
                <span className="tc-threshold-grade" title={`Ocena ${threshold.grade}`}>{threshold.grade}</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="tc-input tc-threshold-input"
                  value={threshold.minPercent}
                  onChange={e => updateThreshold(index, 'minPercent', Number(e.target.value))}
                  placeholder="%"
                  title="Minimalny procent punktów dla tej oceny"
                />
                <span className="tc-threshold-percent">%</span>
                <span className="tc-help-text">lub wiecej</span>
                {index === 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newThresholds = [...gradingThresholds]
                      newThresholds.push({ minPercent: '', grade: '' })
                      setGradingThresholds(newThresholds)
                    }}
                    className="tc-btn tc-btn--add-threshold"
                    title="Dodaj nowy próg"
                  >
                    +
                  </button>
                )}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => setGradingThresholds(gradingThresholds.filter((_, i) => i !== index))}
                    className="tc-btn tc-btn--remove-option"
                    title="Usuń ten próg"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sekcja pytań */}
        <div className="tc-questions-section">
          <div className="tc-questions-header">
            <h2 className="tc-section-title">Pytania ({questions.length})</h2>
            <button type="button" onClick={addQuestion} className="tc-btn tc-btn--add">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Dodaj pytanie
            </button>
          </div>

          {questions.map((question, index) => (
            <div key={question.id} className="tc-card tc-card--question">
              <div className="tc-question-header">
                <span className="tc-question-number">Pytanie {index + 1}</span>
                <div className="tc-question-type-select">
                  <select
                    className="tc-select-input"
                    value={question.type}
                    onChange={e => updateQuestion(question.id, 'type', e.target.value)}
                    title="Wybierz typ pytania"
                  >
                    {Object.entries(QUESTION_TYPES).map(([key, type]) => (
                      <option key={key} value={key}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <HelpText>{QUESTION_TYPES[question.type]?.description || ''}</HelpText>
                </div>
                <div className="tc-points-input">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="tc-input tc-points-field"
                    value={question.points}
                    onChange={e => updateQuestion(question.id, 'points', Number(e.target.value))}
                    placeholder="Pkt"
                    title="Ile punktów warte jest to pytanie"
                  />
                  <HelpText>punkty</HelpText>
                </div>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="tc-btn tc-btn--remove"
                    title="Usuń pytanie"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 18L18 6M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <div className="tc-form-group">
                <label className="tc-label">Treść pytania *</label>
                <textarea
                  className="tc-input tc-textarea"
                  value={question.title}
                  onChange={e => updateQuestion(question.id, 'title', e.target.value)}
                  placeholder="Opisz dokładnie czego dotyczy pytanie..."
                  rows={2}
                  required
                />
              </div>

              <div className="tc-form-group">
                <label className="tc-label">Dodatkowa instrukcja / opis</label>
                <textarea
                  className="tc-input tc-textarea"
                  value={question.description}
                  onChange={e => updateQuestion(question.id, 'description', e.target.value)}
                  placeholder="Dodatkowe informacje dla ucznia..."
                  rows={2}
                />
              </div>

              {/* SQL Question Type */}
              {question.type === 'sql' && (
                <>
                  <div className="tc-form-group">
                    <label className="tc-label">Wzorcowe zapytanie SQL *</label>
                    <textarea
                      className="tc-input tc-textarea tc-code-editor"
                      value={question.expectedSql}
                      onChange={e => updateQuestion(question.id, 'expectedSql', e.target.value)}
                      placeholder="SELECT * FROM customers WHERE country = 'Poland'"
                      rows={4}
                      spellCheck={false}
                      required
                    />
                  </div>
                  <div className="tc-form-group">
                    <label className="tc-label">Sprawdzana umiejętność SQL</label>
                    <input
                      type="text"
                      className="tc-input"
                      value={question.skill}
                      onChange={e => updateQuestion(question.id, 'skill', e.target.value)}
                      placeholder="np. SELECT, WHERE, JOIN, GROUP BY..."
                    />
                  </div>
                </>
              )}

              {/* Multiple Choice Question Type */}
              {question.type === 'multiple_choice' && (
                <>
                  <div className="tc-form-group">
                    <label className="tc-label">Opcje odpowiedzi (minimum 2)</label>
                    <div className="tc-options-list">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="tc-option-row">
                          <div className="tc-option-badge">
                            {String.fromCharCode(65 + optIndex)}
                          </div>
                          <input
                            type="text"
                            className="tc-input tc-option-input"
                            value={option}
                            onChange={e => updateOption(question.id, optIndex, e.target.value)}
                            placeholder={`Opcja ${String.fromCharCode(65 + optIndex)}`}
                          />
                          {question.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(question.id, optIndex)}
                              className="tc-btn tc-btn--remove-option"
                              title="Usuń opcję"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(question.id)}
                        className="tc-btn tc-btn--add-option"
                      >
                        + Dodaj opcję
                      </button>
                    </div>
                  </div>
                  <div className="tc-form-group">
                    <label className="tc-label">Poprawna odpowiedź (litera) *</label>
                    <select
                      className="tc-input tc-select"
                      value={question.correctAnswer}
                      onChange={e => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                      required
                    >
                      <option value="">Wybierz poprawną odpowiedź</option>
                      {question.options.map((_, optIndex) => (
                        <option key={optIndex} value={String.fromCharCode(65 + optIndex)}>
                          {String.fromCharCode(65 + optIndex)} - {question.options[optIndex] || '(puste)'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="tc-form-group">
                    <label className="tc-label">Sprawdzana umiejętność / temat</label>
                    <input
                      type="text"
                      className="tc-input"
                      value={question.skill}
                      onChange={e => updateQuestion(question.id, 'skill', e.target.value)}
                      placeholder="np. Tworzenie tabel, INSERT, podstawy..."
                    />
                  </div>
                </>
              )}

              {/* True/False Question Type */}
              {question.type === 'true_false' && (
                <>
                  <div className="tc-form-group">
                    <label className="tc-label">Poprawna odpowiedź *</label>
                    <div className="tc-tf-options">
                      <label className="tc-tf-option">
                        <input
                          type="radio"
                          name={`tf-${question.id}`}
                          value="true"
                          checked={question.correctAnswer === 'true'}
                          onChange={e => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                          required
                        />
                        <span>Prawda</span>
                      </label>
                      <label className="tc-tf-option">
                        <input
                          type="radio"
                          name={`tf-${question.id}`}
                          value="false"
                          checked={question.correctAnswer === 'false'}
                          onChange={e => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                          required
                        />
                        <span>Fałsz</span>
                      </label>
                    </div>
                  </div>
                  <div className="tc-form-group">
                    <label className="tc-label">Sprawdzana umiejętność / temat</label>
                    <input
                      type="text"
                      className="tc-input"
                      value={question.skill}
                      onChange={e => updateQuestion(question.id, 'skill', e.target.value)}
                      placeholder="np. Podstawy SQL, typy danych..."
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Przyciski akcji */}
        <div className="tc-actions">
          <button
            type="button"
            onClick={() => navigate('/panel-nauczyciela')}
            className="tc-btn tc-btn--secondary"
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="tc-btn tc-btn--primary"
            disabled={saving}
          >
            {saving ? 'Zapisywanie...' : 'Utwórz test'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TestCreator
