import { useState, useEffect } from 'react'
import SidebarHeader from '../Components/SidebarHeader'
import TeacherPanel from '../Components/TeacherPanel'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'
import { toast } from 'react-toastify'

function TeacherPanelPage() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // ── Uczniowie ────────────────────────────────────────────────────────────
  const [allStudents, setAllStudents] = useState([])
  const [students, setStudents] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(true)
  const [studentsError, setStudentsError] = useState(null)
  const [selectedClassId, setSelectedClassId] = useState(null)

  const fetchStudents = async () => {
    setStudentsLoading(true)
    setStudentsError(null)

    // Pobierz wszystkich uczniów bez wymagania przypisania do klasy
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, sql_level, class_id, classes(name)')
      .eq('role', 'uczen')
      .order('name', { ascending: true })

    if (error) { setStudentsError(error.message); setStudentsLoading(false); return }

    const studentsList = (data ?? []).map(p => ({
      id:             p.id,
      name:           p.name ?? 'Brak nazwy',
      level:          p.sql_level ?? 'beginner',
      lastActive:     '—',
      completedTasks:  0,
      totalAssigned:  0,
      errors:         [],
      className:      p.classes?.name || null,
      classId:        p.class_id || null,
    }))

    setAllStudents(studentsList)
    setStudentsLoading(false)
  }

  const fetchStudentStats = async () => {
    if (allStudents.length === 0) return

    try {
      // Pobierz wszystkie przypisania dla uczniów
      const { data: assignments, error } = await supabase
        .from('assignments')
        .select('student_id, status, assigned_at')
        .in('student_id', allStudents.map(s => s.id))

      if (error) {
        console.error('Błąd pobierania statystyk uczniów:', error)
        return
      }

      // Grupuj przypisania według uczniów
      const studentStats = {}
      assignments?.forEach(assignment => {
        if (!studentStats[assignment.student_id]) {
          studentStats[assignment.student_id] = {
            totalAssigned: 0,
            completedTasks: 0,
            lastActive: null
          }
        }

        studentStats[assignment.student_id].totalAssigned++
        if (assignment.status === 'completed' || assignment.status === 'graded') {
          studentStats[assignment.student_id].completedTasks++
        }

        // Znajdź ostatnią aktywność
        const activityDate = assignment.assigned_at
        if (!studentStats[assignment.student_id].lastActive ||
            new Date(activityDate) > new Date(studentStats[assignment.student_id].lastActive)) {
          studentStats[assignment.student_id].lastActive = activityDate
        }
      })

      // Zaktualizuj dane uczniów ze statystykami
      setAllStudents(prevStudents => prevStudents.map(student => {
        const stats = studentStats[student.id] || {
          totalAssigned: 0,
          completedTasks: 0,
          lastActive: null
        }

        return {
          ...student,
          totalAssigned: stats.totalAssigned,
          completedTasks: stats.completedTasks,
          lastActive: stats.lastActive
            ? new Date(stats.lastActive).toLocaleDateString('pl-PL', {
                day: 'numeric', month: 'short', year: 'numeric'
              })
            : '—',
          avgScore: 0, // Placeholder - do zaimplementowania po dodaniu pola score do assignments
          score: 0
        }
      }))
    } catch (error) {
      console.error('Błąd w fetchStudentStats:', error)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    if (allStudents.length > 0) {
      fetchStudentStats()
    }
  }, [allStudents.length])

  // ── Klasy ────────────────────────────────────────────────────────────────
  const [classes, setClasses] = useState([])
  const [classesLoading, setClassesLoading] = useState(true)
  const [classesError, setClassesError] = useState(null)
  const [classStudentsData, setClassStudentsData] = useState([]) // Dane z tabeli class_students

  const fetchClasses = async () => {
    setClassesLoading(true)
    setClassesError(null)

    const { data, error } = await supabase
      .from('classes')
      .select('*, class_students(count)')
      .order('name', { ascending: true })

    if (error) { setClassesError(error.message); setClassesLoading(false); return }

    const classesWithCounts = (data ?? []).map(cls => ({
      ...cls,
      studentCount: cls.class_students?.[0]?.count || 0
    }))

    setClasses(classesWithCounts)
    setClassesLoading(false)
  }

  const fetchClassStudents = async () => {
    const { data } = await supabase
      .from('class_students')
      .select('*')

    setClassStudentsData(data ?? [])
  }

  useEffect(() => { fetchClasses() }, [])
  useEffect(() => { fetchClassStudents() }, [classes])

  // ── Testy ────────────────────────────────────────────────────────────────
  const [tests, setTests] = useState([])
  const [testsLoading, setTestsLoading] = useState(true)
  const [testsError, setTestsError] = useState(null)
  const [gradedAssignments, setGradedAssignments] = useState([]) // Ocenione przypisania

  const fetchTests = async () => {
    setTestsLoading(true)
    setTestsError(null)

    const { data, error } = await supabase
      .from('tests')
      .select('id, title, skill, created_at')
      .order('created_at', { ascending: false })

    if (error) { setTestsError(error.message); setTestsLoading(false); return }
    setTests(data ?? [])
    setTestsLoading(false)
  }

  // Pobierz ocenione przypisania
  const fetchGradedAssignments = async () => {
    try {
      const { data: allAssignments, error: allError } = await supabase
        .from('assignments')
        .select('id, status, score')
        .not('score', 'is', null)

      console.log('Wszystkie przypisania z score:', allAssignments)

      if (allError) throw allError

      // Sprawdź czy allAssignments jest tablicą
      const assignmentIds = Array.isArray(allAssignments) && allAssignments.length > 0
        ? allAssignments.map(a => a.id)
        : []

      if (assignmentIds.length === 0) {
        console.log('Brak przypisań z ustawionym wynikiem')
        setGradedAssignments([])
        return
      }

      // Pobierz szczegółowe dane
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          id,
          score,
          assigned_at,
          status,
          student_id,
          tests (
            id,
            title,
            skill
          ),
          profiles!assignments_student_id_fkey (
            id,
            name
          )
        `)
        .in('id', assignmentIds)
        .order('assigned_at', { ascending: false })

      console.log('Szczegółowe przypisania:', data)

      if (error) throw error

      // Po pobraniu szczegółów, zaktualizuj dane z nazwami uczniów
      setGradedAssignments(data ?? [])
    } catch (error) {
      console.error('Błąd pobierania ocenionych przypisań:', error)
    }
  }

  // Pobierz listę ID testów z ocenionymi przypisaniami
  const gradedTestIds = gradedAssignments.map(a => a.tests?.id).filter(Boolean)

  useEffect(() => {
    fetchTests()
    fetchGradedAssignments()
  }, [])

  // ── Callbacki ─────────────────────────────────────────────────────────────

  const handleGenerateWithAI = (skill, count) => {
    // TODO: podpiąć pod /api/ai/generate-tests gdy endpoint będzie gotowy
    console.log('generateWithAI', { skill, count })
  }

  const handleAssignTest = async (testId, studentId) => {
    const { data: existing } = await supabase
      .from('assignments')
      .select('id')
      .eq('test_id', testId)
      .eq('student_id', studentId)
      .maybeSingle()

    if (existing) { toast.warning('Ten test jest już przypisany temu uczniowi.'); return }

    const { error } = await supabase
      .from('assignments')
      .insert({
        test_id:     testId,
        student_id:  studentId,
        assigned_by: user.id,
        status:      'pending',
      })

    if (error) { toast.error('Błąd przypisania testu: ' + error.message); return }
  }

  const handleExportResults = (format) => {
    // TODO: GET /api/export?format=csv|pdf
    console.log('exportResults', format)
  }

  const handleDeleteTest = async (testId) => {
    try {
      // Najpierw sprawdź czy test ma aktywne przypisania
      const { data: assignments } = await supabase
        .from('assignments')
        .select('id')
        .eq('test_id', testId)

      if (assignments && assignments.length > 0) {
        if (!confirm(`Test ma ${assignments.length} przypisania. Czy na pewno chcesz usunąć test wraz z przypisaniami? Ta operacja jest nieodwracalna.`)) {
          return
        }
      } else {
        if (!confirm('Czy na pewno chcesz usunąć ten test? Ta operacja jest nieodwracalna.')) {
          return
        }
      }

      // Najpierw usuń przypisania (jeśli istnieją)
      if (assignments && assignments.length > 0) {
        const { error: deleteAssignmentsError } = await supabase
          .from('assignments')
          .delete()
          .eq('test_id', testId)

        if (deleteAssignmentsError) {
          toast.error('Błąd usuwania przypisań: ' + deleteAssignmentsError.message)
          return
        }
      }

      // Usuń test
      const { error } = await supabase
        .from('tests')
        .delete()
        .eq('id', testId)

      if (error) {
        toast.error('Błąd usuwania testu: ' + error.message)
        return
      }

      toast.success('Test został usunięty.')
      fetchTests()
    } catch (error) {
      toast.error('Błąd usuwania testu: ' + error.message)
    }
  }

  // Oblicz statystyki klasy na podstawie rzeczywistych danych uczniów
  const calculateClassStats = () => {
    const totalStudents = allStudents.length

    // Średnia liczba ukończonych zadań (zamiast nieistniejącego avgScore)
    const studentsWithTasks = allStudents.filter(s => s.completedTasks > 0)
    const avgCompletedTasks = studentsWithTasks.length > 0
      ? Math.round(studentsWithTasks.reduce((sum, s) => sum + s.completedTasks, 0) / studentsWithTasks.length)
      : 0

    // Procent ukończonych zadań względem wszystkich przypisanych
    const totalAssigned = allStudents.reduce((sum, s) => sum + (s.totalAssigned || 0), 0)
    const totalCompleted = allStudents.reduce((sum, s) => sum + (s.completedTasks || 0), 0)
    const completionRate = totalAssigned > 0
      ? Math.round((totalCompleted / totalAssigned) * 100)
      : 0

    // Utwórz ranking uczniów według liczby ukończonych zadań
    const ranking = allStudents
      .filter(s => s.completedTasks > 0)
      .map(s => ({
        name: s.name,
        points: s.completedTasks
      }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 10) // Top 10

    // Oblicz liczbę testów ukończonych w tym tygodniu
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const weeklyTasks = allStudents.reduce((sum, s) => {
      if (s.lastActive && s.lastActive !== '—') {
        try {
          // Parsowanie daty w formacie DD.MM.YYYY
          const parts = s.lastActive.split('.')
          if (parts.length === 3) {
            const lastActiveDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
            if (!isNaN(lastActiveDate.getTime()) && lastActiveDate >= weekAgo) {
              return sum + s.completedTasks
            }
          }
        } catch (e) {
          console.error('Błąd parsowania daty:', e)
        }
      }
      return sum
    }, 0)

    return {
      totalStudents,
      avgScore: completionRate, // Zmienione na wskaźnik ukończenia
      avgCompletedTasks, // Nowa metryka: średnia liczba ukończonych zadań
      weeklyTasks,
      ranking,
      commonErrors: [] // Placeholder - do zaimplementowania po dodaniu tabeli błędów
    }
  }

  const classStats = calculateClassStats()

  // Filtrowanie uczniów według klasy
  const filteredStudents = selectedClassId
    ? allStudents.filter(s => {
        // Sprawdź czy uczeń ma przypisaną klasę w primary class_id lub w class_students
        const hasPrimaryClass = String(s.classId) === String(selectedClassId)
        const hasAssignedClass = classStudentsData.some(
          cs => String(cs.class_id) === String(selectedClassId) && cs.student_id === s.id
        )
        return hasPrimaryClass || hasAssignedClass
      })
    : allStudents

  const handleCreateClass = async (formData) => {
    const { error } = await supabase
      .from('classes')
      .insert({
        name: formData.name,
        description: formData.description,
        created_by: user.id
      })

    if (error) { toast.error('Błąd tworzenia klasy: ' + error.message); return }
    fetchClasses()
  }

  const handleUpdateClass = async (classId, formData) => {
    const { error } = await supabase
      .from('classes')
      .update({
        name: formData.name,
        description: formData.description
      })
      .eq('id', classId)

    if (error) { toast.error('Błąd aktualizacji klasy: ' + error.message); return }
    fetchClasses()
  }

  const handleDeleteClass = async (classId) => {
    if (!confirm('Czy na pewno chcesz usunąć tę klasę? Uczniowie pozostaną w systemie.')) return

    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId)

    if (error) { toast.error('Błąd usuwania klasy: ' + error.message); return }
    fetchClasses()
    if (selectedClassId === classId) setSelectedClassId(null)
  }

  const handleAddStudentsToClass = async (classId, studentIds) => {
    // Check which students are already in the class
    const { data: existingStudents } = await supabase
      .from('class_students')
      .select('student_id')
      .eq('class_id', classId)
      .in('student_id', studentIds)

    const existingStudentIds = existingStudents?.map(es => es.student_id) || []

    // Filter out students who are already in the class
    const newStudentIds = studentIds.filter(id => !existingStudentIds.includes(id))

    if (newStudentIds.length === 0) {
      toast.info('Wszyscy wybrani uczniowie są już w tej klasie.')
      return
    }

    if (newStudentIds.length < studentIds.length) {
      const alreadyInClass = studentIds.length - newStudentIds.length
      toast.info(`${alreadyInClass} uczniów jest już w tej klasie. Dodam pozostałych ${newStudentIds.length}.`)
    }

    // Insert only new students
    const { error } = await supabase
      .from('class_students')
      .insert(
        newStudentIds.map(studentId => ({
          class_id: classId,
          student_id: studentId,
          added_by: user.id
        }))
      )

    if (error) {
      toast.error('Błąd dodawania uczniów: ' + error.message)
      return
    }

    // Update class_id in profiles for all students in the class (to keep consistency)
    // First, get all students currently in this class
    const { data: allClassStudents } = await supabase
      .from('class_students')
      .select('student_id')
      .eq('class_id', classId)

    if (allClassStudents && allClassStudents.length > 0) {
      const allStudentIdsInClass = allClassStudents.map(cs => cs.student_id)

      // Update class_id in profiles for all students in this class
      await supabase
        .from('profiles')
        .update({ class_id: classId })
        .in('id', allStudentIdsInClass)
    }

    toast.success(`Pomyślnie dodano ${newStudentIds.length} uczniów do klasy.`)
    fetchClasses()
    fetchStudents()
  }

  const handleRemoveStudentFromClass = async (classId, studentId) => {
    const { error } = await supabase
      .from('class_students')
      .delete()
      .eq('class_id', classId)
      .eq('student_id', studentId)

    if (error) { toast.error('Błąd usuwania ucznia: ' + error.message); return }

    // Update class_id in profiles to NULL when removing student from class
    await supabase
      .from('profiles')
      .update({ class_id: null })
      .eq('id', studentId)

    fetchClasses()
    fetchStudents()
  }

  const handleBulkAssignTest = async (testId, recipientData) => {
    // recipientData: { type: 'students'|'class', ids: [] }
    let studentIds = []

    if (recipientData.type === 'class') {
      const { data: classStudents } = await supabase
        .from('class_students')
        .select('student_id')
        .eq('class_id', recipientData.ids[0])

      studentIds = classStudents?.map(cs => cs.student_id) || []
    } else {
      studentIds = recipientData.ids
    }

    // Check for existing assignments
    const { data: existing } = await supabase
      .from('assignments')
      .select('student_id')
      .eq('test_id', testId)
      .in('student_id', studentIds)

    const existingIds = existing?.map(e => e.student_id) || []
    const newStudentIds = studentIds.filter(id => !existingIds.includes(id))

    if (newStudentIds.length === 0) {
      toast.info('Wszyscy wybrani uczniowie mają już przypisany ten test.')
      return
    }

    const { error } = await supabase
      .from('assignments')
      .insert(
        newStudentIds.map(studentId => ({
          test_id: testId,
          student_id: studentId,
          assigned_by: user.id,
          status: 'pending'
        }))
      )

    if (error) { toast.error('Błąd masowego przypisania: ' + error.message); return }
    toast.success(`Pomyślnie przypisano test do ${newStudentIds.length} uczniów.`)
    // Odśwież statystyki po przypisaniu
    fetchStudentStats()
  }

  // Funkcja pobierająca historię wyników ucznia
  const handleFetchStudentHistory = async (studentId) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          id,
          score,
          assigned_at,
          question_answers,
          tests (
            id,
            title,
            questions
          )
        `)
        .eq('student_id', studentId)
        .not('score', 'is', null)
        .order('assigned_at', { ascending: true })

      if (error) throw error

      // Przekształć dane do formatu wykresu
      const history = (data || []).map(item => ({
        date: item.assigned_at,
        score: item.score,
        testName: item.tests?.title || 'Test'
      }))

      // Analizuj błędy ucznia
      const errors = analyzeStudentErrors(data || [])

      return { history, errors }
    } catch (error) {
      console.error('Błąd pobierania historii ucznia:', error)
      return { history: [], errors: [] }
    }
  }

  // Funkcja analizująca najczęstsze błędy ucznia
  const analyzeStudentErrors = (assignments) => {
    const errorCounts = {}

    assignments.forEach(assignment => {
      const questions = assignment.tests?.questions || []
      const answers = assignment.question_answers || []

      questions.forEach(question => {
        const answer = answers.find(a => a.questionId === question.id)
        if (!answer || !answer.answer) return

        let isError = false
        let errorDescription = ''

        if (question.type === 'sql') {
          const expectedSql = question.expectedSql || question.expected_sql
          if (expectedSql) {
            const expectedClean = expectedSql.trim().replace(/\s+/g, ' ').toLowerCase()
            const answerClean = answer.answer.trim().replace(/\s+/g, ' ').toLowerCase()
            isError = expectedClean !== answerClean

            if (isError) {
              // Zidentyfikuj rodzaj błędu SQL
              const errorType = identifySQLErrorType(answer.answer, expectedSql)
              errorDescription = errorType || 'Błędne zapytanie SQL'
            }
          }
        } else if (question.type === 'multiple_choice' || question.type === 'true_false') {
          isError = answer.answer !== question.correctAnswer

          if (isError) {
            const correctText = question.type === 'true_false'
              ? (question.correctAnswer === 'true' ? 'Prawda' : 'Fałsz')
              : question.correctAnswer
            const answerText = question.type === 'true_false'
              ? (answer.answer === 'true' ? 'Prawda' : 'Fałsz')
              : answer.answer
            errorDescription = `Wybrano: ${answerText}, poprawne: ${correctText}`
          }
        }

        if (isError && errorDescription) {
          const key = `${question.id}-${question.type}`
          if (!errorCounts[key]) {
            errorCounts[key] = {
              description: errorDescription,
              count: 0,
              questionType: question.type,
              questionTitle: question.title?.substring(0, 50) + (question.title?.length > 50 ? '...' : '')
            }
          }
          errorCounts[key].count++
        }
      })
    })

    // Zwróć posortowaną listę najczęstszych błędów
    return Object.values(errorCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 najczęstszych błędów
      .map(e => ({
        ...e,
        formatted: `${e.questionType === 'sql' ? 'SQL' : e.questionType === 'multiple_choice' ? 'Wybór' : 'P/F'}: ${e.description}`
      }))
  }

  // Funkcja identyfikująca rodzaj błędu SQL
  const identifySQLErrorType = (answer, expected) => {
    const answerLower = answer.toLowerCase()
    const expectedLower = expected.toLowerCase()

    // Brak FROM
    if (expectedLower.includes(' from ') && !answerLower.includes(' from ')) {
      return 'Brak klauzuli FROM'
    }
    // Brak WHERE
    if (expectedLower.includes(' where ') && !answerLower.includes(' where ')) {
      return 'Brak klauzuli WHERE'
    }
    // Błędna nazwa tabeli
    if (!answerLower.includes(expectedLower.match(/from\s+(\w+)/)?.[1])) {
      return 'Błędna nazwa tabeli'
    }
    // Błędna nazwa kolumny
    const expectedColumns = expectedLower.match(/select\s+(.+?)\s+from/)?.[1] || ''
    const answerColumns = answerLower.match(/select\s+(.+?)\s+from/)?.[1] || ''
    if (expectedColumns && answerColumns && expectedColumns !== answerColumns) {
      return 'Błędne kolumny w SELECT'
    }
    // Złe użycie operatorów
    if (expectedLower.includes('=') && !answerLower.includes('=')) {
      return 'Brak operatora porównania'
    }
    // Brak GROUP BY
    if (expectedLower.includes(' group by ') && !answerLower.includes(' group by ')) {
      return 'Brak klauzuli GROUP BY'
    }
    // Brak ORDER BY
    if (expectedLower.includes(' order by ') && !answerLower.includes(' order by ')) {
      return 'Brak klauzuli ORDER BY'
    }
    // Błędny JOIN
    if ((expectedLower.includes(' join ') || expectedLower.includes(' inner join ') || expectedLower.includes(' left join '))
        && !(answerLower.includes(' join ') || answerLower.includes(' inner join ') || answerLower.includes(' left join '))) {
      return 'Błędne użycie JOIN'
    }

    return null
  }

  return (
    <SidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} noPadding>
      <TeacherPanel
        students={filteredStudents}
        allStudents={allStudents}
        studentsLoading={studentsLoading}
        studentsError={studentsError}
        tests={tests}
        testsLoading={testsLoading}
        testsError={testsError}
        gradedTestIds={gradedTestIds}
        gradedAssignments={gradedAssignments}
        gradedAssignmentsLoading={false}
        classStats={classStats}
        classes={classes}
        classesLoading={classesLoading}
        classesError={classesError}
        selectedClassId={selectedClassId}
        onFilterByClass={setSelectedClassId}
        onGenerateWithAI={handleGenerateWithAI}
        onAssignTest={handleAssignTest}
        onBulkAssignTest={handleBulkAssignTest}
        onDeleteTest={handleDeleteTest}
        onCreateClass={handleCreateClass}
        onUpdateClass={handleUpdateClass}
        onDeleteClass={handleDeleteClass}
        onAddStudentsToClass={handleAddStudentsToClass}
        onRemoveStudentFromClass={handleRemoveStudentFromClass}
        classStudentsData={classStudentsData}
        onExportResults={handleExportResults}
        onFetchStudentHistory={handleFetchStudentHistory}
      />
    </SidebarHeader>
  )
}

export default TeacherPanelPage