import './LessonPage.css'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LESSONS from '../data/lessonsData'

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
          <pre><code>{section.content}</code></pre>
        </div>
      )

    case 'table':
      return (
        <div className="ls-example-table-wrap">
          {section.label && <p className="ls-table-label">{section.label}</p>}
          <div className="ls-table-scroll">
            <table className="ls-example-table">
              <thead>
                <tr>{section.columns.map(c => <th key={c}>{c}</th>)}</tr>
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
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16" flexShrink="0">
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

function Exercise({ exercise }) {
  const [query, setQuery] = useState('')
  const [showHint, setShowHint] = useState(false)

  return (
    <div className="ls-exercise">
      <div className="ls-exercise-task">
        <p className="ls-exercise-task-label">Zadanie:</p>
        <p className="ls-exercise-task-text">{exercise.task}</p>
      </div>

      <p className="ls-sql-label">Twoje zapytanie SQL:</p>
      <textarea
        className="ls-sql-editor"
        placeholder={exercise.placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
        spellCheck={false}
      />

      <div className="ls-exercise-actions">
        <button className="ls-btn ls-btn--check">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path d="M12 3l1.5 3 3.5.5-2.5 2.5.5 3.5L12 11l-3 1.5.5-3.5L7 6.5 10.5 6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
          Sprawdź odpowiedź
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
      </div>

      {showHint && (
        <div className="ls-hint-box">
          {exercise.hint}
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
  const navigate = useNavigate()
  const [activeExercise, setActiveExercise] = useState(0)

  const lesson = LESSONS.find(l => l.id === Number(id))

  if (!lesson) {
    return (
      <div className="ls-not-found">
        <p>Nie znaleziono lekcji.</p>
        <button onClick={() => navigate('/lekcje')}>Wróć do lekcji</button>
      </div>
    )
  }

  const completedCount = 0 // placeholder — będzie z backendu

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
            <h1 className="ls-header-title">Lekcja {lesson.id}: {lesson.title}</h1>
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
        <section className="ls-col ls-col--exercises">
          <div className="ls-section-header">
            <div className="ls-section-icon ls-section-icon--green">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M5 3l14 9-14 9V3z" fill="currentColor"/>
              </svg>
            </div>
            <h2 className="ls-section-title">Ćwiczenia</h2>
          </div>

          {/* Tabs */}
          <div className="ls-tabs">
            {lesson.exercises.map((ex, i) => (
              <button
                key={ex.id}
                className={`ls-tab${activeExercise === i ? ' ls-tab--active' : ''}`}
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
          />
        </section>

      </div>
    </div>
  )
}

export default LessonPage
