// --- Tests Section with Oce button ---
function TestsSection({
  tests, testsLoading, testsError,
  students, classes, onAssignTest, onBulkAssignTest, onDeleteTest,
  isAdmin = false,
  gradedTestIds = [],
}) {
  const navigate = useNavigate()
  const [assignModal, setAssignModal] = useState(null)
  const [bulkAssignModal, setBulkAssignModal] = useState(null)
  const [assignedIds, setAssignedIds] = useState([])
  const [testsWithAssignments, setTestsWithAssignments] = useState([])

  const handleAssign = async (studentId) => {
    await onAssignTest(assignModal, studentId)
    setAssignedIds(prev => [...prev, studentId])
  }

  const handleBulkAssign = (testId) => {
    setBulkAssignModal(testId)
  }

  const formatDate = (iso) => {
    if (!iso) return '---'
    return new Date(iso).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Pobierz testy z przypisaniami
  useEffect(() => {
    const fetchTestsWithAssignments = async () => {
      if (!tests || tests.length === 0) {
        setTestsWithAssignments([])
        return
      }

      const testIds = tests.map(t => t.id)
      const { data } = await supabase
        .from('assignments')
        .select('test_id')
        .in('test_id', testIds)
        .in('status', ['completed', 'graded'])

      const testIdsWithAssignments = new Set(data?.map(a => a.test_id) || [])
      const testsWith = tests.map(t => ({
        ...t,
        hasAssignments: testIdsWithAssignments.has(t.id)
      }))

      setTestsWithAssignments(testsWith)
    }

    fetchTestsWithAssignments()
  }, [tests])

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
            + Utworz test
          </button>
        </div>
      </div>

      {/* Stany ładowania / błędy */}
      {testsLoading && <p className="tp-status-msg tp-status-msg--loading">Ładowanie testów…</p>}
      {testsError   && <p className="tp-status-msg tp-status-msg--error">Błąd: {testsError}</p>}

      {/* Lista testów */}
      {!testsLoading && !testsError && (
        <div className="tp-exercises-list">
          {tests.length === 0 && (
            <p className="tp-empty-state">Brak testów. Utwórz pierwszy test powyżej.</p>
          )}
          {tests.map(test => {
            const hasAssignments = testsWithAssignments.some(t => t.id === test.id)

            return (
              <div key={test.id} className={`tp-exercise-item tp-card ${gradedTestIds.includes(test.id) ? 'tp-exercise-item--graded' : ''}`}>
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
                    className="tp-btn tp-btn--ghost tp-btn--sm"
                    onClick={handleBulkAssign(test.id)}
                  >
                    Przypisz masowo
                  </button>
                  {hasAssignments && (
                    <button
                      className="tp-btn tp-btn--primary tp-btn--sm"
                      onClick={() => setGradingModal({ testId: test.id, assignmentId: null })}
                    >
                      Oce
                    </button>
                  )}
                  {!hasAssignments && (
                    <button
                      className="tp-btn tp-btn--ghost tp-btn--sm"
                      onClick={() => { setAssignModal(test.id); setAssignedIds([]) }}
                    >
                      Przypisz uczniowi
                    </button>
                  )}
                  <button
                    className="tp-btn tp-btn--ghost tp-btn--sm tp-btn--danger"
                    onClick={() => onDeleteTest(test.id)}
                  >
                    Usu
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TestsSection
