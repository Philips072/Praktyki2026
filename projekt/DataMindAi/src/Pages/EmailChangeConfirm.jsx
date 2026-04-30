import { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './EmailChangeConfirm.css'

function EmailChangeConfirm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('checking')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const emailFromParams = searchParams.get('email')
    const typeFromParams = searchParams.get('type')
    if (emailFromParams) setEmail(emailFromParams)
    if (typeFromParams) setType(typeFromParams)
  }, [searchParams])

  useEffect(() => {
    const checkEmailVerification = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session && session.user) {
        if (type === 'change') {
          setStatus('confirmed')
          setMessage('Twój nowy adres email został pomyślnie zweryfikowany.')
        } else {
          setStatus('confirmed')
          setMessage('Twój adres email został pomyślnie zweryfikowany.')
        }
      } else {
        setStatus('waiting')
        setMessage('Oczekiwanie na potwierdzenie emaila...')
      }
    }

    if (email) {
      checkEmailVerification()
      const interval = setInterval(checkEmailVerification, 2000)
      return () => clearInterval(interval)
    }
  }, [email, type])

  const handleGoToLogin = () => {
    navigate('/logowanie')
  }

  const handleGoToSettings = () => {
    navigate('/ustawienia')
  }

  const handleLogoutAndLogin = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('user')
    navigate('/logowanie')
  }

  if (!email) {
    return (
      <div className="email-change-confirm">
        <div className="email-change-confirm-card">
          <h2>Brak danych</h2>
          <p>Nie znaleziono adresu email do potwierdzenia.</p>
          <Link to="/" className="email-change-confirm-btn">Wróć do strony głównej</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="email-change-confirm">
      <div className="email-change-confirm-card">
        {status === 'checking' && (
          <>
            <div className="email-change-confirm-icon checking">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h2>Sprawdzanie statusu...</h2>
          </>
        )}

        {status === 'waiting' && (
          <>
            <div className="email-change-confirm-icon waiting">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </div>
            <h2>Weryfikacja emaila</h2>
            <p className="email-change-confirm-email">{email}</p>
            <p className="email-change-confirm-info">
              Sprawdź swoją skrzynkę email i kliknij w link weryfikacyjny, aby zmienić adres email na: <strong>{email}</strong>
            </p>
            <p className="email-change-confirm-hint">
              Jeśli nie otrzymałeś emaila, sprawdź folder spam lub <Link to="/ustawienia">wróć do ustawień</Link>, aby wysłać ponownie.
            </p>
            <button onClick={handleGoToSettings} className="email-change-confirm-btn secondary">
              Wróć do ustawień
            </button>
          </>
        )}

        {status === 'confirmed' && (
          <>
            <div className="email-change-confirm-icon success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
            </div>
            <h2>Email zmieniony pomyślnie!</h2>
            <p className="email-change-confirm-message">{message}</p>
            <p className="email-change-confirm-email">{email}</p>

            {type === 'change' && (
              <div className="email-change-confirm-steps">
                <h3>Co teraz zrobić?</h3>
                <ol>
                  <li>Wyloguj się z obecnego konta (poniżej)</li>
                  <li>Zaloguj się ponownie używając nowego adresu email: <strong>{email}</strong></li>
                  <li>Gotowe! Twój email został zmieniony</li>
                </ol>
              </div>
            )}

            <div className="email-change-confirm-actions">
              {type === 'change' ? (
                <button onClick={handleLogoutAndLogin} className="email-change-confirm-btn primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Wyloguj się i zaloguj na nowy email
                </button>
              ) : (
                <button onClick={handleGoToLogin} className="email-change-confirm-btn primary">
                  Zaloguj się
                </button>
              )}
              <Link to="/" className="email-change-confirm-btn secondary">
                Wróć do strony głównej
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EmailChangeConfirm
