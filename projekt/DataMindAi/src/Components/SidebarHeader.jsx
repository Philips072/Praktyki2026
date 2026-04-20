import './SidebarHeader.css'
import { useMemo, useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { supabase } from '../supabaseClient'
import logo from '../assets/nazwa.PNG'

function useUnreadCount(userId) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!userId) return

    const fetch = async () => {
      // Pobierz ID rozmów użytkownika
      const { data: convRows } = await supabase
        .from('conversations')
        .select('id')
        .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)

      if (!convRows || convRows.length === 0) { setCount(0); return }

      const convIds = convRows.map(c => c.id)
      const { count: n } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .in('conversation_id', convIds)
        .eq('read_by_recipient', false)
        .neq('sender_id', userId)

      setCount(n ?? 0)
    }

    fetch()

    const channel = supabase
      .channel(`sidebar-unread-${userId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.new.sender_id !== userId) setCount(c => c + 1)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.new.read_by_recipient && !payload.old.read_by_recipient && payload.new.sender_id !== userId) {
          setCount(c => Math.max(0, c - 1))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  return count
}

const ROLE_LABELS = {
  uczen: 'Uczeń',
  nauczyciel: 'Nauczyciel',
  administrator: 'Administrator',
}

function SidebarHeader({ children, sidebarOpen, setSidebarOpen, noPadding = false }) {
  const { profile, user } = useAuth()
  const unreadCount = useUnreadCount(user?.id)
 
  const todayDate = useMemo(() => {
    return new Intl.DateTimeFormat('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date())
  }, [])

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M4 10.5L12 4L20 10.5V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V10.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: 'Lekcje',
      path: '/lekcje',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6.5C4 5.67157 4.67157 5 5.5 5H10C11.1046 5 12 5.89543 12 7V19H5.5C4.67157 19 4 18.3284 4 17.5V6.5Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M20 6.5C20 5.67157 19.3284 5 18.5 5H14C12.8954 5 12 5.89543 12 7V19H18.5C19.3284 19 20 18.3284 20 17.5V6.5Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      label: 'AI Chat',
      path: '/ai-chat',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M7 18L3.5 20V6C3.5 4.89543 4.39543 4 5.5 4H18.5C19.6046 4 20.5 4.89543 20.5 6V16C20.5 17.1046 19.6046 18 18.5 18H7Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: 'Wiadomości',
      path: '/wiadomosci',
      badge: unreadCount || 0,
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <polyline
            points="22,6 12,13 2,6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    // Widoczne tylko dla nauczyciela
    ...(profile?.role === 'nauczyciel' ? [{
      label: 'Panel nauczyciela',
      path: '/panel-nauczyciela',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 8h4M7 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    }] : []),
    // Widoczne tylko dla administratora
    ...(profile?.role === 'administrator' ? [{
      label: 'Panel administratora',
      path: '/panel-admina',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
          <path d="M3 14h7M14 14h7M3 14v7M14 14v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    }] : []),
  ]

  return (
    <div className={`dashboard-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'sidebar-backdrop--visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-top">
          <div className="dashboard-sidebar-logo-row">
            <Link to="/" className="dashboard-logo-link">
              <img src={logo} alt="DataMindAI" className="dashboard-logo" />
            </Link>
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Zamknij sidebar"
            >
              ✕
            </button>
          </div>

          <nav className="dashboard-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) => `dashboard-nav-item${isActive ? ' active' : ''}`}
              >
                <span className="dashboard-nav-icon">{item.icon}</span>
                <span className="dashboard-nav-label">{item.label}</span>
                {item.badge > 0 && (
                  <span className="dashboard-nav-badge">{item.badge > 99 ? '99+' : item.badge}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <Link to="/ustawienia" className="dashboard-user-box">
          <div className="dashboard-user-avatar">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                fill="currentColor"
              />
              <path
                d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20"
                fill="currentColor"
              />
            </svg>
          </div>

          <div className="dashboard-user-info">
            <strong>{profile?.name ?? 'Użytkownik'}</strong>
            <span>{ROLE_LABELS[profile?.role] ?? 'Gość'}</span>
          </div>
        </Link>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <button
            type="button"
            className="dashboard-menu-toggle"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label={sidebarOpen ? 'Zamknij sidebar' : 'Otwórz sidebar'}
          >
            {sidebarOpen ? (
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 6L9 12L15 18"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7H20"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M4 12H20"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M4 17H20"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          <div className="dashboard-header-date">{todayDate}</div>
        </header>

        <main className={`dashboard-content${noPadding ? ' dashboard-content--no-padding' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default SidebarHeader



// Jak użyć

// Na stronie dashboardu:

// import SidebarHeader from '../Components/SidebarHeader'

// function DashboardPage() {
//   return (
//     <SidebarHeader>
//       <h1>Witaj w SQL Learning!</h1>
//       <p>Tu wrzucasz zawartość strony.</p>
//     </SidebarHeader>
//   )
// }

// export default DashboardPage