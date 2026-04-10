import './HomeHeader.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function HomeHeader() {
  const [isOpen, setIsOpen] = useState(false)

useEffect(() => {
  const media = window.matchMedia('(min-width: 1000px)')

  const handleChange = (e) => {
    if (e.matches) {
      setIsOpen(false)
    }
  }

  media.addEventListener('change', handleChange)

  return () => media.removeEventListener('change', handleChange)
}, [])
  return (
    <header className='homeHeader'>
      <ul>
        <li className="logo-item">
          <Link to="/">
            <img src="src/assets/nazwa.PNG" alt="DataMindAI" />
          </Link>
        </li>

        <li className="desktop-actions">
          <Link to="/"><button>Zaloguj się</button></Link>
          <Link to="/"><button>Rozpocznij za darmo</button></Link>
        </li>

        <li className="hamburger-wrapper">
          <button
            className={`hamburger ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Zamknij menu' : 'Otwórz menu'}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </li>
      </ul>

      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>
          <button>Zaloguj się</button>
        </Link>
        <Link to="/" onClick={() => setIsOpen(false)}>
          <button>Rozpocznij za darmo</button>
        </Link>
      </div>
    </header>
  )
}

export default HomeHeader