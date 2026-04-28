import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../assets/nazwa.PNG'
import { supabase } from '../supabaseClient'
import './VerifyEmailPage.css'

function VerifyEmailPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const emailFromParams = searchParams.get('email')
    if (emailFromParams) {
      setEmail(emailFromParams)
    }
  }, [searchParams])

  const handleResendEmail = async (e) => {
    e.preventDefault()
    if (!email) {
      setMessage('Podaj adres email, aby wysłać ponownie.')
      return
    }

    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    if (error) {
      setMessage('Wystąpił błąd. Sprawdź poprawność emaila.')
    } else {
      setMessage('Email weryfikacyjny został wysłany ponownie.')
    }

    setLoading(false)
  }

  return (
    <div className="verify-email-page">
      <Link to="/" className="verify-email-back">
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

      <div className="verify-email-body">
        <div className="verify-email-card">
          <img src={logo} alt="DataMindAI" className="verify-email-logo" />

          <div className="verify-email-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <path d="M22 6l-10 7L2 6" />
            </svg>
          </div>

          <h1>Sprawdź swoją skrzynkę email</h1>
          <p>Wysłaliśmy link weryfikacyjny na adres <strong>{email}</strong></p>

          <p className="verify-email-info">
            Kliknij w link w emailu, aby aktywować konto. Jeśli nie otrzymałeś emaila, sprawdź folder spam.
          </p>

          {message && <p className={message.includes('błąd') || message.includes('Sprawdź') ? 'verify-email-error' : 'verify-email-success'}>{message}</p>}

          <form className="verify-email-form" onSubmit={handleResendEmail}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="twoj@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Wysyłanie...' : 'Wyślij ponownie'}
            </button>
          </form>

          <span className="verify-email-login-text">
            Już potwierdziłeś email? <Link to="/logowanie">Zaloguj się</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage
