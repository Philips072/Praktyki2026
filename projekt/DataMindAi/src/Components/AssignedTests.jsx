import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'
import './AssignedTests.css'

function AssignedTests() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return

    const fetchAssignments = async () => {
      setLoading(true)
      setError(null)

      // Pobierz przypisania bieżącego ucznia wraz z danymi testu i postępem
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          id,
          status,
          assigned_at,
          score,
          question_answers,
          tests (
            id,
            title,
            description,
            skill,
            questions
          )
        `)
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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Do wykonania'
      case 'in_progress': return 'W trakcie'
      case 'completed': return 'Przesłano'
      case 'graded': return 'Oceniono'
      default: return status
    }
  }

  const getProgress = (assignment) => {
    const answered = assignment.question_answers?.filter(qa => qa.answer?.trim()).length || 0
    const total = assignment.tests?.questions?.length || 0
    return total > 0 ? Math.round((answered / total) * 100) : 0
  }

  const getGrade = (score, thresholds) => {
    if (!thresholds) return null
    const sorted = [...thresholds].sort((a, b) => b.minPercent - a.minPercent)
    for (const t of sorted) {
      if (score >= t.minPercent) return t.grade
    }
    return sorted[sorted.length - 1]?.grade || '1'
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
          {assignments.map(assignment => {
            const { id, status, assigned_at, score, question_answers, tests: test } = assignment
            const progress = getProgress(assignment)
            const grade = getGrade(score, test?.grading_thresholds)

            return (
              <li key={id} className={`at-item at-item--${status}`}>
                <div className="at-item-main">
                  <div className="at-item-top">
                    <span className="at-item-title">{test?.title ?? '—'}</span>
                    <span className={`at-badge at-badge--${status}`}>
                      {getStatusLabel(status)}
                    </span>
                  </div>

                  {test?.description && (
                    <p className="at-item-desc">{test.description}</p>
                  )}

                  <div className="at-item-meta">
                    {test?.skill && (
                      <span className="at-meta-tag">{test.skill}</span>
                    )}
                    <span className="at-meta-date">Przypisano: {formatDate(assigned_at)}</span>
                  </div>

                  {/* Postęp dla testów w trakcie/ukończonych */}
                  {(status === 'in_progress' || status === 'completed' || status === 'graded') && (
                    <div className="at-progress">
                      <span className="at-progress-label">
                        {status === 'graded' ? 'Wynik' : 'Postęp'}
                      </span>
                      <div className="at-progress-bar">
                        <div
                          className="at-progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {status === 'graded' && score !== null ? (
                        <span className="at-grade-badge">{score} pkt</span>
                      ) : (
                        <span className="at-progress-value">{progress}%</span>
                      )}
                    </div>
                  )}

                  {status === 'graded' && grade && (
                    <div className="at-grade">
                      <span className="at-grade-label">Ocena:</span>
                      <span className="at-grade-value">{grade}</span>
                    </div>
                  )}
                </div>

                {/* Przyciski akcji */}
                <div className="at-item-actions">
                  {status === 'pending' && (
                    <button
                      className="at-btn-start"
                      onClick={() => navigate(`/testy/${id}`)}
                    >
                      Rozpocznij test
                    </button>
                  )}
                  {status === 'in_progress' && (
                    <button
                      className="at-btn-continue"
                      onClick={() => navigate(`/testy/${id}`)}
                    >
                      Kontynuuj test
                    </button>
                  )}
                  {(status === 'completed' || status === 'graded') && (
                    <button
                      className="at-btn-view"
                      onClick={() => navigate(`/testy/${id}`)}
                    >
                      Zobacz odpowiedzi
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default AssignedTests