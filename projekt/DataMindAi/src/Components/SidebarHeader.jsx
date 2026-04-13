import './SidebarHeader.css'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

function SidebarHeader({ children, sidebarOpen, setSidebarOpen }) {
 
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
      active: true,
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
      active: false,
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
      active: false,
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
      label: 'Osiągnięcia',
      active: false,
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M8 4H16V7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7V4Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M10 11V14L7 20H17L14 14V11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M16 5H19C19 7.20914 17.2091 9 15 9"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M8 5H5C5 7.20914 6.79086 9 9 9"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
  ]

  return (
    <div className={`dashboard-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-top">
          <div className="dashboard-sidebar-logo-row">
            <Link to="/" className="dashboard-logo-link">
              <img src="src/assets/nazwa.PNG" alt="DataMindAI" className="dashboard-logo" />
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
              <button
                key={item.label}
                className={`dashboard-nav-item ${item.active ? 'active' : ''}`}
                type="button"
              >
                <span className="dashboard-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="dashboard-user-box">
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
            <strong>Użytkownik</strong>
            <span>Beginner</span>
          </div>
        </div>
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

        <main className="dashboard-content">
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