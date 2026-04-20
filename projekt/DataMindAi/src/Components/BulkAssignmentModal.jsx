import { useState } from 'react'
import StudentSelector from './StudentSelector'
import './TeacherPanel.css'

function BulkAssignmentModal({ test, students, classes, onAssign, onClose }) {
  const [recipientType, setRecipientType] = useState('students') // 'students' | 'class'
  const [selectedStudentIds, setSelectedStudentIds] = useState([])
  const [selectedClassId, setSelectedClassId] = useState(null)

  const handleAssign = async () => {
    const recipientData = {
      type: recipientType,
      ids: recipientType === 'students' ? selectedStudentIds : [selectedClassId]
    }
    await onAssign(test.id, recipientData)
    onClose()
  }

  const hasSelection = () => {
    return recipientType === 'students'
      ? selectedStudentIds.length > 0
      : selectedClassId !== null
  }

  return (
    <div className="tp-modal-overlay" onClick={onClose}>
      <div className="tp-modal tp-modal--large" onClick={e => e.stopPropagation()}>
        <div className="tp-modal-header">
          <h3 className="tp-modal-title">
            Przypisz test: {test?.title || 'Nieznany test'}
          </h3>
          <button className="tp-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="tp-tabs">
          <button
            className={`tp-tab ${recipientType === 'students' ? 'tp-tab--active' : ''}`}
            onClick={() => {
              setRecipientType('students')
              setSelectedClassId(null)
            }}
          >
            Wybierz uczniów
          </button>
          <button
            className={`tp-tab ${recipientType === 'class' ? 'tp-tab--active' : ''}`}
            onClick={() => {
              setRecipientType('class')
              setSelectedStudentIds([])
            }}
          >
            Wybierz klasę
          </button>
        </div>

        {recipientType === 'students' && (
          <div className="tp-modal-section">
            <h4 className="tp-modal-section-title">
              Wybierz uczniów, którym chcesz przypisać ten test
            </h4>
            <StudentSelector
              students={students}
              selectedIds={selectedStudentIds}
              onSelectionChange={setSelectedStudentIds}
              multiSelect={true}
              showSelectAll={true}
            />
          </div>
        )}

        {recipientType === 'class' && (
          <div className="tp-modal-section">
            <h4 className="tp-modal-section-title">
              Wybierz klasę, której uczniom chcesz przypisać ten test
            </h4>
            {classes.length === 0 ? (
              <p className="tp-empty-state">
                Brak klas. Utwórz najpierw klasę w zakładce "Zarządzanie klasami".
              </p>
            ) : (
              <div className="tp-class-selector">
                {classes.map(cls => (
                  <label key={cls.id} className="tp-class-option">
                    <input
                      type="radio"
                      name="class"
                      value={cls.id}
                      checked={selectedClassId === cls.id}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                    />
                    <div>
                      <strong>{cls.name}</strong>
                      <span>{cls.studentCount} uczniów</span>
                      {cls.description && <small>{cls.description}</small>}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="tp-form-actions">
          <button
            className="tp-btn tp-btn--primary"
            disabled={!hasSelection()}
            onClick={handleAssign}
          >
            {recipientType === 'students'
              ? `Przypisz do ${selectedStudentIds.length} uczniów`
              : `Przypisz do klasy ${classes.find(c => c.id === selectedClassId)?.name}`
            }
          </button>
          <button className="tp-btn tp-btn--ghost" onClick={onClose}>
            Anuluj
          </button>
        </div>
      </div>
    </div>
  )
}

export default BulkAssignmentModal