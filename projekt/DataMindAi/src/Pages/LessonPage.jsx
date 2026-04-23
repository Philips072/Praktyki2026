import './LessonPage.css'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LESSONS from '../data/lessonsData'
import { useAuth } from '../AuthContext'
import { executeSQL, validateExercise } from '../api.js'

const getUserId = () => {
  const userStr = localStorage.getItem('user')
  if (!userStr) return 'guest'
  try {
    const user = JSON.parse(userStr)
    return user.id || 'guest'
  } catch {
    return 'guest'
  }
}

function highlightSQL(code) {
  const parts = []
  let i = 0
  let current = ''

  while (i < code.length) {
    if (code[i] === '/' && code[i + 1] === '*') {
      if (current) parts.push(<span key={parts.length}>{current}</span>)
      current = ''
      const end = code.indexOf('*/', i + 2)
      const comment = end === -1 ? code.slice(i) : code.slice(i, end + 2)
      parts.push(<span key={parts.length} className="ls-code-comment">{comment}</span>)
      i = end === -1 ? code.length : end + 2
    } else if (code[i] === '-' && code[i + 1] === '-') {
      if (current) parts.push(<span key={parts.length}>{current}</span>)
      current = ''
      const end = code.indexOf('\n', i)
      const comment = end === -1 ? code.slice(i) : code.slice(i, end)
      parts.push(<span key={parts.length} className="ls-code-comment">{comment}</span>)
      i = end === -1 ? code.length : end
    } else {
      current += code[i]
      i++
    }
  }
  if (current) parts.push(<span key={parts.length}>{current}</span>)
  return parts
}

const LEVEL_LABELS = {
  beginner: 'Początkujący',
  intermediate: 'Średniozaawansowany',
  advanced: 'Zaawansowany',
}

// ── Sekcje teorii ───────────────────────────────────────

function TheorySection({ section }) {
  switch (section.type) {
    case 'heading':
      return <h3 className="ls-theory-heading">{section.content}</h3>

    case 'text':
      return <p className="ls-theory-text">{section.content}</p>

    case 'code':
      return (
        <div className="ls-code-block">
          {section.label && <p className="ls-code-label">{section.label}</p>}
          <pre><code>{highlightSQL(section.content)}</code></pre>
        </div>
      )

    case 'table':
      return (
        <div className="ls-example-table-wrap">
          {section.label && <p className="ls-table-label">{section.label}</p>}
          <div className="ls-table-scroll">
            <table className="ls-example-table">
              <thead>
                <tr>
                  {section.columns.map(c => <th key={c}>{c}</th>)}
                  {section.rows[0]?.length > section.columns.length && <th key="extra">Przykład</th>}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, i) => (
                  <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )

    case 'hint':
      return (
        <div className="ls-hint">
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16" style={{ flexShrink: 0 }}>
            <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M9 21h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <div>
            <strong>Wskazówka:</strong> {section.content}
          </div>
        </div>
      )

    default:
      return null
  }
}

// ── Ćwiczenie ───────────────────────────────────────────

function Exercise({ exercise, db, isCompleted, onComplete, onReset, isLastExercise, onNextExercise }) {
  const [query, setQuery] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = () => {
    setQuery('')
    setResult(null)
    setError('')
    onReset()
  }

  const handleSubmit = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError('')

    try {
      const userId = getUserId()
      console.log('=== handleSubmit ===')
      console.log('db:', db)
      console.log('lessonId:', db?.lessonId)
      console.log('userId:', userId)
      console.log('query:', query)
      console.log('Sending to API:', { userId, lessonId: db?.lessonId, sql: query })

      const sqlResult = await executeSQL(userId, db.lessonId, query)

      console.log('SQL result:', sqlResult)

      if (!sqlResult.success) {
        setError(sqlResult.message)
        setResult(null)
        setLoading(false)
        return
      }

      setResult(sqlResult)

      const validateOnly = exercise.validateOnly || false
      const validation = await validateExercise(exercise.task, query, sqlResult.data, validateOnly)

      console.log('AI validation:', validation)

      if (validation.valid) {
        onComplete()
      } else {
        setError(`Zadanie wykonane błędnie: ${validation.reason}`)
      }
    } catch (e) {
      console.error('Error:', e)
      setError(`Błąd: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`ls-exercise${isCompleted ? ' ls-exercise--done' : ''}`}>
      <div className="ls-exercise-task">
        <p className="ls-exercise-task-label">Zadanie:</p>
        <p className="ls-exercise-task-text">{exercise.task}</p>
      </div>

      <p className="ls-sql-label">Twoje zapytanie SQL:</p>
      <textarea
        className="ls-sql-editor"
        placeholder=""
        value={query}
        onChange={e => setQuery(e.target.value)}
        spellCheck={false}
        disabled={loading}
      />

      {error && (
        <div className="ls-error-message">
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" fill="rgba(239, 68, 68, 0.15)"/>
            <path d="M12 8v4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1" fill="#ef4444"/>
          </svg>
          {error}
        </div>
      )}

      <div className="ls-exercise-actions">
        <button
          className={`ls-btn${isCompleted && !isLastExercise ? ' ls-btn--next' : isCompleted ? ' ls-btn--done' : ' ls-btn--check'}`}
          onClick={isCompleted && !isLastExercise ? onNextExercise : handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>Sprawdzanie...</>
          ) : isCompleted && !isLastExercise ? (
            <>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Następne zadanie
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {isCompleted ? 'Ukończone' : 'Sprawdź odpowiedź'}
            </>
          )}
        </button>
        <button
          className="ls-btn ls-btn--hint"
          onClick={() => setShowHint(p => !p)}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M12 8v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="0.8" fill="currentColor"/>
          </svg>
          Podpowiedź
        </button>
        {isCompleted && (
          <button
            className="ls-btn ls-btn--reset"
            onClick={handleReset}
            title="Resetuj zadanie"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Reset
          </button>
        )}
      </div>

      {showHint && (
        <div className="ls-hint-box">
          {exercise.hint}
        </div>
      )}

      {result && result.data && result.data.length > 0 && (
        <div className="ls-result">
          <p className="ls-result-label">Wynik zapytania:</p>
          <div className="ls-table-scroll">
            <table className="ls-example-table">
              <thead>
                <tr>{result.data[0].columns.map(c => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {result.data[0].rows.map((row, i) => (
                  <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result && (!result.data || result.data.length === 0) && (
        <div className="ls-result ls-result--empty">
          <p>Zapytanie wykonane pomyślnie. Zmodyfikowano {result.affectedRows} wierszy.</p>
        </div>
      )}

      {exercise.expectedColumns.length > 0 && (
        <div className="ls-expected">
          <p className="ls-expected-label">Oczekiwany wynik:</p>
          <div className="ls-table-scroll">
            <table className="ls-example-table">
              <thead>
                <tr>{exercise.expectedColumns.map(c => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {exercise.expectedRows.map((row, i) => (
                  <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Główna strona lekcji ────────────────────────────────

function LessonPage() {
  const { id } = useParams()
  const { user, getUserDatabase } = useAuth()
  const navigate = useNavigate()
  const [activeExercise, setActiveExercise] = useState(0)
  const [exercisesOpen, setExercisesOpen] = useState(true)
  const [db, setDb] = useState(null)
  const [dbLoading, setDbLoading] = useState(true)
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900

  const lesson = LESSONS.find(l => l.id === Number(id))

  useEffect(() => {
    const loadDb = async () => {
      if (user && lesson) {
        setDbLoading(true)
        try {
          const database = await getUserDatabase(lesson.id)
          console.log('=== Database loaded ===')
          console.log('Database:', database)
          console.log('Lesson ID:', lesson.id)
          setDb(database)
        } catch (e) {
          console.error('Błąd ładowania bazy danych:', e)
        } finally {
          setDbLoading(false)
        }
      }
    }
    loadDb()
  }, [user, lesson, getUserDatabase])

  const progressKey = `lesson_progress_${user?.id}`

  const [completed, setCompleted] = useState(() => {
    if (!lesson || !user) return new Set()
    const data = JSON.parse(localStorage.getItem(progressKey) || '{}')
    return new Set(data[lesson.id] || [])
  })

  function markComplete(exerciseId) {
    setCompleted(prev => {
      if (prev.has(exerciseId)) return prev
      const next = new Set(prev)
      next.add(exerciseId)
      const data = JSON.parse(localStorage.getItem(progressKey) || '{}')
      data[lesson.id] = [...next]
      localStorage.setItem(progressKey, JSON.stringify(data))
      return next
    })
  }

  function resetExercise(exerciseId) {
    setCompleted(prev => {
      if (!prev.has(exerciseId)) return prev
      const next = new Set(prev)
      next.delete(exerciseId)
      const data = JSON.parse(localStorage.getItem(progressKey) || '{}')
      data[lesson.id] = [...next]
      localStorage.setItem(progressKey, JSON.stringify(data))
      return next
    })
  }

  if (!lesson) {
    return (
      <div className="ls-not-found">
        <p>Nie znaleziono lekcji.</p>
        <button onClick={() => navigate('/lekcje')}>Wróć do lekcji</button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="ls-not-found">
        <p>Musisz być zalogowany, aby rozwiązywać zadania.</p>
        <button onClick={() => navigate('/logowanie')}>Zaloguj się</button>
      </div>
    )
  }

  if (dbLoading) {
    return (
      <div className="ls-loading">
        <p>Ładowanie bazy danych...</p>
      </div>
    )
  }

  if (!db) {
    return (
      <div className="ls-not-found">
        <p>Nie udało się załadować bazy danych.</p>
        <button onClick={() => navigate('/lekcje')}>Wróć do lekcji</button>
      </div>
    )
  }

  const completedCount = completed.size

  const currentExerciseId = lesson?.exercises?.[activeExercise]?.id

  const handleNextExercise = () => {
    if (activeExercise < lesson.exercises.length - 1) {
      setActiveExercise(activeExercise + 1)
    }
  }

  return (
    <div className="ls-page">

      {/* ── Header ── */}
      <header className="ls-header">
        <div className="ls-header-left">
          <button className="ls-back-btn" onClick={() => navigate('/lekcje')} aria-label="Wróć">
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="ls-header-titles">
            <h1 className="ls-header-title">
              Lekcja {lesson.id}: {lesson.title}
              {completedCount === lesson.exercises.length && (
                <span className="ls-title-check">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#2fa05e" strokeWidth="2" fill="rgba(47, 160, 94, 0.15)"/>
                    <path d="M8 12l3 3 5-6" stroke="#2fa05e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </h1>
            <p className="ls-header-subtitle">{lesson.subtitle}</p>
          </div>
        </div>
        <div className="ls-header-right">
          <span className={`ls-badge ls-badge--level ls-badge--${lesson.level}`}>
            {LEVEL_LABELS[lesson.level]}
          </span>
          <span className="ls-badge ls-badge--progress">
            {completedCount} / {lesson.exercises.length} ukończone
          </span>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="ls-body">

        {/* Lewa kolumna — Teoria */}
        <section className="ls-col ls-col--theory">
          <div className="ls-section-header">
            <div className="ls-section-icon ls-section-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M8 9l3 3-3 3M13 15h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h2 className="ls-section-title">Teoria</h2>
          </div>

          {/* Słowa kluczowe */}
          <div className="ls-keywords-row">
            <span className="ls-keywords-label">Poznasz:</span>
            <div className="ls-keywords">
              {lesson.theory.keywords.map(kw => (
                <span key={kw} className="ls-keyword">{kw}</span>
              ))}
            </div>
          </div>

          {/* Sekcje treści */}
          <div className="ls-theory-content">
            {lesson.theory.sections.map((section, i) => (
              <TheorySection key={i} section={section} />
            ))}
          </div>

          {/* Schemat tabeli */}
          <div className="ls-schema">
            <h3 className="ls-schema-title">Schemat tabeli gracze:</h3>
            <div className="ls-schema-list">
              {lesson.theory.schema.map(col => (
                <div key={col.name} className="ls-schema-item">
                  <p className="ls-schema-col">
                    <span className="ls-schema-name">{col.name}</span>
                    <span className="ls-schema-type">({col.type})</span>
                  </p>
                  <p className="ls-schema-desc">{col.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prawa kolumna — Ćwiczenia */}
        <section className={`ls-col ls-col--exercises${exercisesOpen ? '' : ' ls-col--collapsed'}`}>
          <div className="ls-section-header">
            <div className="ls-section-icon ls-section-icon--green">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M5 3l14 9-14 9V3z" fill="currentColor"/>
              </svg>
            </div>
            <h2 className="ls-section-title">Ćwiczenia</h2>
            {!exercisesOpen && (
              <span className="ls-exercises-count">{lesson.exercises.length} zadań</span>
            )}
            <button
              className="ls-collapse-btn"
              onClick={() => setExercisesOpen(o => !o)}
              title={exercisesOpen ? 'Zwiń ćwiczenia' : 'Rozwiń ćwiczenia'}
            >
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16"
                style={{ transform: exercisesOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.25s' }}>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {(exercisesOpen || isMobile) && (
            <>
              {/* Tabs */}
              <div className="ls-tabs">
                {lesson.exercises.map((ex, i) => (
                  <button
                    key={ex.id}
                    className={`ls-tab${activeExercise === i ? ' ls-tab--active' : ''}${completed.has(ex.id) ? ' ls-tab--done' : ''}`}
                    onClick={() => setActiveExercise(i)}
                  >
                    Zadanie {ex.id}
                  </button>
                ))}
              </div>

              {/* Aktywne ćwiczenie */}
              <Exercise
                key={activeExercise}
                exercise={lesson.exercises[activeExercise]}
                db={db}
                isCompleted={completed.has(lesson.exercises[activeExercise].id)}
                isLastExercise={activeExercise === lesson.exercises.length - 1}
                onComplete={() => markComplete(lesson.exercises[activeExercise].id)}
                onReset={() => resetExercise(lesson.exercises[activeExercise].id)}
                onNextExercise={handleNextExercise}
              />
            </>
          )}
        </section>

      </div>
    </div>
  )
}

export default LessonPage
