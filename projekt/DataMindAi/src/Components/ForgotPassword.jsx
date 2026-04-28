import './ForgotPassword.css'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
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

// Krok 1: formularz emaila
function EmailStep({ onSent }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const redirectTo = `${window.location.origin}/reset-hasla`
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

    if (resetError) {
      setError('Nie udało się wysłać linku. Sprawdź adres email i spróbuj ponownie.')
    } else {
      onSent(email)
    }

    setLoading(false)
  }

  return (
    <>
      <h1>Resetuj hasło</h1>
      <p>Podaj email powiązany z kontem, a wyślemy Ci link do zresetowania hasła.</p>

      <form className="fp-form" onSubmit={handleSubmit}>
        <label htmlFor="fp-email">Email</label>
        <input
          id="fp-email"
          type="email"
          placeholder="twoj@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Wysyłanie...' : 'Wyślij link resetujący'}
        </button>
      </form>

      <span className="fp-bottom-text">
        Pamiętasz hasło? <Link to="/logowanie">Zaloguj się</Link>
      </span>
    </>
  )
}

// Krok 2: potwierdzenie wysłania emaila
function SentStep({ email }) {
  return (
    <div className="fp-sent">
      <div className="fp-sent-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </div>
      <h1>Sprawdź email</h1>
      <p>Wysłaliśmy link do resetowania hasła na adres <strong>{email}</strong>. Kliknij w link w wiadomości, aby ustawić nowe hasło.</p>
      <Link to="/logowanie" className="fp-back-login">Wróć do logowania</Link>
    </div>
  )
}

// Krok 3: formularz nowego hasła (po powrocie z linku emailowego)
function NewPasswordStep() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

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

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError('Nie udało się zaktualizować hasła. Spróbuj ponownie.')
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/logowanie'), 2500)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="fp-sent">
        <div className="fp-sent-icon fp-sent-icon--success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1>Hasło zmienione!</h1>
        <p>Twoje hasło zostało pomyślnie zaktualizowane. Za chwilę zostaniesz przekierowany do strony logowania.</p>
      </div>
    )
  }

  return (
    <>
      <h1>Nowe hasło</h1>
      <p>Wpisz nowe hasło dla swojego konta.</p>

      <form className="fp-form" onSubmit={handleSubmit}>
        <label htmlFor="fp-password">Nowe hasło</label>
        <div className="password-wrapper">
          <input
            id="fp-password"
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
            <span className="password-toggle-icon" key={showPassword ? 1 : 0}>
              {showPassword ? <EyeOpen /> : <EyeClosed />}
            </span>
          </button>
        </div>

        <label htmlFor="fp-confirm">Powtórz hasło</label>
        <div className="password-wrapper">
          <input
            id="fp-confirm"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Powtórz nowe hasło"
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
            <span className="password-toggle-icon" key={showConfirm ? 1 : 0}>
              {showConfirm ? <EyeOpen /> : <EyeClosed />}
            </span>
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Zapisywanie...' : 'Ustaw nowe hasło'}
        </button>
      </form>
    </>
  )
}

function ForgotPassword() {
  const [step, setStep] = useState('email')
  const [sentEmail, setSentEmail] = useState('')
  const [searchParams] = useSearchParams()

  useEffect(() => {
    console.log('=== ForgotPassword - URL params:', Object.fromEntries(searchParams))

    const token = searchParams.get('token')
    const type = searchParams.get('type')
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')

    console.log('URL params check:', { token, type, accessToken, refreshToken: !!refreshToken })

    if (token || type === 'password_recovery' || accessToken) {
      console.log('Wykryto parametry resetu hasła - przejście do kroku resetu')
      setStep('reset')

      if (accessToken && refreshToken) {
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        }).then(({ data, error }) => {
          console.log('setSession result:', { data, error })
        })
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log('Auth state change event:', event)
      if (event === 'PASSWORD_RECOVERY') {
        setStep('reset')
      }
    })

    return () => subscription.unsubscribe()
  }, [searchParams])

  const handleSent = (email) => {
    setSentEmail(email)
    setStep('sent')
  }

  return (
    <div className="fp-page">
      <Link to="/logowanie" className="fp-back">
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

      <div className="fp-body">
        <div className="fp-card">
          <img src={logo} alt="DataMindAI" className="fp-logo" />

          {step === 'email' && <EmailStep onSent={handleSent} />}
          {step === 'sent' && <SentStep email={sentEmail} />}
          {step === 'reset' && <NewPasswordStep />}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
