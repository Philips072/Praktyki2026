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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [sqlQuery, setSqlQuery] = useState('')
  const [result, setResult] = useState(null)
  const [running, setRunning] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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
          student_answer,
          score,
          tests (
            id,
            title,
            description,
            skill,
            expected_sql
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

      // Jeśli test jest już ukończony, pokaż odpowiedź ucznia
      if (data.status === 'completed') {
        setSubmitted(true)
        if (data.student_answer) {
          setSqlQuery(data.student_answer)
        }
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

  const handleRunQuery = async () => {
    if (!sqlQuery.trim()) {
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
    if (!sqlQuery.trim()) {
      toast.warning('Wpisz zapytanie SQL przed przesłaniem.')
      return
    }

    // Porównaj z oczekiwanym zapytaniem
    const isCorrect = sqlQuery.trim().replace(/\s+/g, ' ').toLowerCase() ===
                    test?.expected_sql?.trim().replace(/\s+/g, ' ').toLowerCase()

    try {
      const { error } = await supabase
        .from('assignments')
        .update({
          status: 'completed',
          student_answer: sqlQuery,
          is_correct: isCorrect
        })
        .eq('id', assignmentId)

      if (error) throw error

      setSubmitted(true)

      if (isCorrect) {
        toast.success('Gratulacje! Zaliczyłeś test! 🎉')
      } else {
        toast.info('Przesłano zapytanie, ale nie pasuje do oczekiwanego wyniku.')
      }

      // Opcjonalnie zaktualizuj statystyki ucznia
      if (isCorrect) {
        // TODO: Zaktualizować punkty lub postęp w profiles
      }
    } catch (err) {
      toast.error('Błąd przesyłania odpowiedzi: ' + err.message)
    }
  }

  // Obsługa klawisza Ctrl+Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (!submitted) {
          handleRunQuery()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sqlQuery, submitted])

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

    return (
      <div className="test-solve-page">
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
          <h1>Test ukończony! 🎉</h1>
          {hasScore ? (
            <div className="test-solve-score">
              <span className="test-solve-score-value">{assignment.score}</span>
              <span className="test-solve-score-label">pkt</span>
            </div>
          ) : (
            <p>Odpowiedź została przesłana. Oczekuj na ocenę nauczyciela.</p>
          )}
          <button onClick={() => navigate('/testy')} className="btn-primary">
            Wróć do listy testów
          </button>
        </div>
      </div>
    )
  }

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
        </div>
      </header>

      <div className="test-solve-content">
        <div className="test-info-card">
          <h1 className="test-title">{test.title}</h1>

          <div className="test-meta">
            {test.skill && (
              <span className="tag">{test.skill}</span>
            )}
          </div>

          {test.description && (
            <div className="test-description">
              <h3>Instrukcja:</h3>
              <p>{test.description}</p>
            </div>
          )}
        </div>

        <div className="sql-editor-card">
          <div className="sql-editor-header">
            <h3>Edytor SQL</h3>
            {!submitted && (
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
                        d="M14.7 6.3a1 1 0 0 0 0 1.4l-1.6 1.6a1 1 0 0 0-1.4 0l-1.6-1.6a1 1 0 0 0-1.4 1.4l1.6 1.6a1 1 0 0 0 1.4 0l1.6-1.6a1 1 0 0 0 0-1.4zM18.4 5.6a2 2 0 0 1 0-2.8l-1.4 1.4a2 2 0 0 1-2.8 0L6.3 1a2 2 0 0 1-2.8 2.8l8 8a2 2 0 0 1 2.8 0l1.4-1.4a2 2 0 0 1 0-2.8zM4.2 13.6a2 2 0 0 0 0 2.8l1.4 1.4a2 2 0 0 0 2.8 0l8-8a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    Uruchom
                  </>
                )}
              </button>
            )}
          </div>

          <textarea
            className="sql-editor"
            value={sqlQuery}
            onChange={e => setSqlQuery(e.target.value)}
            placeholder="Wpisz zapytanie SQL tutaj..."
            spellCheck={false}
            disabled={submitted}
          />

          <div className="sql-editor-footer">
            {!submitted && <span className="hint">Naciśnij Ctrl+Enter aby uruchomić</span>}
            {submitted && <span className="hint">Test już zakończony</span>}
          </div>
        </div>

        {result && (
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

        {!submitted && (
          <div className="submit-section">
            <button onClick={handleSubmit} className="btn-submit">
              Prześlij odpowiedź
            </button>
            <p className="submit-hint">
              Przesłając odpowiedź zatwierdzasz ukończenie testu.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestSolve
