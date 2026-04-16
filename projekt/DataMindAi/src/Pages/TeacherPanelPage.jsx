import { useState, useEffect } from 'react'
import SidebarHeader from '../Components/SidebarHeader'
import TeacherPanel from '../Components/TeacherPanel'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'

function TeacherPanelPage() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // ── Uczniowie ────────────────────────────────────────────────────────────
  const [students, setStudents] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(true)
  const [studentsError, setStudentsError] = useState(null)

  useEffect(() => {
    const fetchStudents = async () => {
      setStudentsLoading(true)
      setStudentsError(null)

      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, sql_level')
        .eq('role', 'uczen')
        .order('name', { ascending: true })

      if (error) { setStudentsError(error.message); setStudentsLoading(false); return }

      setStudents((data ?? []).map(p => ({
        id:             p.id,
        name:           p.name ?? 'Brak nazwy',
        level:          p.sql_level ?? 'beginner',
        lastActive:     '—',
        completedTasks: 0,
        errors:         [],
      })))
      setStudentsLoading(false)
    }
    fetchStudents()
  }, [])

  // ── Testy ────────────────────────────────────────────────────────────────
  const [tests, setTests] = useState([])
  const [testsLoading, setTestsLoading] = useState(true)
  const [testsError, setTestsError] = useState(null)

  const fetchTests = async () => {
    setTestsLoading(true)
    setTestsError(null)

    const { data, error } = await supabase
      .from('tests')
      .select('id, title, difficulty, skill, created_at')
      .order('created_at', { ascending: false })

    if (error) { setTestsError(error.message); setTestsLoading(false); return }
    setTests(data ?? [])
    setTestsLoading(false)
  }

  useEffect(() => { fetchTests() }, [])

  // ── Callbacki ─────────────────────────────────────────────────────────────

  const handleCreateTest = async (formData) => {
    const { error } = await supabase
      .from('tests')
      .insert({
        title:        formData.title,
        description:  formData.description,
        expected_sql: formData.expectedSql,
        difficulty:   formData.difficulty,
        skill:        formData.skill,
        created_by:   user.id,
      })

    if (error) { alert('Błąd zapisu testu: ' + error.message); return }
    fetchTests()
  }

  const handleGenerateWithAI = (skill, difficulty, count) => {
    // TODO: podpiąć pod /api/ai/generate-tests gdy endpoint będzie gotowy
    console.log('generateWithAI', { skill, difficulty, count })
  }

  const handleAssignTest = async (testId, studentId) => {
    const { data: existing } = await supabase
      .from('assignments')
      .select('id')
      .eq('test_id', testId)
      .eq('student_id', studentId)
      .maybeSingle()

    if (existing) { alert('Ten test jest już przypisany temu uczniowi.'); return }

    const { error } = await supabase
      .from('assignments')
      .insert({
        test_id:     testId,
        student_id:  studentId,
        assigned_by: user.id,
        status:      'pending',
      })

    if (error) { alert('Błąd przypisania testu: ' + error.message); return }
  }

  const handleExportResults = (format) => {
    // TODO: GET /api/export?format=csv|pdf
    console.log('exportResults', format)
  }

  const mockClassStats = {
    totalStudents: students.length,
    avgScore:      0,
    weeklyTasks:   0,
    ranking:       [],
    commonErrors:  [],
  }

  return (
    <SidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} noPadding>
      <TeacherPanel
        students={students}
        studentsLoading={studentsLoading}
        studentsError={studentsError}
        tests={tests}
        testsLoading={testsLoading}
        testsError={testsError}
        classStats={mockClassStats}
        onCreateTest={handleCreateTest}
        onGenerateWithAI={handleGenerateWithAI}
        onAssignTest={handleAssignTest}
        onExportResults={handleExportResults}
      />
    </SidebarHeader>
  )
}

export default TeacherPanelPage
