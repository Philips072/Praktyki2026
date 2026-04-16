import { useEffect } from 'react'

/**
 * StudentDetail — modal z detalami ucznia.
 * Zawiera placeholder .chart-placeholder gotowy do podpięcia Chart.js.
 *
 * Props:
 *   student — obiekt ucznia { id, name, level, lastActive, completedTasks, errors }
 *   onClose — callback zamknięcia modala
 */
function StudentDetail({ student, onClose }) {
  // Zamknij modal na klawisz Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Zablokuj scroll body gdy modal jest otwarty
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="tp-modal-overlay" onClick={onClose}>
      <div
        className="tp-modal tp-modal--large"
        role="dialog"
        aria-label={`Szczegóły ucznia: ${student.name}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Nagłówek modala */}
        <div className="tp-modal-header">
          <div className="tp-modal-student-info">
            <span className="tp-avatar tp-avatar--xl">
              {student.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <h2 className="tp-modal-title">{student.name}</h2>
              <span className={`tp-badge tp-badge--level-${student.level}`}>
                {student.level}
              </span>
            </div>
          </div>
          <button className="tp-modal-close" onClick={onClose} aria-label="Zamknij">
            ✕
          </button>
        </div>

        {/* Statystyki ucznia */}
        <div className="tp-modal-stats">
          <div className="tp-modal-stat">
            <span className="tp-modal-stat-value">{student.completedTasks}</span>
            <span className="tp-modal-stat-label">Wykonanych zadań</span>
          </div>
          <div className="tp-modal-stat">
            <span className="tp-modal-stat-value">{student.lastActive}</span>
            <span className="tp-modal-stat-label">Ostatnia aktywność</span>
          </div>
          <div className="tp-modal-stat">
            <span className="tp-modal-stat-value">{student.errors?.length ?? 0}</span>
            <span className="tp-modal-stat-label">Typów błędów</span>
          </div>
        </div>

        {/* Wykres postępów — podepnij Chart.js do tego div-a przez useEffect w rodzicu */}
        {/* lub przekaż gotowy komponent wykresu jako prop. Canvas musi mieć unikalny id. */}
        <div className="tp-section-block">
          <h3 className="tp-modal-section-title">Postępy w czasie</h3>
          {/* WYKRES: podepnij Chart.js tutaj.
              Przykład: new Chart(document.getElementById(`chart-${student.id}`), config) */}
          <div className="chart-placeholder" id={`chart-${student.id}`}>
            <span className="chart-placeholder-label">Wykres postępów (Chart.js)</span>
          </div>
        </div>

        {/* Najczęstsze błędy ucznia */}
        <div className="tp-section-block">
          <h3 className="tp-modal-section-title">Najczęstsze błędy</h3>
          {!student.errors || student.errors.length === 0 ? (
            <p className="tp-empty-state">Brak zarejestrowanych błędów.</p>
          ) : (
            <ul className="tp-errors-list">
              {student.errors.map((err, idx) => (
                <li key={idx} className="tp-error-item">
                  <span className="tp-error-badge">{idx + 1}</span>
                  {err}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDetail
