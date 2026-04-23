import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { toast } from 'react-toastify'
import './GradingSection.css'

function GradingSection() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [grading, setGrading] = useState(false)

  const fetchAssignments = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          id,
          status,
          assigned_at,
          score,
          student_id,
          tests (
            id,
            title,
            description,
            skill,
            expected_sql
          ),
          student:profiles!assignments_student_id_fkey (
            id,
            name
          )
        `)
        .eq('status', 'completed')
        .order('assigned_at', { ascending: false })

      if (error) throw error
      setAssignments(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, [])

  const handleGrade = async (assignmentId, score) => {
    setGrading(true)
    try {
      const { error } = await supabase
        .from('assignments')
        .update({ score: Number(score) })
        .eq('id', assignmentId)

      if (error) throw error

      toast.success('Ocena została zapisana')
      fetchAssignments()
      setSelectedAssignment(null)
    } catch (err) {
      toast.error('Błąd zapisu oceny: ' + err.message)
    } finally {
      setGrading(false)
    }
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="gs-section">
        <div className="gs-loading">
          <div className="gs-spinner"></div>
          <p>Ładowanie testów do oceny...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="gs-section">
        <div className="gs-error">
          <p>Błąd: {error}</p>
          <button onClick={fetchAssignments} className="gs-btn gs-btn--secondary">
            Spróbuj ponownie
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="gs-section">
      <div className="gs-header">
        <h2 className="gs-title">Ocena testów <span className="gs-count">({assignments.length})</span></h2>
        <button onClick={fetchAssignments} className="gs-btn gs-btn--secondary">
          Odśwież
        </button>
      </div>

      {assignments.length === 0 ? (
        <div className="gs-empty">
          <div className="gs-empty-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3>Brak testów do oceny</h3>
          <p>Żaden uczeń nie ukończył jeszcze żadnego testu.</p>
        </div>
      ) : (
        <div className="gs-list">
          {assignments.map(assignment => {
            const test = assignment.tests
            const student = assignment.student
            const isGraded = assignment.score !== null

            return (
              <div key={assignment.id} className="gs-card">
                <div className="gs-card-header">
                  <div className="gs-card-student">
                    <span className="gs-avatar">{student?.name?.charAt(0) || '?'}</span>
                    <div className="gs-student-info">
                      <span className="gs-student-name">{student?.name || 'Nieznany'}</span>
                      <span className="gs-test-title">{test?.title || 'Bez tytułu'}</span>
                    </div>
                  </div>
                  <div className="gs-card-status">
                    {isGraded ? (
                      <span className="gs-badge gs-badge--graded">
                        {assignment.score} pkt
                      </span>
                    ) : (
                      <span className="gs-badge gs-badge--pending">
                        Do oceny
                      </span>
                    )}
                  </div>
                </div>

                <div className="gs-card-meta">
                  {test?.skill && <span className="gs-skill">{test.skill}</span>}
                  <span className="gs-date">{formatDate(assignment.assigned_at)}</span>
                </div>

                <div className="gs-card-actions">
                  <button
                    onClick={() => setSelectedAssignment(assignment)}
                    className="gs-btn gs-btn--primary"
                  >
                    {isGraded ? 'Edytuj ocenę' : 'Oceń'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal oceny */}
      {selectedAssignment && (
        <div className="gs-modal-overlay" onClick={() => setSelectedAssignment(null)}>
          <div className="gs-modal" onClick={e => e.stopPropagation()}>
            <div className="gs-modal-header">
              <h3 className="gs-modal-title">Oceń test</h3>
              <button onClick={() => setSelectedAssignment(null)} className="gs-modal-close">×</button>
            </div>

            <div className="gs-modal-content">
              <div className="gs-modal-student">
                <span className="gs-avatar gs-avatar--lg">
                  {selectedAssignment.student?.name?.charAt(0) || '?'}
                </span>
                <div>
                  <div className="gs-student-name">{selectedAssignment.student?.name}</div>
                  <div className="gs-test-title">{selectedAssignment.tests?.title}</div>
                </div>
              </div>

              <div className="gs-modal-details">
                {selectedAssignment.tests?.description && (
                  <div className="gs-detail-item">
                    <span className="gs-detail-label">Instrukcja:</span>
                    <span className="gs-detail-value">{selectedAssignment.tests.description}</span>
                  </div>
                )}

                <div className="gs-detail-item">
                  <span className="gs-detail-label">Oczekiwane SQL:</span>
                  <code className="gs-code">{selectedAssignment.tests?.expected_sql}</code>
                </div>

                <div className="gs-detail-item gs-detail-item--answer">
                  <span className="gs-detail-label">Odpowiedź ucznia:</span>
                  <code className="gs-code gs-code--student">
                    {selectedAssignment.student_answer || 'Brak odpowiedzi'}
                  </code>
                </div>

                <div className="gs-grading-form">
                  <label className="gs-grading-label">Wystaw ocenę (0-100):</label>
                  <div className="gs-grading-inputs">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={selectedAssignment.score || 0}
                      id="gs-score-input"
                      className="gs-score-input"
                    />
                    <button
                      onClick={() => {
                        const score = document.getElementById('gs-score-input').value
                        handleGrade(selectedAssignment.id, score)
                      }}
                      className="gs-btn gs-btn--primary"
                      disabled={grading}
                    >
                      {grading ? 'Zapisywanie...' : 'Zapisz ocenę'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GradingSection
