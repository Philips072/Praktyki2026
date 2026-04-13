import './Register.css'
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
  'User already registered': 'Konto z tym adresem email już istnieje.',
  'Password should be at least 6 characters': 'Hasło musi mieć co najmniej 6 znaków.',
  'Too many requests': 'Zbyt wiele prób. Spróbuj ponownie za chwilę.',
}

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne.')
      return
    }

    if (password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków.')
      return
    }

    setLoading(true)

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })

    if (authError) {
      setError(ERROR_MESSAGES[authError.message] ?? 'Wystąpił błąd. Spróbuj ponownie.')
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: authData.user.id, name, email, role: 'uczen' })

    if (profileError) {
      setError('Konto zostało utworzone, ale nie udało się zapisać profilu.')
      setLoading(false)
      return
    }

    navigate('/dashboard')
    setLoading(false)
  }

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

          <form className="register-form" onSubmit={handleSubmit}>
            <label>Imię</label>
            <input
              type="text"
              placeholder="Twoje imię"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="twoj@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <label>Hasło</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 znaków"
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

            <label>Powtórz hasło</label>
            <div className="password-wrapper">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Powtórz hasło"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm(p => !p)}
                aria-label={showConfirm ? 'Ukryj hasło' : 'Pokaż hasło'}
              >
                <span className="password-toggle-icon" key={showConfirm ? 1 : 0}>{showConfirm ? <EyeOpen /> : <EyeClosed />}</span>
              </button>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Tworzenie konta...' : 'Utwórz konto'}
            </button>
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
