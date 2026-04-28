import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentDetail from './StudentDetail'
import ClassManagement from './ClassManagement'
import BulkAssignmentModal from './BulkAssignmentModal'
import StudentSelector from './StudentSelector'
import CustomSelect from './CustomSelect'
import TestGradingModal from './TestGradingModal'
import './TeacherPanel.css'

const IconCSV = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="2" width="13" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M13 2v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <rect x="13" y="13" width="8" height="7" rx="1.5" fill="currentColor" opacity="0.15"/>
    <rect x="13" y="13" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <text x="14.2" y="19.2" fontSize="4.8" fontWeight="bold" fill="currentColor" fontFamily="monospace">CSV</text>
  </svg>
)

const IconPDF = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="2" width="13" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M13 2v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <rect x="13" y="13" width="8" height="7" rx="1.5" fill="currentColor" opacity="0.15"/>
    <rect x="13" y="13" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <text x="13.9" y="19.2" fontSize="4.8" fontWeight="bold" fill="currentColor" fontFamily="monospace">PDF</text>
  </svg>
)

// ─── Sekcja: Lista uczniów ─────────────────────────────────────────────────
function StudentsSection({
  students,
  studentsLoading,
  studentsError,
  onExportResults,
  classes,
  selectedClassId,
  onFilterByClass,
  isAdmin = false,
  onDeleteUser = null,
  onChangeUserRole = null,
  allStudents = null,
  onFetchStudentHistory = null
}) {
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentHistory, setStudentHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [viewMode, setViewMode] = useState('table') // 'table' | 'cards'

  // Pobierz historię ucznia gdy zostanie wybrany
  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedStudent || !onFetchStudentHistory) return

      setHistoryLoading(true)
      try {
        const history = await onFetchStudentHistory(selectedStudent.id)
        setStudentHistory(history)
      } catch (error) {
        console.error('Błąd pobierania historii ucznia:', error)
        setStudentHistory([])
      } finally {
        setHistoryLoading(false)
      }
    }

    fetchHistory()
  }, [selectedStudent?.id, onFetchStudentHistory])

  if (studentsLoading) return (
    <div className="tp-section">
      <p className="tp-status-msg tp-status-msg--loading">Ładowanie uczniów…</p>
    </div>
  )

  if (studentsError) return (
    <div className="tp-section">
      <p className="tp-status-msg tp-status-msg--error">Błąd: {studentsError}</p>
    </div>
  )

  return (
    <div className="tp-section">
      <div className="tp-section-header">
        <h2 className="tp-section-title">Lista uczniów <span className="tp-student-count">({students.length})</span></h2>
        <div className="tp-section-actions">
          {/* Filtrowanie po klasach */}
          <CustomSelect
            options={[
              { value: 'all', label: 'Wszystkie klasy' },
              ...classes.map(cls => ({ value: cls.id, label: cls.name }))
            ]}
            value={selectedClassId || 'all'}
            onChange={(val) => onFilterByClass(val === 'all' ? null : val)}
            placeholder="Wybierz klasę"
          />

          {/* Przełącznik widoku tabela/karty */}
          <button
            className={`tp-view-btn ${viewMode === 'table' ? 'tp-view-btn--active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Widok tabeli"
            aria-label="Widok tabeli"
          >
            ☰
          </button>
          <button
            className={`tp-view-btn ${viewMode === 'cards' ? 'tp-view-btn--active' : ''}`}
            onClick={() => setViewMode('cards')}
            title="Widok kart"
            aria-label="Widok kart"
          >
            ⊞
          </button>
          <button className="tp-btn tp-btn--export tp-btn--export-csv" onClick={() => onExportResults('csv')} aria-label="Eksport CSV">
            <IconCSV /> <span>Eksport CSV</span>
          </button>
          <button className="tp-btn tp-btn--export tp-btn--export-pdf" onClick={() => onExportResults('pdf')} aria-label="Eksport PDF">
            <IconPDF /> <span>Eksport PDF</span>
          </button>
        </div>
      </div>

      {/* Widok tabeli — na mobile automatycznie zamienia się w karty przez CSS */}
      {viewMode === 'table' ? (
        <div className="tp-table-wrapper">
          <table className="tp-table">
            <thead>
              <tr>
                <th>Imię i nazwisko</th>
                <th>Klasa</th>
                <th>Poziom</th>
                {isAdmin && <th>Rola</th>}
                <th>Ostatnia aktywność</th>
                <th>Postęp</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="tp-table-row">
                  <td>
                    <div className="tp-student-name-cell">
                      {/* Avatar z inicjałami */}
                      <span className="tp-avatar tp-avatar--sm">
                        {student.name.charAt(0).toUpperCase()}
                      </span>
                      {student.name}
                    </div>
                  </td>
                  <td>
                    {student.className && (
                      <span className="tp-badge tp-badge--class">{student.className}</span>
                    )}
                  </td>
                  <td>
                    <span className={`tp-badge tp-badge--level-${student.level}`}>
                      {student.level}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <CustomSelect
                        options={[
                          { value: 'uczen', label: 'Uczeń' },
                          { value: 'nauczyciel', label: 'Nauczyciel' },
                          { value: 'administrator', label: 'Administrator' }
                        ]}
                        value={student.role || 'uczen'}
                        onChange={(val) => onChangeUserRole && onChangeUserRole(student.id, val, student.name)}
                        className="tp-role-select"
                      />
                    </td>
                  )}
                  <td className="tp-text-secondary">{student.lastActive ?? '—'}</td>
                  <td>
                    <div className="tp-progress-cell">
                      <span className="tp-progress-text">
                        {student.completedTasks ?? 0}/{student.totalAssigned ?? 0}
                      </span>
                      {student.totalAssigned > 0 && (
                        <div className="tp-progress-bar">
                          <div
                            className="tp-progress-bar-fill"
                            style={{
                              width: `${Math.round((student.completedTasks || 0) / student.totalAssigned * 100)}%`
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="tp-btn tp-btn--ghost tp-btn--sm"
                        onClick={() => setSelectedStudent(student)}
                      >
                        Szczegóły
                      </button>
                      {isAdmin && onDeleteUser && (
                        <button
                          className="tp-btn tp-btn--ghost tp-btn--sm tp-btn--danger"
                          onClick={() => onDeleteUser(student.id, student.name)}
                        >
                          Usuń
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Widok kart — domyślny na mobile */
        <div className="tp-cards-grid">
          {students.map(student => (
            <div
              key={student.id}
              className="tp-student-card"
              onClick={() => setSelectedStudent(student)}
            >
              <div className="tp-avatar tp-avatar--lg">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div className="tp-student-card-info">
                <span className="tp-student-card-name">{student.name}</span>
                {student.className && (
                  <span className="tp-badge tp-badge--class">{student.className}</span>
                )}
                <span className={`tp-badge tp-badge--level-${student.level}`}>
                  {student.level}
                </span>
                <span className="tp-text-secondary tp-student-card-meta">
                  Aktywny: {student.lastActive}
                </span>
                <span className="tp-text-secondary tp-student-card-meta">
                  Postęp: {student.completedTasks ?? 0}/{student.totalAssigned ?? 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal ze szczegółami ucznia — renderuje się gdy wybrany jest uczeń */}
      {selectedStudent && (
        <StudentDetail
          student={selectedStudent}
          history={historyLoading ? [] : studentHistory}
          onClose={() => {
            setSelectedStudent(null)
            setStudentHistory([])
          }}
        />
      )}
    </div>
  )
}

// ─── Sekcja: Ocenione ─────────────────────────────────────────────────────
function GradedSection({ assignments, loading, onOpenGrading }) {
  if (loading) {
    return (
      <div className="tp-section">
        <p className="tp-status-msg tp-status-msg--loading">Ładowanie ocenionych testów…</p>
      </div>
    )
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="tp-section">
        <p className="tp-empty-state">Brak ocenionych testów.</p>
      </div>
    )
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreClass = (score) => {
    if (score >= 90) return 'tp-graded-score--excellent'
    if (score >= 75) return 'tp-graded-score--good'
    if (score >= 50) return 'tp-graded-score--average'
    return 'tp-graded-score--poor'
  }

  // Grupuj po uczniach
  const studentGroups = {}
  assignments.forEach(a => {
    if (!studentGroups[a.student_id]) {
      studentGroups[a.student_id] = {
        name: a.profiles?.name || 'Nieznany',
        assignments: []
      }
    }
    studentGroups[a.student_id].assignments.push(a)
  })

  return (
    <div className="tp-section">
      <div className="tp-section-header">
        <h2 className="tp-section-title">
          Ocenione testy <span className="tp-student-count">({assignments.length})</span>
        </h2>
      </div>

      <div className="tp-graded-list">
        {Object.entries(studentGroups).map(([studentId, data]) => (
          <div key={studentId} className="tp-graded-student">
            <div className="tp-graded-student-header">
              <span className="tp-avatar tp-avatar--sm">
                {data.name.charAt(0).toUpperCase()}
              </span>
              <span className="tp-graded-student-name">{data.name}</span>
              <span className="tp-graded-count">
                {data.assignments.length} {data.assignments.length === 1 ? 'test' : 'testów'}
              </span>
            </div>
            <div className="tp-graded-assignments">
              {data.assignments.map(assignment => (
                <div key={assignment.id} className="tp-graded-item">
                  <div className="tp-graded-info">
                    <span className="tp-graded-test-title">
                      {assignment.tests?.title || 'Bez tytułu'}
                    </span>
                    <span className="tp-graded-date">
                      {formatDate(assignment.assigned_at)}
                    </span>
                  </div>
                  <div className="tp-graded-actions">
                    <div className={`tp-graded-score ${getScoreClass(assignment.score)}`}>
                      {assignment.score}%
                    </div>
                    {onOpenGrading && (
                      <button
                        className="tp-btn tp-btn--sm tp-btn--ghost"
                        onClick={() => onOpenGrading(assignment.id)}
                        title="Ponownie oceń"
                      >
                        Oceń ponownie
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Sekcja: Testy ────────────────────────────────────────────────────────
