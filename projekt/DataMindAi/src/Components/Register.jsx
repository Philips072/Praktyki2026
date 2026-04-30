import './Register.css'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/nazwa.PNG'
import { supabase } from '../supabaseClient'
import { initializeDatabase } from '../api.js'

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
  'Email already registered': 'Konto z tym adresem email już istnieje.',
  'Duplicate email': 'Konto z tym adresem email już istnieje.',
  'duplicate': 'Konto z tym adresem email już istnieje.',
}

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

function Register() {
  const navigate = useNavigate()
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const lastVerifiedCodeRef = useRef('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const validateEmail = (value) => {
    if (!value) return 'Wprowadź adres email.'
    if (!EMAIL_REGEX.test(value)) return 'Nieprawidłowy format emaila.'
    return ''
  }

  const validatePassword = (value) => {
    if (!value) return 'Wprowadź hasło.'
    if (value.length < 6) return 'Hasło musi mieć co najmniej 6 znaków.'
    return ''
  }

  const validateName = (value) => {
    if (!value) return 'Wprowadź imię.'
    if (value.trim().length < 2) return 'Imię musi mieć co najmniej 2 znaki.'
    return ''
  }

  const validateConfirmPassword = (value, pwd) => {
    if (!value) return 'Potwierdź hasło.'
    if (value !== pwd) return 'Hasła nie są identyczne.'
    return ''
  }

  const handleNameChange = (value) => {
    setName(value)
    if (nameError) setNameError('')
  }

  const handleEmailChange = (value) => {
    setEmail(value)
    if (emailError) setEmailError('')
  }

  const handlePasswordChange = (value) => {
    setPassword(value)
    if (passwordError) setPasswordError('')
    if (confirmPasswordError && confirmPassword) setConfirmPasswordError(validateConfirmPassword(confirmPassword, value))
  }

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value)
    if (confirmPasswordError) setConfirmPasswordError('')
  }

  const hasErrors = () => {
    return !!nameError || !!emailError || !!passwordError || !!confirmPasswordError
  }

  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      if (!name) {
        document.getElementById('name')?.focus()
        return
      }
      if (!email) {
        document.getElementById('email')?.focus()
        return
      }
      if (!password) {
        document.getElementById('password')?.focus()
        return
      }
      if (!confirmPassword) {
        document.getElementById('confirmPassword')?.focus()
        return
      }

      sendVerificationCode(e)
    }
  }

  // Automatyczna weryfikacja po wpisaniu 6 cyfr
  useEffect(() => {
    const code = verificationCode.join('')
    if (emailSent && code.length === 6 && code !== lastVerifiedCodeRef.current && !isVerifying && !codeVerified) {
      const timer = setTimeout(() => {
        lastVerifiedCodeRef.current = code
        verifyCode()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [verificationCode, emailSent])

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/check-email-exists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      console.log('checkEmailExists - email:', email, 'exists:', data.exists)

      if (data.exists) {
        return { exists: true, message: 'Konto z tym adresem email już istnieje.' }
      }

      return { exists: false }
    } catch (err) {
      console.error('Error checking email:', err)
      return { exists: false }
    }
  }

  const sendVerificationCode = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')
    setNameError('')

    const nameErr = validateName(name)
    const emailErr = validateEmail(email)
    const passwordErr = validatePassword(password)
    const confirmErr = validateConfirmPassword(confirmPassword, password)

    setNameError(nameErr)
    setEmailError(emailErr)
    setPasswordError(passwordErr)
    setConfirmPasswordError(confirmErr)

    if (nameErr || emailErr || passwordErr || confirmErr) return

    setLoading(true)

    try {
      const { exists, message } = await checkEmailExists(email)

      if (exists) {
        setEmailError(message)
        setLoading(false)
        return
      }

      setCodeSent(true)
      setEmailSent(false)
    } catch (err) {
      console.error('Error checking email:', err)
      setError('Wystąpił błąd. Spróbuj ponownie.')
    }

    setLoading(false)
  }

  const sendEmailToUser = async () => {
    setError('')
    setLoading(true)

    try {
      const { exists, message } = await checkEmailExists(email)

      if (exists) {
        setError(message)
        setLoading(false)
        return
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/send-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Wystąpił błąd przy wysyłaniu kodu.')
      } else {
        setEmailSent(true)
        setError('')
        setTimeout(() => {
          const firstInput = document.getElementById('code-0')
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
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'Verification code has expired') {
          setError('Kod wygasł. Wyślij nowy kod.')
        } else {
          setError(data.error || 'Nieprawidłowy kod.')
        }
      } else {
        setCodeVerified(true)
        setError('')
        await completeRegistration()
      }
    } catch (err) {
      console.error('Error verifying code:', err)
      setError('Wystąpił błąd przy weryfikacji. Spróbuj ponownie.')
    }

    setIsVerifying(false)
  }

  const completeRegistration = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      })

      console.log('completeRegistration - authError:', authError)

      if (authError) {
        console.log('Auth error message:', authError.message)
        setError(ERROR_MESSAGES[authError.message] ?? 'Wystąpił błąd. Spróbuj ponownie.')
        setLoading(false)
        return
      }

      await new Promise(resolve => setTimeout(resolve, 500))

      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setError('Wystąpił problem. Spróbuj ponownie.')
        setLoading(false)
        return
      }

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user.id)
        .maybeSingle()

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: authData.user.id, name, email, role: 'uczen' })

        if (profileError) {
          console.error('Błąd tworzenia profilu w Register:', profileError)
          setError('Konto zostało utworzone, ale nie udało się zapisać profilu: ' + profileError.message)
          setLoading(false)
          return
        }
      } else {
        console.log('Profil już istnieje, pomijam tworzenie')
      }

      try {
        await initializeDatabase(authData.user.id, 1)
      } catch (dbError) {
        console.error('Nie udało się utworzyć bazy SQLite dla lekcji 1:', dbError)
      }

      navigate('/onboarding')
      setLoading(false)
    } catch (err) {
      console.error('Registration error:', err)
      setError('Wystąpił błąd. Spróbuj ponownie.')
      setLoading(false)
    }
  }

  const handleCodeChange = (index, value) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
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
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Wystąpił błąd przy wysyłaniu kodu.')
        showToast('Wystąpił błąd przy wysyłaniu kodu', 'error')
      } else {
        setEmailSent(true)
        setError('')
        showToast('Nowy kod został wysłany na podany adres email')
        setTimeout(() => {
          const firstInput = document.getElementById('code-0')
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
    <section className="register-page">
      <Link to={codeSent ? "/rejestracja" : "/"} onClick={() => codeSent && setCodeSent(false)} className="register-back">
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

          <form className="register-form" onKeyDown={handleFormKeyDown}>
            {!codeSent ? (
              <>
                <label>Imię</label>
                <div className="input-wrapper">
                  <input
                    id="name"
                    type="text"
                    placeholder="Twoje imię"
                    value={name}
                    onChange={e => handleNameChange(e.target.value)}
                    disabled={loading}
                    className={nameError ? 'input-error' : ''}
                  />
                  {nameError && <p className="input-error-message">{nameError}</p>}
                </div>

                <label>Email</label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    type="email"
                    placeholder="twoj@email.com"
                    value={email}
                    onChange={e => handleEmailChange(e.target.value)}
                    disabled={loading}
                    className={emailError ? 'input-error' : ''}
                  />
                  {emailError && <p className="input-error-message">{emailError}</p>}
                </div>

                <label>Hasło</label>
                <div className="input-wrapper password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 znaków"
                    value={password}
                    onChange={e => handlePasswordChange(e.target.value)}
                    disabled={loading}
                    className={passwordError ? 'input-error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
                  >
                    <span className="password-toggle-icon" key={showPassword ? 1 : 0}>{showPassword ? <EyeOpen /> : <EyeClosed />}</span>
                  </button>
                  {passwordError && <p className="input-error-message">{passwordError}</p>}
                </div>

                <label>Powtórz hasło</label>
                <div className="input-wrapper password-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Powtórz hasło"
                    value={confirmPassword}
                    onChange={e => handleConfirmPasswordChange(e.target.value)}
                    disabled={loading}
                    className={confirmPasswordError ? 'input-error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirm(p => !p)}
                    aria-label={showConfirm ? 'Ukryj hasło' : 'Pokaż hasło'}
                  >
                    <span className="password-toggle-icon" key={showConfirm ? 1 : 0}>{showConfirm ? <EyeOpen /> : <EyeClosed />}</span>
                  </button>
                  {confirmPasswordError && <p className="input-error-message">{confirmPasswordError}</p>}
                </div>

                {error && <p className="form-error">{error}</p>}

                <button type="submit" onClick={sendVerificationCode} disabled={loading}>
                  {loading ? 'Wysyłanie...' : 'Zarejestruj się'}
                </button>
              </>
            ) : (
              !emailSent ? (
                <>
                  <p className="verification-info">
                    Aby się zarejestrować musisz potwierdzić swój adres E-mail, aby to zrobić wyślemy do Ciebie kod weryfikacyjny.
                  </p>

                  {error && <p className="form-error">{error}</p>}

                  <button type="button" onClick={sendEmailToUser} disabled={loading}>
                    {loading ? 'Wysyłanie...' : 'Wyślij kod'}
                  </button>
                </>
              ) : (
                <>
                  <p className="verification-info">
                    Wpisz kod, który wysłaliśmy na adres: <strong>{email}</strong>
                  </p>

                  <div className="code-inputs">
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleCodeChange(index, e.target.value)}
                        onKeyDown={e => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        disabled={isVerifying || codeVerified}
                        autoFocus={index === 0 && !codeVerified}
                      />
                    ))}
                  </div>

                  {error && <p className="form-error">{error}</p>}

                  {codeVerified ? (
                    <button type="button" disabled>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Zweryfikowano
                    </button>
                  ) : (
                    <button type="button" onClick={verifyCode} disabled={isVerifying || verificationCode.join('').length !== 6}>
                      {isVerifying ? 'Weryfikacja...' : 'Zweryfikuj kod'}
                    </button>
                  )}

                  <button
                    type="button"
                    className="resend-code-button"
                    onClick={resendCode}
                    disabled={isResending}
                  >
                    {isResending ? 'Wysyłanie...' : 'Wyślij nowy kod'}
                  </button>
                </>
              )
            )}
          </form>

          {!codeSent && (
            <span className="register-login-text">
              Masz już konto? <Link to="/logowanie">Zaloguj się</Link>
            </span>
          )}
        </div>
      </div>

      {toast.show && (
        <div className={`toast toast-${toast.type} show`}>
          {toast.message}
        </div>
      )}
    </section>
  )
}

export default Register
