import './Login.css'
import { Link } from 'react-router-dom'
import logo from '../assets/nazwa.PNG'

function Login() {
  return (
    <div className="login-page">
      <Link to="/" className="login-back">
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

      <div className="login-body">
        <div className="login-card">
          <img src={logo} alt="DataMindAI" className="login-logo" />

          <h1>Zaloguj się</h1>
          <p>Kontynuuj swoją naukę SQL</p>

          <form className="login-form">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="twoj@email.com"
            />

            <label htmlFor="password">Hasło</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
            />

            <Link to="/reset-hasla" className="login-forgot">Zapomniałeś hasła?</Link>

            <button type="submit">Zaloguj się</button>
          </form>

          <span className="login-register-text">
            Nie masz konta? <Link to="/rejestracja">Zarejestruj się</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Login
