import './Home4.css'
import { Link } from 'react-router-dom'

function Home4() {
  return (
    <section className="home4-section">
      <div className="home4-box">
        
        <div className="home4-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" stroke="currentColor" strokeWidth="2"/>
            <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>

        <h2>Gotowy na naukę SQL?</h2>

        <p>
          Dołącz do platformy i zacznij swoją przygodę z bazami danych już dziś.
        </p>

        <Link to="/rejestracja">
          <button className="home4-btn">
            Utwórz konto za darmo →
          </button>
        </Link>
      </div>
    </section>
  )
}

export default Home4