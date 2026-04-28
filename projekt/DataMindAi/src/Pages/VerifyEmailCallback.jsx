import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/nazwa.PNG'
import { supabase } from '../supabaseClient'
import './VerifyEmailCallback.css'

function VerifyEmailCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const handleVerification = async () => {
      console.log('=== VerifyEmailCallback - Sprawdzanie sesji ===')

      const { data: { session }, error } = await supabase.auth.getSession()

      console.log('Session check result:', { session, error })

      if (error) {
        console.error('Błąd sprawdzania sesji:', error)
        setStatus('error')
        setTimeout(() => navigate('/weryfikacja-email'), 3000)
        return
      }

      if (session && session.user) {
        console.log('Email potwierdzony, sesja aktywna')
        setStatus('success')
        setTimeout(() => navigate('/onboarding'), 2000)
      } else {
        console.log('Brak aktywnej sesji - email niepotwierdzony lub link wygasł')
        setStatus('error')
        setTimeout(() => navigate('/weryfikacja-email'), 3000)
      }
    }

    handleVerification()
  }, [navigate])

  return (
    <div className="verify-email-callback">
      <div className="verify-email-callback-card">
        <img src={logo} alt="DataMindAI" className="verify-email-callback-logo" />

        {status === 'loading' && (
          <>
            <div className="verify-email-callback-spinner"></div>
            <h2>Weryfikacja emaila...</h2>
            <p>Proszę czekać</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="verify-email-callback-icon success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
            </div>
            <h2>Email został potwierdzony!</h2>
            <p>Za chwilę zostaniesz przeniesiony do onboarding'u...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="verify-email-callback-icon error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2>Wystąpił błąd</h2>
            <p>Za chwilę zostaniesz przeniesiony do strony weryfikacji...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmailCallback
