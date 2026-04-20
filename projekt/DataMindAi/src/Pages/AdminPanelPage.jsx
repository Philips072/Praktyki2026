import { useState, useEffect } from 'react'
import SidebarHeader from '../Components/SidebarHeader'
import { useAuth } from '../AuthContext'
import { toast } from 'react-toastify'
import { supabase } from '../supabaseClient'
import './AdminPanelPage.css'

function AdminPanelPage() {
  const { user, profile } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [userFilter, setUserFilter] = useState('all')
  const [editingUser, setEditingUser] = useState(null)
  const [userFormData, setUserFormData] = useState({})

  // ── Użytkownicy ────────────────────────────────────────────────────────────
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState(null)

  const fetchUsers = async () => {
    setUsersLoading(true)
    setUsersError(null)

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, role, sql_level, class_id, classes(name), created_at')
      .order('created_at', { ascending: false })

    if (error) {
      setUsersError(error.message)
      setUsersLoading(false)
      return
    }

    const usersList = (data ?? []).map(p => ({
      id: p.id,
      name: p.name ?? 'Brak nazwy',
      email: p.email,
      role: p.role ?? 'uczen',
      level: p.sql_level ?? 'poczatkujacy',
      className: p.classes?.name || null,
      classId: p.class_id || null,
      createdAt: p.created_at,
    }))

    setUsers(usersList)
    setUsersLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // ── Klasy ────────────────────────────────────────────────────────────────
  const [classes, setClasses] = useState([])
  const [classesLoading, setClassesLoading] = useState(true)
  const [classesError, setClassesError] = useState(null)
  const [classFormMode, setClassFormMode] = useState(null) // null | 'create' | 'edit'
  const [editingClass, setEditingClass] = useState(null)
  const [classFormData, setClassFormData] = useState({ name: '', description: '' })

  const fetchClasses = async () => {
    setClassesLoading(true)
    setClassesError(null)

    const { data, error } = await supabase
      .from('classes')
      .select('*, class_students(count), profiles(name)')
      .order('name', { ascending: true })

    if (error) {
      setClassesError(error.message)
      setClassesLoading(false)
      return
    }

    const classesList = (data ?? []).map(cls => ({
      ...cls,
      studentCount: cls.class_students?.[0]?.count || 0,
      createdBy: cls.profiles?.name || '—',
    }))

    setClasses(classesList)
    setClassesLoading(false)
  }

  useEffect(() => { fetchClasses() }, [])

  // ── Testy ────────────────────────────────────────────────────────────────
  const [tests, setTests] = useState([])
  const [testsLoading, setTestsLoading] = useState(true)
  const [testsError, setTestsError] = useState(null)

  const fetchTests = async () => {
    setTestsLoading(true)
    setTestsError(null)

    const { data, error } = await supabase
      .from('tests')
      .select('id, title, difficulty, skill, profiles(name)')
      .order('created_at', { ascending: false })

    if (error) {
      setTestsError(error.message)
      setTestsLoading(false)
      return
    }

    const testsList = (data ?? []).map(test => ({
      ...test,
      creator: test.profiles?.name || '—',
    }))

    setTests(testsList)
    setTestsLoading(false)
  }

  useEffect(() => { fetchTests() }, [])

  // ── Statystyki ───────────────────────────────────────────────────────────
  const [stats, setStats] = useState({
    totalUsers: 0,
    studentsCount: 0,
    teachersCount: 0,
    adminsCount: 0,
    classesCount: 0,
    testsCount: 0,
    totalAssignments: 0,
    completedAssignments: 0,
  })

  const fetchStats = async () => {
    // Pobierz liczbę użytkowników według roli
    const { data: usersByRole } = await supabase
      .from('profiles')
      .select('role')

    const students = usersByRole?.filter(u => u.role === 'uczen').length || 0
    const teachers = usersByRole?.filter(u => u.role === 'nauczyciel').length || 0
    const admins = usersByRole?.filter(u => u.role === 'administrator').length || 0

    // Pobierz liczbę klas
    const { count: classesCount } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })

    // Pobierz liczbę testów
    const { count: testsCount } = await supabase
      .from('tests')
      .select('*', { count: 'exact', head: true })

    // Pobierz przypisania
    const { data: assignments } = await supabase
      .from('assignments')
      .select('status')

    const completedAssignments = assignments?.filter(a => a.status === 'completed').length || 0

    setStats({
      totalUsers: usersByRole?.length || 0,
      studentsCount: students,
      teachersCount: teachers,
      adminsCount: admins,
      classesCount: classesCount || 0,
      testsCount: testsCount || 0,
      totalAssignments: assignments?.length || 0,
      completedAssignments,
    })
  }

  useEffect(() => { fetchStats() }, [])

  // ── Filtrowanie użytkowników ───────────────────────────────────────────
  const filteredUsers = users.filter(u => {
    const matchesFilter = userFilter === 'all' || u.role === userFilter
    const matchesSearch = searchQuery === '' ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // ── Formatowanie daty ───────────────────────────────────────────────
  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('pl-PL', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  // ── Poziomy SQL ───────────────────────────────────────────────
  const LEVEL_LABELS = {
    'poczatkujacy': 'Początkujący',
    'sredniozaawansowany': 'Średniozaawansowany',
    'zaawansowany': 'Zaawansowany',
    'beginner': 'Początkujący',
    'intermediate': 'Średniozaawansowany',
    'advanced': 'Zaawansowany'
  }

  // ── Funkcje obsługi użytkowników ─────────────────────────────────────
  const handleEditUser = (u) => {
    setEditingUser(u.id)
    setUserFormData({
      name: u.name,
      email: u.email,
      sql_level: u.level
    })
  }

  const handleSaveUser = async () => {
    if (!userFormData.name || !userFormData.email) {
      toast.error('Imię i email są wymagane.')
      return
    }

    console.log('Aktualizacja użytkownika:', { userId: editingUser, data: userFormData })

    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: userFormData.name,
        email: userFormData.email,
        sql_level: userFormData.sql_level
      })
      .eq('id', editingUser)
      .select()

    console.log('Wynik UPDATE użytkownika:', { data, error })

    if (error) {
      toast.error('Błąd aktualizacji użytkownika: ' + error.message)
      console.error('Szczegóły błędu:', error)
      return
    }

    if (!data || data.length === 0) {
      toast.error('Nie znaleziono użytkownika lub brak uprawnień do zmiany.')
      console.error('Brak zwróconych danych po UPDATE')
      return
    }

    toast.success('Użytkownik zaktualizowany pomyślnie.')
    setEditingUser(null)
    setUserFormData({})
    fetchUsers()
  }

  const handleCancelEditUser = () => {
    setEditingUser(null)
    setUserFormData({})
  }

  const handleChangeRole = async (userId, newRole) => {
    if (userId === user?.id) {
      toast.warning('Nie możesz zmienić swojej własnej roli.')
      return
    }

    console.log('Zmiana roli:', { userId, newRole })

    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)
      .select()

    console.log('Wynik UPDATE:', { data, error })

    if (error) {
      toast.error('Błąd zmiany roli: ' + error.message)
      console.error('Szczegóły błędu:', error)
      return
    }

    if (!data || data.length === 0) {
      toast.error('Nie znaleziono użytkownika lub brak uprawnień do zmiany.')
      console.error('Brak zwróconych danych po UPDATE')
      return
    }

    toast.success('Rola użytkownika została zmieniona.')
    fetchUsers()
    fetchStats()
  }

  const handleDeleteUser = async (userId, userName) => {
    if (userId === user?.id) {
      toast.warning('Nie możesz usunąć własnego konta.')
      return
    }

    if (!confirm(`Czy na pewno chcesz usunąć użytkownika "${userName}"? Ta operacja jest nieodwracalna.`)) {
      return
    }

    // Najpierw usuń powiązane dane
    // 1. Usuń przypisania testów
    await supabase.from('assignments').delete().eq('student_id', userId)

    // 2. Usuń powiązania z klasami
    await supabase.from('class_students').delete().eq('student_id', userId)

    // 3. Usuń profil
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      toast.error('Błąd usuwania profilu: ' + profileError.message)
      return
    }

    // 4. Usuń konto auth (tylko z service role, ale tutaj używamy standardowego klienta)
    // Uwaga: Usunięcie konta auth wymaga service role key, więc w tej wersji
    // usuwamy tylko profil. Konto auth pozostanie ale nie będzie powiązane.

    toast.success('Użytkownik został usunięty.')
    fetchUsers()
    fetchStats()
  }

  // ── Funkcje obsługi klas ─────────────────────────────────────────────
  const validateClassName = (name) => {
    const pattern = /^[0-9][a-zA-Z]{1,2}$/
    if (!pattern.test(name)) {
      toast.error('Nieprawidłowy format nazwy klasy. Użyj formatu: cyfra + 1-2 litery (np. 2a, 10b)')
      return false
    }
    return true
  }

  const handleCreateClass = () => {
    if (profile?.role !== 'administrator' && profile?.role !== 'nauczyciel') {
      toast.warning('Tylko administratorzy i nauczyciele mogą tworzyć klasy.')
      return
    }
    setClassFormMode('create')
    setClassFormData({ name: '', description: '' })
  }

  const handleEditClass = (cls) => {
    if (profile?.role !== 'administrator' && cls.created_by !== user?.id) {
      toast.warning('Tylko twórca lub administrator może edytować klasę.')
      return
    }
    setEditingClass(cls.id)
    setClassFormData({ name: cls.name, description: cls.description || '' })
    setClassFormMode('edit')
  }

  const handleSaveClass = async (e) => {
    e?.preventDefault()

    if (!validateClassName(classFormData.name)) return

    if (classFormMode === 'create') {
      const { data, error } = await supabase
        .from('classes')
        .insert({
          name: classFormData.name,
          description: classFormData.description,
          created_by: user.id
        })
        .select()

      if (error) {
        toast.error('Błąd tworzenia klasy: ' + error.message)
        console.error('Błąd tworzenia klasy:', error)
        return
      }

      toast.success('Klasa utworzona pomyślnie.')
    } else if (classFormMode === 'edit') {
      const { data, error } = await supabase
        .from('classes')
        .update({
          name: classFormData.name,
          description: classFormData.description
        })
        .eq('id', editingClass)
        .select()

      if (error) {
        toast.error('Błąd aktualizacji klasy: ' + error.message)
        console.error('Błąd aktualizacji klasy:', error)
        return
      }

      toast.success('Klasa zaktualizowana pomyślnie.')
    }

    setClassFormMode(null)
    setEditingClass(null)
    setClassFormData({ name: '', description: '' })
    fetchClasses()
    fetchStats()
  }

  const handleCancelClass = () => {
    setClassFormMode(null)
    setEditingClass(null)
    setClassFormData({ name: '', description: '' })
  }

  const handleDeleteClass = async (classId, className, createdBy) => {
    if (profile?.role !== 'administrator' && createdBy !== user?.id) {
      toast.warning('Tylko twórca lub administrator może usunąć klasę.')
      return
    }

    if (!confirm(`Czy na pewno chcesz usunąć klasę "${className}"? Uczniowie pozostaną w systemie.`)) {
      return
    }

    // Usuń powiązania uczniów z klasą
    await supabase.from('class_students').delete().eq('class_id', classId)

    // Zaktualizuj class_id na NULL w profiles
    await supabase.from('profiles').update({ class_id: null }).eq('class_id', classId)

    // Usuń klasę
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId)

    if (error) {
      toast.error('Błąd usuwania klasy: ' + error.message)
      return
    }

    toast.success('Klasa została usunięta.')
    fetchClasses()
    fetchStats()
  }

  // ── Puste funkcje dla testów ───────────────────────────────────────────
  const handleCreateTest = () => {
    toast.info('Funkcja tworzenia testu jest obecnie nieaktywna.')
  }

  const handleDeleteTest = () => {
    toast.info('Funkcja usuwania testu jest obecnie nieaktywna.')
  }

  return (
    <SidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} noPadding>
      <div className="admin-panel">
        {/* Nagłówek z zakładkami */}
        <div className="admin-header">
          <h1 className="admin-title">Panel Administratora</h1>
          <nav className="admin-tabs">
            <button
              className={`admin-tab ${activeTab === 'users' ? 'admin-tab--active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Użytkownicy
            </button>
            <button
              className={`admin-tab ${activeTab === 'classes' ? 'admin-tab--active' : ''}`}
              onClick={() => setActiveTab('classes')}
            >
              Klasy
            </button>
            <button
              className={`admin-tab ${activeTab === 'tests' ? 'admin-tab--active' : ''}`}
              onClick={() => setActiveTab('tests')}
            >
              Testy
            </button>
            <button
              className={`admin-tab ${activeTab === 'stats' ? 'admin-tab--active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              Statystyki
            </button>
          </nav>
        </div>

        {/* Sekcja: Użytkownicy */}
        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2 className="admin-section-title">Zarządzanie użytkownikami</h2>
              <div className="admin-filters">
                <input
                  type="text"
                  placeholder="Szukaj użytkownika..."
                  className="admin-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="admin-filter"
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                >
                  <option value="all">Wszyscy</option>
                  <option value="uczen">Uczniowie</option>
                  <option value="nauczyciel">Nauczyciele</option>
                  <option value="administrator">Administratorzy</option>
                </select>
              </div>
            </div>

            {usersLoading ? (
              <p className="admin-status admin-status--loading">Ładowanie użytkowników…</p>
            ) : usersError ? (
              <p className="admin-status admin-status--error">Błąd: {usersError}</p>
            ) : (
              <>
                <div className="admin-users-count">
                  Wyświetlono: {filteredUsers.length} z {users.length} użytkowników
                </div>

                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Imię i nazwisko</th>
                      <th>Email</th>
                      <th>Rola</th>
                      <th>Poziom SQL</th>
                      <th>Klasa</th>
                      <th>Data utworzenia</th>
                      <th>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className={`admin-table-row ${editingUser === u.id ? 'admin-table-row--editing' : ''}`}>
                        {editingUser === u.id ? (
                          <>
                            <td colSpan={7}>
                              <div className="admin-edit-row">
                                <input
                                  type="text"
                                  className="admin-input admin-input--inline"
                                  value={userFormData.name || ''}
                                  onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                                  placeholder="Imię i nazwisko"
                                />
                                <input
                                  type="email"
                                  className="admin-input admin-input--inline"
                                  value={userFormData.email || ''}
                                  onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                                  placeholder="Email"
                                />
                                <select
                                  className="admin-select admin-select--inline"
                                  value={userFormData.sql_level || ''}
                                  onChange={(e) => setUserFormData({...userFormData, sql_level: e.target.value})}
                                >
                                  <option value="">Wybierz poziom</option>
                                  <option value="poczatkujacy">Początkujący</option>
                                  <option value="sredniozaawansowany">Średniozaawansowany</option>
                                  <option value="zaawansowany">Zaawansowany</option>
                                </select>
                              </div>
                            </td>
                            <td style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="admin-btn admin-btn--primary" onClick={handleSaveUser}>
                                  💾 Zapisz
                                </button>
                                <button className="admin-btn" onClick={handleCancelEditUser}>
                                  ❌ Anuluj
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td><strong>{u.name}</strong></td>
                            <td>{u.email || '—'}</td>
                            <td>
                              <select
                                className={`admin-role-select admin-role-select--${u.role}`}
                                value={u.role}
                                onChange={(e) => handleChangeRole(u.id, e.target.value)}
                                disabled={u.id === user?.id}
                              >
                                <option value="uczen">Uczeń</option>
                                <option value="nauczyciel">Nauczyciel</option>
                                <option value="administrator">Administrator</option>
                              </select>
                            </td>
                            <td>{LEVEL_LABELS[u.level] || u.level}</td>
                            <td>{u.className || '—'}</td>
                            <td>{formatDate(u.createdAt)}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                  className="admin-btn admin-btn--edit"
                                  onClick={() => handleEditUser(u)}
                                  disabled={u.id === user?.id}
                                  title="Edytuj profil"
                                >
                                  ✏️ Edytuj
                                </button>
                                <button
                                  className="admin-btn admin-btn--delete"
                                  onClick={() => handleDeleteUser(u.id, u.name)}
                                  disabled={u.id === user?.id}
                                  title="Usuń użytkownika"
                                >
                                  🗑️ Usuń
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}

        {/* Sekcja: Klasy */}
        {activeTab === 'classes' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2 className="admin-section-title">Zarządzanie klasami</h2>
              {(profile?.role === 'administrator' || profile?.role === 'nauczyciel') && (
                <button
                  className="admin-btn admin-btn--primary"
                  onClick={handleCreateClass}
                >
                  + Nowa klasa
                </button>
              )}
            </div>

            {/* Formularz tworzenia/edycji klasy */}
            {classFormMode && (
              <form className="admin-class-form" onSubmit={handleSaveClass}>
                <h3 className="admin-form-title">
                  {classFormMode === 'create' ? 'Nowa klasa' : 'Edytuj klasę'}
                </h3>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Nazwa klasy *</label>
                    <input
                      className="admin-input"
                      value={classFormData.name}
                      onChange={e => setClassFormData({...classFormData, name: e.target.value})}
                      placeholder="np. 2a, 3b, 1cA"
                      pattern="[0-9][a-zA-Z]{1,2}"
                      required
                    />
                    <small className="admin-input-hint">Format: cyfra + 1-2 litery (np. 2a, 10b)</small>
                  </div>
                  <div className="admin-form-group">
                    <label>Opis (opcjonalnie)</label>
                    <input
                      className="admin-input"
                      value={classFormData.description}
                      onChange={e => setClassFormData({...classFormData, description: e.target.value})}
                      placeholder="Dodatkowe informacje o klasie..."
                    />
                  </div>
                </div>
                <div className="admin-form-actions">
                  <button type="submit" className="admin-btn admin-btn--primary">
                    {classFormMode === 'create' ? 'Utwórz klasę' : 'Zapisz zmiany'}
                  </button>
                  <button
                    type="button"
                    className="admin-btn"
                    onClick={handleCancelClass}
                  >
                    Anuluj
                  </button>
                </div>
              </form>
            )}

            {classesLoading ? (
              <p className="admin-status admin-status--loading">Ładowanie klas…</p>
            ) : classesError ? (
              <p className="admin-status admin-status--error">Błąd: {classesError}</p>
            ) : classes.length === 0 && !classFormMode ? (
              <p className="admin-empty">Brak klas. Utwórz pierwszą klasę klikając przycisk "Nowa klasa".</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nazwa</th>
                    <th>Opis</th>
                    <th>Uczniowie</th>
                    <th>Utworzona przez</th>
                    <th>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map(cls => (
                    <tr key={cls.id} className={`admin-table-row ${editingClass === cls.id ? 'admin-table-row--editing' : ''}`}>
                      <td><strong>{cls.name}</strong></td>
                      <td>{cls.description || '—'}</td>
                      <td>{cls.studentCount}</td>
                      <td>{cls.createdBy || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="admin-btn admin-btn--edit"
                            onClick={() => handleEditClass(cls)}
                            disabled={profile?.role !== 'administrator' && cls.created_by !== user?.id}
                            title={profile?.role !== 'administrator' && cls.created_by !== user?.id ? 'Tylko twórca lub administrator' : 'Edytuj klasę'}
                          >
                            ✏️ Edytuj
                          </button>
                          <button
                            className="admin-btn admin-btn--delete"
                            onClick={() => handleDeleteClass(cls.id, cls.name, cls.created_by)}
                            disabled={profile?.role !== 'administrator' && cls.created_by !== user?.id}
                            title={profile?.role !== 'administrator' && cls.created_by !== user?.id ? 'Tylko twórca lub administrator' : 'Usuń klasę'}
                          >
                            🗑️ Usuń
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Sekcja: Testy */}
        {activeTab === 'tests' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2 className="admin-section-title">Zarządzanie testami</h2>
              <button
                className="admin-btn admin-btn--primary"
                onClick={handleCreateTest}
              >
                + Nowy test
              </button>
            </div>

            {testsLoading ? (
              <p className="admin-status admin-status--loading">Ładowanie testów…</p>
            ) : testsError ? (
              <p className="admin-status admin-status--error">Błąd: {testsError}</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tytuł</th>
                    <th>Poziom</th>
                    <th>Umiejętność</th>
                    <th>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map(test => (
                    <tr key={test.id} className="admin-table-row">
                      <td><strong>{test.title}</strong></td>
                      <td>
                        <span className={`admin-badge admin-badge--${test.difficulty}`}>
                          {test.difficulty}
                        </span>
                      </td>
                      <td>{test.skill || '—'}</td>
                      <td>
                        <button
                          className="admin-btn admin-btn--delete"
                          onClick={handleDeleteTest}
                        >
                          🗑️ Usuń
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Sekcja: Statystyki */}
        {activeTab === 'stats' && (
          <div className="admin-section">
            <h2 className="admin-section-title">Statystyki systemowe</h2>

            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-value">{stats.totalUsers}</div>
                <div className="admin-stat-label">Całkowita liczba użytkowników</div>
              </div>
              <div className="admin-stat-card admin-stat-card--students">
                <div className="admin-stat-value">{stats.studentsCount}</div>
                <div className="admin-stat-label">Uczniowie</div>
              </div>
              <div className="admin-stat-card admin-stat-card--teachers">
                <div className="admin-stat-value">{stats.teachersCount}</div>
                <div className="admin-stat-label">Nauczyciele</div>
              </div>
              <div className="admin-stat-card admin-stat-card--admins">
                <div className="admin-stat-value">{stats.adminsCount}</div>
                <div className="admin-stat-label">Administratorzy</div>
              </div>
              <div className="admin-stat-card admin-stat-card--classes">
                <div className="admin-stat-value">{stats.classesCount}</div>
                <div className="admin-stat-label">Klasy</div>
              </div>
              <div className="admin-stat-card admin-stat-card--tests">
                <div className="admin-stat-value">{stats.testsCount}</div>
                <div className="admin-stat-label">Testy</div>
              </div>
              <div className="admin-stat-card admin-stat-card--assignments">
                <div className="admin-stat-value">{stats.totalAssignments}</div>
                <div className="admin-stat-label">Wszystkie przypisania</div>
              </div>
              <div className="admin-stat-card admin-stat-card--completed">
                <div className="admin-stat-value">{stats.completedAssignments}</div>
                <div className="admin-stat-label">Ukończone przypisania</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarHeader>
  )
}

export default AdminPanelPage
