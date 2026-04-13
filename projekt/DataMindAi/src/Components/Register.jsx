import './Register.css'
import { Link } from 'react-router-dom'
import logo from '../assets/nazwa.PNG'

function Register() {
  return (
    <section className="register-page">
      <Link to="/" className="register-back">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Powrót
      </Link>

      <div className="register-body">
        <div className="register-card">
          <img src={logo} alt="DataMindAI" className="register-logo" />

          <h1>Utwórz konto</h1>
          <p>Rozpocznij personalizowaną naukę SQL</p>

          <form className="register-form">
            <label>Imię</label>
            <input type="text" placeholder="Twoje imię" />

            <label>Email</label>
            <input type="email" placeholder="twoj@email.com" />

            <label>Hasło</label>
            <input type="password" placeholder="Minimum 8 znaków" />

            <label>Powtórz hasło</label>
            <input type="password" placeholder="Powtórz hasło" />

            <button type="submit">Utwórz konto</button>
          </form>

          <span className="register-login-text">
            Masz już konto? <Link to="/logowanie">Zaloguj się</Link>
          </span>
        </div>
      </div>
    </section>
  )
}

export default Register
