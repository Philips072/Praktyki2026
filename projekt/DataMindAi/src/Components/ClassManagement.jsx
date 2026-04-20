import { useState } from 'react'
import './TeacherPanel.css'

function ClassManagement({
  classes,
  classesLoading,
  classesError,
  onCreateClass,
  onUpdateClass,
  onDeleteClass,
  onManageStudents,
  students,
  classStudentsData,
  onRemoveStudentFromClass
}) {
  const [formMode, setFormMode] = useState(null) // null | 'create' | 'edit'
  const [selectedClass, setSelectedClass] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [manageModal, setManageModal] = useState(null) // classId

  const validateClassName = (name) => {
    const pattern = /^[0-9][a-zA-Z]{1,2}$/
    if (!pattern.test(name)) {
      alert('Nieprawidłowy format nazwy klasy. Użyj formatu: cyfra + 1-2 litery (np. 2a, 10b)')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateClassName(formData.name)) return

    if (formMode === 'create') {
      await onCreateClass(formData)
    } else {
      await onUpdateClass(selectedClass.id, formData)
    }

    setFormData({ name: '', description: '' })
    setFormMode(null)
    setSelectedClass(null)
  }

  const handleEditClass = (cls) => {
    setSelectedClass(cls)
    setFormData({ name: cls.name, description: cls.description || '' })
    setFormMode('edit')
  }

  const handleDeleteClass = async (classId) => {
    await onDeleteClass(classId)
    if (manageModal === classId) setManageModal(null)
  }

  const openManageModal = (classId) => {
    setManageModal(classId)
  }

  if (classesLoading) return (
    <div className="tp-section">
      <p className="tp-status-msg tp-status-msg--loading">Ładowanie klas…</p>
    </div>
  )

  if (classesError) return (
    <div className="tp-section">
      <p className="tp-status-msg tp-status-msg--error">Błąd: {classesError}</p>
    </div>
  )

  return (
    <div className="tp-section">
      <div className="tp-section-header">
        <h2 className="tp-section-title">
          Zarządzanie klasami <span className="tp-student-count">({classes.length})</span>
        </h2>
        <button
          className={`tp-btn tp-btn--primary ${formMode === 'create' ? 'tp-btn--active' : ''}`}
          onClick={() => setFormMode(formMode === 'create' ? null : 'create')}
        >
          + Nowa klasa
        </button>
      </div>

      {/* Formularz tworzenia/edycji klasy */}
      {formMode && (
        <form className="tp-form tp-card" onSubmit={handleSubmit}>
          <h3 className="tp-form-title">
            {formMode === 'create' ? 'Nowa klasa' : 'Edytuj klasę'}
          </h3>
          <div className="tp-form-group">
            <label className="tp-label">Nazwa klasy</label>
            <input
              className="tp-input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="np. 2a, 3b, 1cA"
              pattern="[0-9][a-zA-Z]{1,2}"
              required
            />
            <small className="tp-input-hint">
              Format: cyfra + 1-2 litery (np. 2a, 10b)
            </small>
          </div>
          <div className="tp-form-group">
            <label className="tp-label">Opis (opcjonalnie)</label>
            <textarea
              className="tp-input tp-textarea"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Dodatkowe informacje o klasie..."
              rows={3}
            />
          </div>
          <div className="tp-form-actions">
            <button type="submit" className="tp-btn tp-btn--primary">
              {formMode === 'create' ? 'Utwórz klasę' : 'Zapisz zmiany'}
            </button>
            <button
              type="button"
              className="tp-btn tp-btn--ghost"
              onClick={() => { setFormMode(null); setFormData({ name: '', description: '' }); setSelectedClass(null) }}
            >
              Anuluj
            </button>
          </div>
        </form>
      )}

      {/* Lista klas */}
      {classes.length === 0 && !formMode && (
        <p className="tp-empty-state">
          Brak klas. Utwórz pierwszą klasę klikając przycisk "Nowa klasa".
        </p>
      )}

      {classes.length > 0 && (
        <div className="tp-classes-grid">
          {classes.map(cls => (
            <div key={cls.id} className="tp-class-card tp-card">
              <div className="tp-class-card-header">
                <h3 className="tp-class-name">{cls.name}</h3>
                <div className="tp-class-actions">
                  <button
                    className="tp-btn tp-btn--ghost tp-btn--sm"
                    onClick={() => handleEditClass(cls)}
                  >
                    Edytuj
                  </button>
                  <button
                    className="tp-btn tp-btn--ghost tp-btn--sm"
                    onClick={() => openManageModal(cls.id)}
                  >
                    Uczniowie ({cls.studentCount})
                  </button>
                  <button
                    className="tp-btn tp-btn--ghost tp-btn--sm tp-btn--danger"
                    onClick={() => handleDeleteClass(cls.id)}
                  >
                    Usuń
                  </button>
                </div>
              </div>
              {cls.description && (
                <p className="tp-class-description">{cls.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal zarządzania uczniami w klasie */}
      {manageModal && (
        <ClassStudentsModal
          classId={manageModal}
          className={classes.find(c => c.id === manageModal)?.name}
          onClose={() => setManageModal(null)}
          onManageStudents={onManageStudents}
          allStudents={students}
          classStudentsData={classStudentsData}
          onRemoveStudentFromClass={onRemoveStudentFromClass}
        />
      )}
    </div>
  )
}

// Komponent modalu zarządzania uczniami w klasie
function ClassStudentsModal({ classId, className, onClose, onManageStudents, allStudents, classStudentsData, onRemoveStudentFromClass }) {
  const [activeTab, setActiveTab] = useState('current') // 'current' | 'add'
  const [studentIdsToAdd, setStudentIdsToAdd] = useState([])
  const [loading, setLoading] = useState(false)

  // Students currently in the class (filtered by both class_id in profiles AND class_students table)
  // We need to check both because the current implementation uses two different approaches
  const currentStudentsFromProfiles = allStudents.filter(student => student.classId === classId)
  const currentStudentIdsFromProfiles = currentStudentsFromProfiles.map(s => s.id)

  // Also check if there are students in class_students but not in profiles.class_id
  const currentStudentIdsFromClassStudents = classStudentsData
    ?.filter(cs => cs.class_id === classId)
    ?.map(cs => cs.student_id) || []

  // Combine both lists and remove duplicates
  const allCurrentStudentIds = [...new Set([...currentStudentIdsFromProfiles, ...currentStudentIdsFromClassStudents])]

  // Get full student objects for students currently in the class
  const currentStudents = allStudents.filter(student =>
    allCurrentStudentIds.includes(student.id)
  )

  // Students available to add (not in this class)
  const availableStudents = allStudents.filter(student =>
    !allCurrentStudentIds.includes(student.id)
  )

  const handleRemoveStudent = async (studentId) => {
    if (!confirm('Czy na pewno chcesz usunąć tego ucznia z klasy?')) return

    try {
      await onRemoveStudentFromClass(classId, studentId)
      setLoading(false)
    } catch (error) {
      alert('Błąd usuwania ucznia: ' + error.message)
      setLoading(false)
    }
  }

  const handleAddStudents = async () => {
    if (studentIdsToAdd.length === 0) return
    setLoading(true)

    try {
      await onManageStudents(classId, studentIdsToAdd)
      setStudentIdsToAdd([])
      setLoading(false)
    } catch (error) {
      alert('Błąd dodawania uczniów: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <div className="tp-modal-overlay" onClick={onClose}>
      <div className="tp-modal tp-modal--large" onClick={e => e.stopPropagation()}>
        <div className="tp-modal-header">
          <h3 className="tp-modal-title">Zarządzaj uczniami: {className}</h3>
          <button className="tp-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="tp-tabs">
          <button
            className={`tp-tab ${activeTab === 'current' ? 'tp-tab--active' : ''}`}
            onClick={() => setActiveTab('current')}
          >
            Uczniowie w klasie ({currentStudents.length})
          </button>
          <button
            className={`tp-tab ${activeTab === 'add' ? 'tp-tab--active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Dodaj uczniów
          </button>
        </div>

        {activeTab === 'current' && (
          <div className="tp-class-students-section">
            {currentStudents.length === 0 ? (
              <p className="tp-empty-state">Brak uczniów w tej klasie.</p>
            ) : (
              <ul className="tp-students-list">
                {currentStudents.map(student => (
                  <li key={student.id} className="tp-student-list-item">
                    <div className="tp-student-list-item-info">
                      <div className="tp-student-name-cell">
                        <span className="tp-avatar tp-avatar--sm">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                        {student.name}
                      </div>
                      {student.level && (
                        <span className={`tp-badge tp-badge--level-${student.level}`}>
                          {student.level}
                        </span>
                      )}
                    </div>
                    <button
                      className="tp-btn tp-btn--ghost tp-btn--sm tp-btn--danger"
                      onClick={() => handleRemoveStudent(student.id)}
                    >
                      Usuń z klasy
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="tp-class-students-section">
            {availableStudents.length === 0 ? (
              <p className="tp-empty-state">Brak dostępnych uczniów do dodania.</p>
            ) : (
              <>
                <ul className="tp-students-list">
                  {availableStudents.map(student => (
                    <li key={student.id} className="tp-student-list-item">
                      <label className="tp-checkbox-label">
                        <input
                          type="checkbox"
                          checked={studentIdsToAdd.includes(student.id)}
                          onChange={() => {
                            if (studentIdsToAdd.includes(student.id)) {
                              setStudentIdsToAdd(studentIdsToAdd.filter(id => id !== student.id))
                            } else {
                              setStudentIdsToAdd([...studentIdsToAdd, student.id])
                            }
                          }}
                        />
                        <div className="tp-student-list-item-info">
                          <div className="tp-student-name-cell">
                            <span className="tp-avatar tp-avatar--sm">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                            {student.name}
                          </div>
                          {student.className && (
                            <span className="tp-badge tp-badge--class">{student.className}</span>
                          )}
                          {student.level && (
                            <span className={`tp-badge tp-badge--level-${student.level}`}>
                              {student.level}
                            </span>
                          )}
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="tp-form-actions">
                  <button
                    className="tp-btn tp-btn--primary"
                    disabled={studentIdsToAdd.length === 0 || loading}
                    onClick={handleAddStudents}
                  >
                    {loading ? 'Dodawanie…' : `Dodaj wybranych (${studentIdsToAdd.length})`}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="tp-form-actions">
          <button className="tp-btn tp-btn--ghost" onClick={onClose}>
            Zamknij
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClassManagement