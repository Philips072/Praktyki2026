import { useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'

/**
 * StudentDetail — modal z detalami ucznia.
 * Wyświetla wykres postępów ucznia w czasie.
 *
 * Props:
 *   student — obiekt ucznia { id, name, level, lastActive, completedTasks, errors }
 *   onClose — callback zamknięcia modala
 *   history — historia wyników ucznia [{ date, score, testName }, ...]
 *            lub obiekt { history: [...], errors: [...] }
 */
function StudentDetail({ student, onClose, history = [] }) {
  // Obsługa nowego formatu (obiekt) i starego formatu (tablica)
  const historyData = Array.isArray(history) ? history : history?.history || []
  const errorsData = Array.isArray(history) ? [] : history?.errors || []
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)

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

  // Inicjalizacja wykresu
  useEffect(() => {
    if (!chartRef.current) return

    // Usuń istniejący wykres
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    // Przygotuj dane do wykresu
    const sortedHistory = [...historyData].sort((a, b) => new Date(a.date) - new Date(b.date))

    // Jeśli brak historii, pokaż pusty wykres z linią 0%
    const labels = sortedHistory.length > 0
      ? sortedHistory.map(h => new Date(h.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' }))
      : ['Brak danych']

    const scores = sortedHistory.length > 0
      ? sortedHistory.map(h => h.score)
      : [0]

    // Pobierz kolory z CSS variables
    const getCssVar = (name, fallback) => {
      const style = getComputedStyle(document.documentElement)
      return style.getPropertyValue(name)?.trim() || fallback
    }

    const accentColor = getCssVar('--accentColor', '#323a7f')
    const primaryText = getCssVar('--primaryText', '#1a1a2e')
    const secondaryText = getCssVar('--secondaryText', '#888888')

    // Utwórz nowy wykres
    const ctx = chartRef.current.getContext('2d')
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Wynik (%)',
          data: scores,
          borderColor: accentColor,
          backgroundColor: accentColor + '20',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: accentColor,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: sortedHistory.length > 0,
            backgroundColor: accentColor,
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              title: (items) => {
                if (sortedHistory.length === 0) return null
                const index = items[0]?.dataIndex
                return sortedHistory[index]?.testName || 'Test'
              },
              label: (item) => `Wynik: ${item.parsed.y}%`
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            color: secondaryText,
            font: { family: 'VennRegular, sans-serif', size: 11 },
            callback: (value) => value + '%'
          },
          grid: {
            color: secondaryText + '30',
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: secondaryText,
            font: { family: 'VennRegular, sans-serif', size: 11 }
          },
          grid: {
            display: false
          }
        }
      }
      })
    }, [historyData])

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
            <span className="tp-modal-stat-value">
              {student.completedTasks ?? 0}/{student.totalAssigned ?? 0}
            </span>
            <span className="tp-modal-stat-label">Wykonane testy</span>
          </div>
          <div className="tp-modal-stat">
            <span className="tp-modal-stat-value">{student.avgScore ?? 0}%</span>
            <span className="tp-modal-stat-label">Średni wynik</span>
          </div>
          <div className="tp-modal-stat">
            <span className="tp-modal-stat-value">{student.lastActive ?? '—'}</span>
            <span className="tp-modal-stat-label">Ostatnia aktywność</span>
          </div>
        </div>

        {/* Wykres postępów */}
        <div className="tp-section-block">
          <h3 className="tp-modal-section-title">Postępy w czasie</h3>
          <div className="tp-chart-container">
            <canvas ref={chartRef} />
          </div>
          {historyData.length === 0 && (
            <p className="tp-empty-state">Brak wyników do wyświetlenia.</p>
          )}
        </div>

        {/* Lista wykonanych testów */}
        {historyData.length > 0 && (
          <div className="tp-section-block">
            <h3 className="tp-modal-section-title">Historia testów</h3>
            <div className="tp-test-history">
              {[...historyData].sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, idx) => (
                <div key={idx} className="tp-history-item">
                  <div className="tp-history-info">
                    <span className="tp-history-title">{item.testName}</span>
                    <span className="tp-history-date">
                      {new Date(item.date).toLocaleDateString('pl-PL', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className={`tp-history-score ${getScoreClass(item.score)}`}>
                    {item.score}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Najczęstsze błędy ucznia */}
        {errorsData.length > 0 && (
          <div className="tp-section-block">
            <h3 className="tp-modal-section-title">Najczęstsze błędy</h3>
            <ul className="tp-errors-list">
              {errorsData.map((err, idx) => (
                <li key={idx} className="tp-error-item">
                  <span className="tp-error-badge">{idx + 1}</span>
                  <div className="tp-error-content">
                    <span className="tp-error-description">{err.formatted}</span>
                    <span className="tp-error-count">({err.count}x)</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {errorsData.length === 0 && (
          <div className="tp-section-block">
            <h3 className="tp-modal-section-title">Najczęstsze błędy</h3>
            <p className="tp-empty-state">Brak zarejestrowanych błędów.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Funkcja pomocnicza do kolorowania wyniku
function getScoreClass(score) {
  if (score >= 90) return 'tp-history-score--excellent'
  if (score >= 75) return 'tp-history-score--good'
  if (score >= 50) return 'tp-history-score--average'
  return 'tp-history-score--poor'
}

export default StudentDetail
