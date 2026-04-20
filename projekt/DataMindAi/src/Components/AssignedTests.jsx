import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'
import './AssignedTests.css'

const DIFFICULTY_LABEL = { easy: 'Łatwy', medium: 'Średni', hard: 'Trudny' }

function AssignedTests() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return

    const fetchAssignments = async () => {
      setLoading(true)
      setError(null)

      // Pobierz przypisania bieżącego ucznia wraz z danymi testu (JOIN przez klucz obcy)
      const { data, error } = await supabase
        .from('assignments')
        .select('id, status, assigned_at, tests(id, title, description, difficulty, skill)')
        .eq('student_id', user.id)
        .order('assigned_at', { ascending: false })

      if (error) { setError(error.message); setLoading(false); return }
      setAssignments(data ?? [])
      setLoading(false)
    }

    fetchAssignments()
  }, [user])

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('pl-PL', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  if (loading) return (
    <div className="at-wrapper">
      <h2 className="at-title">Twoje testy</h2>
      <p className="at-status at-status--loading">Ładowanie testów…</p>
    </div>
  )

  if (error) return (
    <div className="at-wrapper">
      <h2 className="at-title">Twoje testy</h2>
      <p className="at-status at-status--error">Błąd: {error}</p>
    </div>
  )

  return (
    <div className="at-wrapper">
      <div className="at-header">
        <h2 className="at-title">Twoje testy</h2>
        {assignments.length > 0 && (
          <span className="at-count">
            {assignments.filter(a => a.status === 'pending').length} do wykonania
          </span>
        )}
      </div>

      {assignments.length === 0 ? (
        <p className="at-empty">Nauczyciel nie przypisał Ci jeszcze żadnych testów.</p>
      ) : (
        <ul className="at-list">
          {assignments.map(({ id, status, assigned_at, tests: test }) => (
            <li key={id} className={`at-item at-item--${status}`}>
              <div className="at-item-main">
                <div className="at-item-top">
                  <span className="at-item-title">{test?.title ?? '—'}</span>
                  <span className={`at-badge at-badge--${status}`}>
                    {status === 'pending' ? 'Do wykonania' : 'Ukończono'}
                  </span>
                </div>

                {test?.description && (
                  <p className="at-item-desc">{test.description}</p>
                )}

                <div className="at-item-meta">
                  {test?.skill && (
                    <span className="at-meta-tag">{test.skill}</span>
                  )}
                  {test?.difficulty && (
                    <span className={`at-meta-tag at-meta-tag--${test.difficulty}`}>
                      {DIFFICULTY_LABEL[test.difficulty] ?? test.difficulty}
                    </span>
                  )}
                  <span className="at-meta-date">Przypisano: {formatDate(assigned_at)}</span>
                </div>
              </div>

              {/* Przycisk aktywny tylko gdy test jest do wykonania */}
              {status === 'pending' && (
                <button className="at-btn-start" disabled>
                  Rozpocznij test
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AssignedTests
