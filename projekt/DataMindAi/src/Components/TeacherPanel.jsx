import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentDetail from './StudentDetail'
import ClassManagement from './ClassManagement'
import BulkAssignmentModal from './BulkAssignmentModal'
import StudentSelector from './StudentSelector'
import CustomSelect from './CustomSelect'
import GradingSection from './GradingSection'
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
  allStudents = null
}) {
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [viewMode, setViewMode] = useState('table') // 'table' | 'cards'

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
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  )
}

// ─── Sekcja: Testy ────────────────────────────────────────────────────────
function TestsSection({
  tests, testsLoading, testsError,
  students, classes, onAssignTest, onBulkAssignTest, onDeleteTest,
  isAdmin = false,
}) {
  const navigate = useNavigate()
  const [assignModal, setAssignModal] = useState(null) // id testu do przypisania
  const [bulkAssignModal, setBulkAssignModal] = useState(null) // id testu do masowego przypisania
  const [assignedIds, setAssignedIds] = useState([])   // uczniowie już przypisani w tej sesji
  const [gradingModal, setGradingModal] = useState(null) // { testId, assignmentId }

  const handleAssign = async (studentId) => {
    await onAssignTest(assignModal, studentId)
    setAssignedIds(prev => [...prev, studentId])
  }

  const handleBulkAssign = (testId) => {
    setBulkAssignModal(testId)
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="tp-section">
      <div className="tp-section-header">
        <h2 className="tp-section-title">
          Testy <span className="tp-student-count">({tests.length})</span>
        </h2>
        <div className="tp-section-actions">
          <button
            className="tp-btn tp-btn--primary"
            onClick={() => navigate('/kreator-testow')}
          >
            + Utwórz test
          </button>
        </div>
      </div>

      {/* Stany ładowania / błędu */}
      {testsLoading && <p className="tp-status-msg tp-status-msg--loading">Ładowanie testów…</p>}
      {testsError   && <p className="tp-status-msg tp-status-msg--error">Błąd: {testsError}</p>}

      {/* Lista testów */}
      {!testsLoading && !testsError && (
        <div className="tp-exercises-list">
          {tests.length === 0 && (
            <p className="tp-empty-state">Brak testów. Utwórz pierwszy test powyżej.</p>
          )}
          {tests.map(test => (
            <div key={test.id} className="tp-exercise-item tp-card">
              <div className="tp-exercise-info">
                <span className="tp-exercise-title">{test.title}</span>
                <div className="tp-exercise-meta">
                  {test.skill && <span className="tp-text-secondary">{test.skill}</span>}
                  <span className="tp-text-secondary">{formatDate(test.created_at)}</span>
                </div>
              </div>
              <div className="tp-exercise-actions">
                <button
                  className="tp-btn tp-btn--ghost tp-btn--sm"
                  onClick={() => { setAssignModal(test.id); setAssignedIds([]) }}
                >
                  Przypisz uczniowi
                </button>
                <button
                  className="tp-btn tp-btn--primary tp-btn--sm"
                  onClick={() => handleBulkAssign(test.id)}
                >
                  Przypisz masowo
                </button>
                <button
                  className="tp-btn tp-btn--ghost tp-btn--sm tp-btn--grading"
                  onClick={() => setGradingModal({ testId: test.id, assignmentId: null })}
                >
                  Oceń
                </button>
                <button
                  className="tp-btn tp-btn--ghost tp-btn--sm tp-btn--danger"
                  onClick={() => onDeleteTest(test.id)}
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal przypisywania testu do pojedynczego ucznia */}
      {assignModal && (
        <div className="tp-modal-overlay" onClick={() => setAssignModal(null)}>
          <div className="tp-modal" onClick={e => e.stopPropagation()}>
            <h3 className="tp-modal-title">Przypisz test uczniowi</h3>
            {students.length === 0
              ? <p className="tp-empty-state">Brak uczniów w bazie.</p>
              : (
                <ul className="tp-assign-list">
                  {students.map(student => {
                    const done = assignedIds.includes(student.id)
                    return (
                      <li key={student.id} className="tp-assign-item">
                        <span className="tp-avatar tp-avatar--sm">{student.name.charAt(0)}</span>
                        <span>{student.name}</span>
                        <button
                          className={`tp-btn tp-btn--sm ${done ? 'tp-btn--assigned' : 'tp-btn--primary'}`}
                          onClick={() => !done && handleAssign(student.id)}
                          disabled={done}
                        >
                          {done ? '✓ Przypisano' : 'Przypisz'}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )
            }
            <button className="tp-btn tp-btn--ghost" onClick={() => setAssignModal(null)}>Zamknij</button>
          </div>
        </div>
      )}

      {/* Modal masowego przypisywania testu */}
      {bulkAssignModal && (
        <BulkAssignmentModal
          test={tests.find(t => t.id === bulkAssignModal)}
          students={students}
          classes={classes}
          onAssign={onBulkAssignTest}
          onClose={() => setBulkAssignModal(null)}
        />
      )}

      {/* Modal oceniania testu */}
      {gradingModal && (
        <TestGradingModal
          tests={tests}
          onClose={() => setGradingModal(null)}
          preSelectedTestId={gradingModal.testId}
          preSelectedAssignmentId={gradingModal.assignmentId}
        />
      )}
    </div>
  )
}

// ─── Sekcja: Statystyki klasy ─────────────────────────────────────────────
function StatsSection({ classStats, onExportResults }) {
  return (
    <div className="tp-section">
      <div className="tp-section-header">
        <h2 className="tp-section-title">Statystyki klasy</h2>
        <div className="tp-section-actions">
          <button className="tp-btn tp-btn--export tp-btn--export-csv" onClick={() => onExportResults('csv')} aria-label="Eksport CSV">
            <IconCSV /> <span>Eksport CSV</span>
          </button>
          <button className="tp-btn tp-btn--export tp-btn--export-pdf" onClick={() => onExportResults('pdf')} aria-label="Eksport PDF">
            <IconPDF /> <span>Eksport PDF</span>
          </button>
        </div>
      </div>

      {/* Karty z podsumowaniem */}
      <div className="tp-stats-cards">
        <div className="tp-stat-card">
          <span className="tp-stat-card-value">{classStats.totalStudents}</span>
          <span className="tp-stat-card-label">Uczniów łącznie</span>
        </div>
        <div className="tp-stat-card">
          <span className="tp-stat-card-value">{classStats.avgScore}%</span>
          <span className="tp-stat-card-label">Średni wynik klasy</span>
        </div>
        <div className="tp-stat-card">
          <span className="tp-stat-card-value">{classStats.weeklyTasks}</span>
          <span className="tp-stat-card-label">Testów w tym tygodniu</span>
        </div>
      </div>

      <div className="tp-stats-grid">
        {/* Tabela rankingowa */}
        <div className="tp-card">
          <h3 className="tp-card-title">Ranking uczniów</h3>
          <table className="tp-table tp-table--compact">
            <thead>
              <tr>
                <th>#</th>
                <th>Uczeń</th>
                <th>Punkty</th>
              </tr>
            </thead>
            <tbody>
              {classStats.ranking.map((entry, idx) => (
                <tr key={idx} className={idx === 0 ? 'tp-table-row--gold' : ''}>
                  <td className="tp-rank-cell">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                  </td>
                  <td>{entry.name}</td>
                  <td><strong>{entry.points}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Najczęstsze błędy */}
        <div className="tp-card">
          <h3 className="tp-card-title">Najczęstsze błędy klasy</h3>
          {classStats.commonErrors.length === 0 ? (
            <p className="tp-empty-state">Brak danych o błędach.</p>
          ) : (
            <ol className="tp-errors-list">
              {classStats.commonErrors.map((err, idx) => (
                <li key={idx} className="tp-error-item">
                  <span className="tp-error-badge">{idx + 1}</span>
                  {err}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Komponent główny TeacherPanel ─────────────────────────────────────────
function TeacherPanel({
  students,
  studentsLoading,
  studentsError,
  tests,
  testsLoading,
  testsError,
  classStats,
  classes,
  classesLoading,
  classesError,
  selectedClassId,
  onFilterByClass,
  onAssignTest,
  onBulkAssignTest,
  onDeleteTest,
  onCreateClass,
  onUpdateClass,
  onDeleteClass,
  onAddStudentsToClass,
  onRemoveStudentFromClass,
  allStudents, // dla ClassManagement
  classStudentsData, // dane z tabeli class_students
  onExportResults,
  isAdmin = false, // czy panel admina
  onDeleteUser = null, // funkcja usuwania użytkownika (tylko admin)
  onChangeUserRole = null, // funkcja zmiany roli (tylko admin)
}) {
  const TABS = [
    { id: 'students', label: 'Lista uczniów' },
    { id: 'tests',    label: 'Testy' },
    { id: 'grading',  label: 'Ocena' },
    { id: 'classes',  label: 'Zarządzanie klasami' },
    { id: 'stats',    label: 'Statystyki klasy' },
  ]

  const [activeTab, setActiveTab] = useState('students')

  return (
    <div className="tp-root">
      <nav className="tp-nav" role="tablist">
        {TABS.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tp-nav-item ${activeTab === tab.id ? 'tp-nav-item--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="tp-main">
        {activeTab === 'students' && (
          <StudentsSection
            students={students}
            studentsLoading={studentsLoading}
            studentsError={studentsError}
            onExportResults={onExportResults}
            classes={classes}
            selectedClassId={selectedClassId}
            onFilterByClass={onFilterByClass}
            isAdmin={isAdmin}
            onDeleteUser={onDeleteUser}
            onChangeUserRole={onChangeUserRole}
            allStudents={allStudents}
          />
        )}
        {activeTab === 'tests' && (
          <TestsSection
            tests={tests}
            testsLoading={testsLoading}
            testsError={testsError}
            students={students}
            classes={classes}
            onAssignTest={onAssignTest}
            onBulkAssignTest={onBulkAssignTest}
            onDeleteTest={onDeleteTest}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === 'grading' && (
          <>
            {console.log('TeacherPanel: Rendering GradingSection, activeTab =', activeTab)}
            <GradingSection />
          </>
        )}
        {activeTab === 'classes' && (
          <ClassManagement
            classes={classes}
            classesLoading={classesLoading}
            classesError={classesError}
            onCreateClass={onCreateClass}
            onUpdateClass={onUpdateClass}
            onDeleteClass={onDeleteClass}
            onManageStudents={onAddStudentsToClass}
            students={allStudents || students}
            classStudentsData={classStudentsData}
            onRemoveStudentFromClass={onRemoveStudentFromClass}
          />
        )}
        {activeTab === 'stats' && (
          <StatsSection
            classStats={classStats}
            onExportResults={onExportResults}
          />
        )}
      </main>
    </div>
  )
}

export default TeacherPanel
