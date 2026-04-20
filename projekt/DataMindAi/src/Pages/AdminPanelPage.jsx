import { useState } from 'react'
import SidebarHeader from '../Components/SidebarHeader'
import { useAuth } from '../AuthContext'
import './AdminPanelPage.css'

function AdminPanelPage() {
  const { user, profile } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [userFilter, setUserFilter] = useState('all')
  const [editingUser, setEditingUser] = useState(null)
  const [userFormData, setUserFormData] = useState({})

  // Dane przykładowe - tylko do wyświetlania
  const mockUsers = [
    { id: '1', name: 'Jan Kowalski', email: 'jan@example.com', role: 'uczen', level: 'poczatkujacy', className: '2a', classId: '1', createdAt: '2024-03-15T10:00:00Z' },
    { id: '2', name: 'Anna Nowak', email: 'anna@example.com', role: 'nauczyciel', level: 'zaawansowany', className: null, classId: null, createdAt: '2024-02-20T08:30:00Z' },
    { id: '3', name: 'Marek Wiśniewski', email: 'marek@example.com', role: 'administrator', level: 'zaawansowany', className: null, classId: null, createdAt: '2024-01-10T14:00:00Z' },
    { id: '4', name: 'Katarzyna Zielińska', email: 'kasia@example.com', role: 'uczen', level: 'sredniozaawansowany', className: '2b', classId: '2', createdAt: '2024-03-01T09:15:00Z' },
    { id: '5', name: 'Tomasz Lewandowski', email: 'tomek@example.com', role: 'uczen', level: 'poczatkujacy', className: '2a', classId: '1', createdAt: '2024-03-18T11:00:00Z' },
  ]

  const mockClasses = [
    { id: '1', name: '2a', description: 'Klasa informatyczna', studentCount: 25, createdBy: 'Marek Wiśniewski' },
    { id: '2', name: '2b', description: 'Klasa matematyczna', studentCount: 22, createdBy: 'Anna Nowak' },
    { id: '3', name: '3a', description: 'Klasa biologiczna', studentCount: 20, createdBy: 'Anna Nowak' },
  ]

  const mockTests = [
    { id: '1', title: 'SELECT podstawy', difficulty: 'easy', skill: 'SELECT', creator: 'Anna Nowak' },
    { id: '2', title: 'JOINy - ćwiczenie', difficulty: 'medium', skill: 'JOIN', creator: 'Anna Nowak' },
    { id: '3', title: 'Grupowanie danych', difficulty: 'hard', skill: 'GROUP BY', creator: 'Marek Wiśniewski' },
  ]

  const mockStats = {
    totalUsers: 150,
    studentsCount: 120,
    teachersCount: 25,
    adminsCount: 5,
    classesCount: 12,
    testsCount: 45,
    totalAssignments: 500,
    completedAssignments: 420,
  }

  // ── Filtrowanie użytkowników ───────────────────────────────────────────
  const filteredUsers = mockUsers.filter(u => {
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

  // ── Puste funkcje obsługi (brak funkcjonalności) ───────────────────────
  const handleEditUser = (u) => {
    setEditingUser(u.id)
    setUserFormData({
      name: u.name,
      email: u.email,
      sql_level: u.level
    })
  }

  const handleSaveUser = () => {
    alert('Funkcja edycji użytkownika jest obecnie nieaktywna.')
  }

  const handleCancelEditUser = () => {
    setEditingUser(null)
    setUserFormData({})
  }

  const handleChangeRole = () => {
    alert('Funkcja zmiany roli jest obecnie nieaktywna.')
  }

  const handleDeleteUser = () => {
    alert('Funkcja usuwania użytkownika jest obecnie nieaktywna.')
  }

  const handleCreateClass = () => {
    alert('Funkcja tworzenia klasy jest obecnie nieaktywna.')
  }

  const handleUpdateClass = () => {
    alert('Funkcja edycji klasy jest obecnie nieaktywna.')
  }

  const handleDeleteClass = () => {
    alert('Funkcja usuwania klasy jest obecnie nieaktywna.')
  }

  const handleCreateTest = () => {
    alert('Funkcja tworzenia testu jest obecnie nieaktywna.')
  }

  const handleDeleteTest = () => {
    alert('Funkcja usuwania testu jest obecnie nieaktywna.')
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

            <>
              <div className="admin-users-count">
                Wyświetlono: {filteredUsers.length} z {mockUsers.length} użytkowników
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
                              onChange={() => handleChangeRole()}
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
                                onClick={() => handleDeleteUser()}
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
          </div>
        )}

        {/* Sekcja: Klasy */}
        {activeTab === 'classes' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2 className="admin-section-title">Zarządzanie klasami</h2>
              <button
                className="admin-btn admin-btn--primary"
                onClick={handleCreateClass}
              >
                + Nowa klasa
              </button>
            </div>

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
                {mockClasses.map(cls => (
                  <tr key={cls.id} className="admin-table-row">
                    <td><strong>{cls.name}</strong></td>
                    <td>{cls.description || '—'}</td>
                    <td>{cls.studentCount}</td>
                    <td>{cls.createdBy || '—'}</td>
                    <td>
                      <button
                        className="admin-btn admin-btn--edit"
                        onClick={handleUpdateClass}
                      >
                        ✏️ Edytuj
                      </button>
                      <button
                        className="admin-btn admin-btn--delete"
                        onClick={handleDeleteClass}
                      >
                        🗑️ Usuń
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                {mockTests.map(test => (
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
          </div>
        )}

        {/* Sekcja: Statystyki */}
        {activeTab === 'stats' && (
          <div className="admin-section">
            <h2 className="admin-section-title">Statystyki systemowe</h2>

            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-value">{mockStats.totalUsers}</div>
                <div className="admin-stat-label">Całkowita liczba użytkowników</div>
              </div>
              <div className="admin-stat-card admin-stat-card--students">
                <div className="admin-stat-value">{mockStats.studentsCount}</div>
                <div className="admin-stat-label">Uczniowie</div>
              </div>
              <div className="admin-stat-card admin-stat-card--teachers">
                <div className="admin-stat-value">{mockStats.teachersCount}</div>
                <div className="admin-stat-label">Nauczyciele</div>
              </div>
              <div className="admin-stat-card admin-stat-card--admins">
                <div className="admin-stat-value">{mockStats.adminsCount}</div>
                <div className="admin-stat-label">Administratorzy</div>
              </div>
              <div className="admin-stat-card admin-stat-card--classes">
                <div className="admin-stat-value">{mockStats.classesCount}</div>
                <div className="admin-stat-label">Klasy</div>
              </div>
              <div className="admin-stat-card admin-stat-card--tests">
                <div className="admin-stat-value">{mockStats.testsCount}</div>
                <div className="admin-stat-label">Testy</div>
              </div>
              <div className="admin-stat-card admin-stat-card--assignments">
                <div className="admin-stat-value">{mockStats.totalAssignments}</div>
                <div className="admin-stat-label">Wszystkie przypisania</div>
              </div>
              <div className="admin-stat-card admin-stat-card--completed">
                <div className="admin-stat-value">{mockStats.completedAssignments}</div>
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
