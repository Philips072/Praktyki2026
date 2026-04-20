import { useState, useEffect } from 'react'
import './TeacherPanel.css'

function StudentSelector({
  students,
  selectedIds,
  onSelectionChange,
  multiSelect = true,
  showSelectAll = true
}) {
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    setSelectAll(selectedIds.length === students.length && students.length > 0)
  }, [selectedIds, students.length])

  const handleToggle = (studentId) => {
    if (multiSelect) {
      if (selectedIds.includes(studentId)) {
        onSelectionChange(selectedIds.filter(id => id !== studentId))
      } else {
        onSelectionChange([...selectedIds, studentId])
      }
    } else {
      onSelectionChange(selectedIds.includes(studentId) ? [] : [studentId])
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectionChange([])
    } else {
      onSelectionChange(students.map(s => s.id))
    }
  }

  if (students.length === 0) {
    return <p className="tp-empty-state">Brak uczniów do wyboru.</p>
  }

  return (
    <div className="tp-student-selector">
      {showSelectAll && students.length > 1 && (
        <div className="tp-bulk-actions">
          <label className="tp-checkbox-label">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            Zaznacz wszystkich ({students.length})
          </label>
          {selectedIds.length > 0 && (
            <span className="tp-bulk-actions-counter">
              Wybrano: {selectedIds.length}
            </span>
          )}
        </div>
      )}

      <ul className="tp-students-list">
        {students.map(student => (
          <li key={student.id} className="tp-student-list-item">
            <label className="tp-checkbox-label">
              <input
                type={multiSelect ? 'checkbox' : 'radio'}
                checked={selectedIds.includes(student.id)}
                onChange={() => handleToggle(student.id)}
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
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default StudentSelector