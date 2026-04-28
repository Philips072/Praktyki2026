import './Login.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/nazwa.PNG'
import { supabase } from '../supabaseClient'

const EyeOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeClosed = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const ERROR_MESSAGES = {
  'Invalid login credentials': 'Nieprawidłowy email lub hasło.',
  'Email not confirmed': 'Potwierdź adres email przed zalogowaniem.',
  'Too many requests': 'Zbyt wiele prób. Spróbuj ponownie za chwilę.',
}

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNeedsVerification(false)
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      if (authError.message === 'Email not confirmed') {
        setNeedsVerification(true)
        setError(ERROR_MESSAGES[authError.message] ?? 'Wystąpił błąd. Spróbuj ponownie.')
      } else {
        setError(ERROR_MESSAGES[authError.message] ?? 'Wystąpił błąd. Spróbuj ponownie.')
      }
    } else {
      navigate('/dashboard')
    }

    setLoading(false)
  }

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

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="twoj@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Hasło</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(p => !p)}
                aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
              >
                <span className="password-toggle-icon" key={showPassword ? 1 : 0}>{showPassword ? <EyeOpen /> : <EyeClosed />}</span>
              </button>
            </div>

            {error && <p className="form-error">{error}</p>}

            {needsVerification && (
              <Link to={`/weryfikacja-email?email=${encodeURIComponent(email)}`} className="login-verify">
                Wyślij ponownie email weryfikacyjny
              </Link>
            )}

            <Link to="/reset-hasla" className="login-forgot">Zapomniałeś hasła?</Link>

            <button type="submit" disabled={loading}>
              {loading ? 'Logowanie...' : 'Zaloguj się'}
            </button>
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
