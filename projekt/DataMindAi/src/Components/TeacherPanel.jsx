import { useState } from 'react'
import StudentDetail from './StudentDetail'
import ClassManagement from './ClassManagement'
import BulkAssignmentModal from './BulkAssignmentModal'
import StudentSelector from './StudentSelector'
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
  selectedStudentIds,
  onStudentSelectionChange
}) {
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [viewMode, setViewMode] = useState('table') // 'table' | 'cards'
  const [bulkMode, setBulkMode] = useState(false) // true/false for bulk selection

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

  const toggleBulkMode = () => {
    setBulkMode(!bulkMode)
    if (bulkMode) {
      onStudentSelectionChange([])
    }
  }

  const handleToggleStudent = (studentId) => {
    if (selectedStudentIds.includes(studentId)) {
      onStudentSelectionChange(selectedStudentIds.filter(id => id !== studentId))
    } else {
      onStudentSelectionChange([...selectedStudentIds, studentId])
    }
  }

  const handleSelectAll = () => {
    if (selectedStudentIds.length === students.length) {
      onStudentSelectionChange([])
    } else {
      onStudentSelectionChange(students.map(s => s.id))
    }
  }

  return (
    <div className="tp-section">
      <div className="tp-section-header">
        <h2 className="tp-section-title">Lista uczniów <span className="tp-student-count">({students.length})</span></h2>
        <div className="tp-section-actions">
          {/* Filtrowanie po klasach */}
          <select
            className="tp-input tp-select"
            value={selectedClassId || 'all'}
            onChange={(e) => onFilterByClass(e.target.value === 'all' ? null : e.target.value)}
          >
            <option value="all">Wszystkie klasy</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>

          {/* Toggle bulk selection */}
          <button
            className={`tp-btn ${bulkMode ? 'tp-btn--primary' : 'tp-btn--ghost'}`}
            onClick={toggleBulkMode}
          >
            {bulkMode ? '✓ Wybór masowy' : 'Wybór masowy'}
          </button>

          {/* Przełącznik widoku tabela/karty */}
          <button
            className={`tp-view-btn ${viewMode === 'table' ? 'tp-view-btn--active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Widok tabeli"
          >
            ☰
          </button>
          <button
            className={`tp-view-btn ${viewMode === 'cards' ? 'tp-view-btn--active' : ''}`}
            onClick={() => setViewMode('cards')}
            title="Widok kart"
          >
            ⊞
          </button>
          <button className="tp-btn tp-btn--export tp-btn--export-csv" onClick={() => onExportResults('csv')}>
            <IconCSV /> Eksport CSV
          </button>
          <button className="tp-btn tp-btn--export tp-btn--export-pdf" onClick={() => onExportResults('pdf')}>
            <IconPDF /> Eksport PDF
          </button>
        </div>
      </div>

      {/* Bulk actions when in bulk mode */}
      {bulkMode && (
        <div className="tp-bulk-actions">
          <label className="tp-checkbox-label">
            <input
              type="checkbox"
              checked={selectedStudentIds.length === students.length}
              onChange={handleSelectAll}
            />
            Zaznacz wszystkich
          </label>
          {selectedStudentIds.length > 0 && (
            <div className="tp-bulk-actions-menu">
              <span>Zaznaczono {selectedStudentIds.length} uczniów</span>
            </div>
          )}
        </div>
      )}

      {/* Widok tabeli — na mobile automatycznie zamienia się w karty przez CSS */}
      {viewMode === 'table' ? (
        <div className="tp-table-wrapper">
          <table className="tp-table">
            <thead>
              <tr>
                {bulkMode && <th></th>}
                <th>Imię i nazwisko</th>
                <th>Klasa</th>
                <th>Poziom</th>
                <th>Ostatnia aktywność</th>
                <th>Postęp</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="tp-table-row">
                  {bulkMode && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(student.id)}
                        onChange={() => handleToggleStudent(student.id)}
                      />
                    </td>
                  )}
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
                    <button
                      className="tp-btn tp-btn--ghost tp-btn--sm"
                      onClick={() => setSelectedStudent(student)}
                    >
                      Szczegóły
                    </button>
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
              onClick={() => !bulkMode && setSelectedStudent(student)}
            >
              {bulkMode && (
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <input
                    type="checkbox"
                    checked={selectedStudentIds.includes(student.id)}
                    onChange={() => handleToggleStudent(student.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
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
      {selectedStudent && !bulkMode && (
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
  students, classes, onCreateTest, onGenerateWithAI, onAssignTest, onBulkAssignTest,
}) {
  const [formMode, setFormMode] = useState(null) // null | 'manual' | 'ai'
  const [saving, setSaving] = useState(false)
  const [assignModal, setAssignModal] = useState(null) // id testu do przypisania
  const [bulkAssignModal, setBulkAssignModal] = useState(null) // id testu do masowego przypisania
  const [assignedIds, setAssignedIds] = useState([])   // uczniowie już przypisani w tej sesji

  const [manualForm, setManualForm] = useState({
    title: '', description: '', expectedSql: '', difficulty: 'easy', skill: '',
  })
  const [aiForm, setAiForm] = useState({ skill: '', difficulty: 'easy', count: 1 })

  const difficultyLabel = { easy: 'Łatwy', medium: 'Średni', hard: 'Trudny' }

  const resetManual = () => setManualForm({ title: '', description: '', expectedSql: '', difficulty: 'easy', skill: '' })

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onCreateTest(manualForm)
    resetManual()
    setFormMode(null)
    setSaving(false)
  }

  const handleAiSubmit = (e) => {
    e.preventDefault()
    onGenerateWithAI(aiForm.skill, aiForm.difficulty, Number(aiForm.count))
    setAiForm({ skill: '', difficulty: 'easy', count: 1 })
    setFormMode(null)
  }

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
            className={`tp-btn tp-btn--primary ${formMode === 'manual' ? 'tp-btn--active' : ''}`}
            onClick={() => setFormMode(formMode === 'manual' ? null : 'manual')}
          >
            + Utwórz ręcznie
          </button>
          <button
            className={`tp-btn tp-btn--ai ${formMode === 'ai' ? 'tp-btn--active' : ''}`}
            onClick={() => setFormMode(formMode === 'ai' ? null : 'ai')}
          >
            ✦ Wygeneruj przez AI
          </button>
        </div>
      </div>

      {/* Formularz ręcznego tworzenia testu */}
      {formMode === 'manual' && (
        <form className="tp-form tp-card" onSubmit={handleManualSubmit}>
          <h3 className="tp-form-title">Nowy test</h3>
          <div className="tp-form-group">
            <label className="tp-label">Nazwa testu</label>
            <input
              className="tp-input"
              value={manualForm.title}
              onChange={e => setManualForm({ ...manualForm, title: e.target.value })}
              placeholder="np. Test umiejętności JOIN"
              required
            />
          </div>
          <div className="tp-form-group">
            <label className="tp-label">Opis / instrukcja dla ucznia</label>
            <textarea
              className="tp-input tp-textarea"
              value={manualForm.description}
              onChange={e => setManualForm({ ...manualForm, description: e.target.value })}
              placeholder="Opisz jaką umiejętność SQL sprawdza ten test i co uczeń ma wykonać…"
              rows={4}
              required
            />
          </div>
          <div className="tp-form-group">
            <label className="tp-label">Oczekiwane zapytanie SQL</label>
            <textarea
              className="tp-input tp-textarea tp-textarea--code"
              value={manualForm.expectedSql}
              onChange={e => setManualForm({ ...manualForm, expectedSql: e.target.value })}
              placeholder="SELECT * FROM tabela WHERE ..."
              rows={3}
              spellCheck={false}
            />
          </div>
          <div className="tp-form-row">
            <div className="tp-form-group">
              <label className="tp-label">Poziom trudności</label>
              <select
                className="tp-input tp-select"
                value={manualForm.difficulty}
                onChange={e => setManualForm({ ...manualForm, difficulty: e.target.value })}
              >
                <option value="easy">Łatwy</option>
                <option value="medium">Średni</option>
                <option value="hard">Trudny</option>
              </select>
            </div>
            <div className="tp-form-group">
              <label className="tp-label">Sprawdzana umiejętność</label>
              <input
                className="tp-input"
                value={manualForm.skill}
                onChange={e => setManualForm({ ...manualForm, skill: e.target.value })}
                placeholder="np. JOIN, GROUP BY, podzapytania…"
              />
            </div>
          </div>
          <div className="tp-form-actions">
            <button type="submit" className="tp-btn tp-btn--primary" disabled={saving}>
              {saving ? 'Zapisywanie…' : 'Zapisz test'}
            </button>
            <button type="button" className="tp-btn tp-btn--ghost" onClick={() => { resetManual(); setFormMode(null) }}>
              Anuluj
            </button>
          </div>
        </form>
      )}

      {/* Formularz generowania testów przez AI */}
      {formMode === 'ai' && (
        <form className="tp-form tp-card tp-form--ai" onSubmit={handleAiSubmit}>
          <h3 className="tp-form-title">✦ Generuj testy przez AI</h3>
          <div className="tp-form-row">
            <div className="tp-form-group">
              <label className="tp-label">Umiejętność do sprawdzenia</label>
              <input
                className="tp-input"
                value={aiForm.skill}
                onChange={e => setAiForm({ ...aiForm, skill: e.target.value })}
                placeholder="np. GROUP BY, podzapytania…"
                required
              />
            </div>
            <div className="tp-form-group">
              <label className="tp-label">Poziom trudności</label>
              <select
                className="tp-input tp-select"
                value={aiForm.difficulty}
                onChange={e => setAiForm({ ...aiForm, difficulty: e.target.value })}
              >
                <option value="easy">Łatwy</option>
                <option value="medium">Średni</option>
                <option value="hard">Trudny</option>
              </select>
            </div>
            <div className="tp-form-group">
              <label className="tp-label">Liczba testów</label>
              <input
                className="tp-input" type="number" min={1} max={10}
                value={aiForm.count}
                onChange={e => setAiForm({ ...aiForm, count: e.target.value })}
              />
            </div>
          </div>
          <div className="tp-form-actions">
            <button type="submit" className="tp-btn tp-btn--ai">Generuj</button>
            <button type="button" className="tp-btn tp-btn--ghost" onClick={() => setFormMode(null)}>Anuluj</button>
          </div>
        </form>
      )}

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
                  <span className={`tp-badge tp-badge--difficulty-${test.difficulty}`}>
                    {difficultyLabel[test.difficulty] || test.difficulty}
                  </span>
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
          <button className="tp-btn tp-btn--export tp-btn--export-csv" onClick={() => onExportResults('csv')}>
            <IconCSV /> Eksport CSV
          </button>
          <button className="tp-btn tp-btn--export tp-btn--export-pdf" onClick={() => onExportResults('pdf')}>
            <IconPDF /> Eksport PDF
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
  selectedStudentIds,
  onStudentSelectionChange,
  onCreateTest,
  onGenerateWithAI,
  onAssignTest,
  onBulkAssignTest,
  onCreateClass,
  onUpdateClass,
  onDeleteClass,
  onAddStudentsToClass,
  onRemoveStudentFromClass,
  allStudents, // dla ClassManagement
  classStudentsData, // dane z tabeli class_students
  onExportResults,
}) {
  const TABS = [
    { id: 'students', label: 'Lista uczniów' },
    { id: 'tests',    label: 'Testy' },
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
            selectedStudentIds={selectedStudentIds}
            onStudentSelectionChange={onStudentSelectionChange}
          />
        )}
        {activeTab === 'tests' && (
          <TestsSection
            tests={tests}
            testsLoading={testsLoading}
            testsError={testsError}
            students={students}
            classes={classes}
            onCreateTest={onCreateTest}
            onGenerateWithAI={onGenerateWithAI}
            onAssignTest={onAssignTest}
            onBulkAssignTest={onBulkAssignTest}
          />
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
