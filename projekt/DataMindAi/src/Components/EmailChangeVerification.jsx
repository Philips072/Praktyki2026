import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import './EmailChangeVerification.css'

function EmailChangeVerification({ newEmail, onVerified, onCancelled }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const lastVerifiedCodeRef = useRef('')
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  useEffect(() => {
    const code = verificationCode.join('')
    if (emailSent && code.length === 6 && code !== lastVerifiedCodeRef.current && !isVerifying) {
      const timer = setTimeout(() => {
        lastVerifiedCodeRef.current = code
        verifyCode()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [verificationCode, emailSent, isVerifying])

  const sendEmailToUser = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/send-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ email: newEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Wystąpił błąd przy wysyłaniu kodu.')
      } else {
        setEmailSent(true)
        setError('')
        setTimeout(() => {
          const firstInput = document.getElementById('email-change-code-0')
          firstInput?.focus()
        }, 100)
      }
    } catch (err) {
      console.error('Error sending verification code:', err)
      setError('Wystąpił błąd przy wysyłaniu kodu. Spróbuj ponownie.')
    }

    setLoading(false)
  }

  const verifyCode = async () => {
    const code = verificationCode.join('')
    if (code.length !== 6) {
      setError('Wpisz 6-cyfrowy kod.')
      return
    }

    setError('')
    setIsVerifying(true)

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ email: newEmail, code }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'Verification code has expired') {
          setError('Kod wygasł. Wyślij nowy kod.')
        } else {
          setError(data.error || 'Nieprawidłowy kod.')
        }
      } else {
        onVerified(newEmail)
      }
    } catch (err) {
      console.error('Error verifying code:', err)
      setError('Wystąpił błąd przy weryfikacji. Spróbuj ponownie.')
    }

    setIsVerifying(false)
  }

  const handleCodeChange = (index, value) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    if (value && index < 5) {
      const nextInput = document.getElementById(`email-change-code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`email-change-code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = [...verificationCode]
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newCode[i] = char
    })
    setVerificationCode(newCode)
  }

  const resendCode = async () => {
    setError('')
    setIsResending(true)
    setVerificationCode(['', '', '', '', '', ''])
    setEmailSent(false)
    lastVerifiedCodeRef.current = ''

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/send-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ email: newEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Wystąpił błąd przy wysyłaniu kodu.')
        showToast('Wystąpił błąd przy wysyłaniu kodu', 'error')
      } else {
        setEmailSent(true)
        setError('')
        showToast('Nowy kod został wysłany')
        setTimeout(() => {
          const firstInput = document.getElementById('email-change-code-0')
          firstInput?.focus()
        }, 100)
      }
    } catch (err) {
      console.error('Error resending verification code:', err)
      setError('Wystąpił błąd przy wysyłaniu kodu. Spróbuj ponownie.')
      showToast('Wystąpił błąd przy wysyłaniu kodu', 'error')
    }

    setIsResending(false)
  }

  return (
    <div className="email-change-overlay" onClick={onCancelled}>
      <div className="email-change-modal" onClick={e => e.stopPropagation()}>
        <div className="email-change-header">
          <h3 className="email-change-title">Zmień adres email</h3>
          <button className="email-change-close-btn" onClick={onCancelled}>×</button>
        </div>

        <div className="email-change-body">
          {!emailSent ? (
            <>
              <p className="email-change-info">
                Wyślemy Ci kod weryfikacyjny na adres: <strong>{newEmail}</strong>
              </p>

              <button
                type="button"
                className="email-change-verify-btn"
                onClick={sendEmailToUser}
                disabled={loading}
              >
                {loading ? 'Wysyłanie...' : 'Wyślij kod'}
              </button>

              <button
                type="button"
                className="email-change-cancel-btn"
                onClick={onCancelled}
              >
                Anuluj
              </button>
            </>
          ) : (
            <>
              <p className="email-change-info">
                Wpisz kod, który wysłaliśmy na adres: <strong>{newEmail}</strong>
              </p>

              <div className="email-change-code-inputs">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`email-change-code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleCodeChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={isVerifying}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {error && <p className="email-change-error">{error}</p>}

              <button
                type="button"
                className="email-change-verify-btn"
                onClick={verifyCode}
                disabled={isVerifying || verificationCode.join('').length !== 6}
              >
                {isVerifying ? 'Weryfikacja...' : 'Zweryfikuj kod'}
              </button>

              <button
                type="button"
                className="email-change-resend-btn"
                onClick={resendCode}
                disabled={isResending}
              >
                {isResending ? 'Wysyłanie...' : 'Wyślij nowy kod'}
              </button>

              <button
                type="button"
                className="email-change-cancel-btn"
                onClick={onCancelled}
              >
                Anuluj
              </button>
            </>
          )}
        </div>

        {toast.show && (
          <div className={`email-change-toast email-change-toast-${toast.type} show`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailChangeVerification
