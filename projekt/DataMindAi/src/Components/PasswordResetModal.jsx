import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import './EmailChangeVerification.css'

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

function PasswordResetModal({ email, onClose, onSuccess }) {
  const [step, setStep] = useState('send')
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
    if (step === 'verify' && code.length === 6 && code !== lastVerifiedCodeRef.current && !isVerifying) {
      const timer = setTimeout(() => {
        lastVerifiedCodeRef.current = code
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [verificationCode, step, isVerifying])

  const sendCode = async () => {
    setError('')
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const { error: fnError } = await supabase.functions.invoke('send-reset-code', {
        body: { email },
        headers: session ? { Authorization: `Bearer ${session.access_token}` } : {}
      })

      if (fnError) {
        setError('Nie udało się wysłać kodu. Spróbuj ponownie.')
      } else {
        setStep('verify')
        setError('')
        setTimeout(() => {
          const firstInput = document.getElementById('email-change-code-0')
          firstInput?.focus()
        }, 100)
      }
    } catch (err) {
      setError('Wystąpił błąd.')
    }

    setLoading(false)
  }

  const verifyAndReset = async () => {
    const code = verificationCode.join('')

    if (newPassword !== confirmPassword) {
      setError('Hasła nie są identyczne.')
      return
    }

    if (newPassword.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków.')
      return
    }

    setError('')
    setIsVerifying(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const { data, error: fnError } = await supabase.functions.invoke('verify-reset-code', {
        body: { email, code, newPassword },
        headers: session ? { Authorization: `Bearer ${session.access_token}` } : {}
      })

      if (fnError || !data?.success) {
        setError(data?.error || 'Nieprawidłowy kod weryfikacyjny.')
      } else {
        onSuccess()
        onClose()
        showToast('Hasło zostało zmienione', 'success')
      }
    } catch (err) {
      setError('Wystąpił błąd.')
    }

    setIsVerifying(false)
  }

  const resendCode = async () => {
    setError('')
    setIsResending(true)
    setVerificationCode(['', '', '', '', '', ''])
    setNewPassword('')
    setConfirmPassword('')
    lastVerifiedCodeRef.current = ''

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const { error: fnError } = await supabase.functions.invoke('send-reset-code', {
        body: { email },
        headers: session ? { Authorization: `Bearer ${session.access_token}` } : {}
      })

      if (fnError) {
        setError('Nie udało się wysłać kodu.')
        showToast('Wystąpił błąd przy wysyłaniu kodu', 'error')
      } else {
        setError('')
        showToast('Nowy kod został wysłany')
        setTimeout(() => {
          const firstInput = document.getElementById('email-change-code-0')
          firstInput?.focus()
        }, 100)
      }
    } catch (err) {
      setError('Wystąpił błąd.')
      showToast('Wystąpił błąd przy wysyłaniu kodu', 'error')
    }

    setIsResending(false)
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

  return (
    <div className="email-change-overlay" onClick={onClose}>
      <div className="email-change-modal" onClick={e => e.stopPropagation()}>
        <div className="email-change-header">
          <h3 className="email-change-title">Reset hasła</h3>
          <button className="email-change-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="email-change-body">
          {step === 'send' ? (
            <>
              <p className="email-change-info">
                Wyślemy Ci kod weryfikacyjny na adres: <strong>{email}</strong>
              </p>

              <button
                type="button"
                className="email-change-verify-btn"
                onClick={sendCode}
                disabled={loading}
              >
                {loading ? 'Wysyłanie...' : 'Wyślij kod'}
              </button>

              <button
                type="button"
                className="email-change-cancel-btn"
                onClick={onClose}
              >
                Anuluj
              </button>
            </>
          ) : (
            <>
              <p className="email-change-info">
                Wpisz kod, który wysłaliśmy na: <strong>{email}</strong>
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

              <div className="email-change-password-inputs">
                <div className="email-change-password-wrapper">
                  <input
                    type={showNew ? 'text' : 'password'}
                    placeholder="Nowe hasło (min. 6 znaków)"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    disabled={isVerifying}
                  />
                  <button
                    type="button"
                    className="email-change-password-toggle"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <EyeOpen /> : <EyeClosed />}
                  </button>
                </div>

                <div className="email-change-password-wrapper">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Powtórz hasło"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={isVerifying}
                  />
                  <button
                    type="button"
                    className="email-change-password-toggle"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOpen /> : <EyeClosed />}
                  </button>
                </div>
              </div>

              {error && <p className="email-change-error">{error}</p>}

              <button
                type="button"
                className="email-change-verify-btn"
                onClick={verifyAndReset}
                disabled={isVerifying || verificationCode.join('').length !== 6 || !newPassword || !confirmPassword}
              >
                {isVerifying ? 'Zmienianie...' : 'Zmień hasło'}
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
                onClick={onClose}
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

export default PasswordResetModal
