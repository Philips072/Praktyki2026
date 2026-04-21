import './Test.css'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'
import { toast } from 'react-toastify'

function Test() {
  const { user, profile } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // all, pending, completed, in_progress

  const fetchAssignments = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          id,
          test_id,
          status,
          assigned_at,
          tests (
            id,
            title,
            description,
            difficulty,
            skill,
            expected_sql
          )
        `)
        .eq('student_id', user.id)
        .order('assigned_at', { ascending: false })

      if (error) throw error

      setAssignments(data || [])
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, [user])

  const handleStartTest = async (assignmentId) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .update({ status: 'in_progress', started_at: new Date().toISOString() })
        .eq('id', assignmentId)

      if (error) throw error

      toast.success('Test rozpoczęty!')
      fetchAssignments()
    } catch (err) {
      toast.error('Błąd rozpoczynania testu: ' + err.message)
    }
  }

  const handleCompleteTest = async (assignmentId) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .update({
          status: 'completed'
        })
        .eq('id', assignmentId)

      if (error) throw error

      toast.success('Test ukończony!')
      fetchAssignments()
    } catch (err) {
      toast.error('Błąd kończenia testu: ' + err.message)
    }
  }

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true
    return assignment.status === filter
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Oczekujący', color: 'test-status-badge-pending' },
      in_progress: { label: 'W trakcie', color: 'test-status-badge-in-progress' },
      completed: { label: 'Ukończony', color: 'test-status-badge-completed' },
      expired: { label: 'Wygasły', color: 'test-status-badge-expired' }
    }

    const config = statusConfig[status] || { label: status, color: '' }
    return (
      <span className={`test-status-badge ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      latwy: 'test-difficulty-easy',
      sredni: 'test-difficulty-medium',
      trudny: 'test-difficulty-hard'
    }
    return colors[difficulty] || 'test-difficulty-unknown'
  }

  if (loading) {
    return (
      <div className="test-page">
        <div className="test-header">
          <h1>Moje Testy</h1>
          <p className="test-subtitle">Testy przypisane przez nauczyciela</p>
        </div>
        <div className="test-loading">
          <div className="test-loading-spinner"></div>
          <p>Ładowanie testów...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="test-page">
        <div className="test-header">
          <h1>Moje Testy</h1>
          <p className="test-subtitle">Testy przypisane przez nauczyciela</p>
        </div>
        <div className="test-error">
          <p>Błąd: {error}</p>
          <button onClick={fetchAssignments} className="test-btn test-btn-secondary">
            Spróbuj ponownie
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="test-page">
      <div className="test-header">
        <h1>Moje Testy</h1>
        <p className="test-subtitle">
          {filteredAssignments.length} {filteredAssignments.length === 1 ? 'test' : filteredAssignments.length < 5 ? 'testy' : 'testów'}
        </p>
      </div>

      <div className="test-filters">
        <button
          className={`test-filter-btn ${filter === 'all' ? 'test-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Wszystkie
        </button>
        <button
          className={`test-filter-btn ${filter === 'pending' ? 'test-active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Oczekujące
        </button>
        <button
          className={`test-filter-btn ${filter === 'in_progress' ? 'test-active' : ''}`}
          onClick={() => setFilter('in_progress')}
        >
          W trakcie
        </button>
        <button
          className={`test-filter-btn ${filter === 'completed' ? 'test-active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Ukończone
        </button>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="test-empty">
          <div className="test-empty-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17.5 5"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M9 12L11 14L15 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3>Brak testów</h3>
          <p>
            {filter === 'all'
              ? 'Nie masz jeszcze przypisanych żadnych testów.'
              : `Nie masz testów w kategorii: ${filter === 'pending' ? 'Oczekujące' : filter === 'in_progress' ? 'W trakcie' : 'Ukończone'}`
            }
          </p>
        </div>
      ) : (
        <div className="test-grid">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="test-card">
              <div className="test-card-header">
                <div className="test-card-title">
                  <h3>{assignment.tests?.title || 'Bez tytułu'}</h3>
                  {getStatusBadge(assignment.status)}
                </div>
                {assignment.tests?.difficulty && (
                  <span className={`test-difficulty-badge ${getDifficultyColor(assignment.tests.difficulty)}`}>
                    {assignment.tests.difficulty.charAt(0).toUpperCase() + assignment.tests.difficulty.slice(1)}
                  </span>
                )}
              </div>

              {assignment.tests?.description && (
                <p className="test-card-description">
                  {assignment.tests.description}
                </p>
              )}

              <div className="test-card-meta">
                <div className="test-meta-item">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>Przypisano: {new Date(assignment.assigned_at).toLocaleDateString('pl-PL')}</span>
                </div>

                {assignment.status === 'completed' && (
                  <div className="test-meta-item">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 12L11 14L15 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Status: Ukończony</span>
                  </div>
                )}

                {assignment.tests?.expected_sql && (
                  <div className="test-meta-item">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 7L2 5L4 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 5H22"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M20 7L22 5L20 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Zadanie SQL</span>
                  </div>
                )}

                {assignment.tests?.skill && (
                  <div className="test-meta-item">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{assignment.tests.skill}</span>
                  </div>
                )}
              </div>

              <div className="test-card-actions">
                {assignment.status === 'pending' && (
                  <button
                    onClick={() => handleStartTest(assignment.id)}
                    className="test-btn test-btn-primary"
                  >
                    Rozpocznij test
                  </button>
                )}

                {assignment.status === 'in_progress' && (
                  <button
                    onClick={() => handleCompleteTest(assignment.id)}
                    className="test-btn test-btn-success"
                  >
                    Zakończ test
                  </button>
                )}

                {assignment.status === 'completed' && (
                  <button className="test-btn test-btn-secondary" disabled>
                    Ukończono
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Test