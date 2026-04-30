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
}

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

  // Automatyczna weryfikacja po wpisaniu 6 cyfr
  useEffect(() => {
    const code = verificationCode.join('')
    // Weryfikuj tylko jeśli kod się zmienił i jeszcze nie był weryfikowany
    if (emailSent && code.length === 6 && code !== lastVerifiedCodeRef.current && !isVerifying && !codeVerified) {
      const timer = setTimeout(() => {
        lastVerifiedCodeRef.current = code
        verifyCode()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [verificationCode, emailSent])

  const sendVerificationCode = (e) => {
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

    if (!name || !email) {
      setError('Wypełnij wszystkie pola.')
      return
    }

    // Przejdź do ekranu z kodem
    setCodeSent(true)
    setEmailSent(false)
  }

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
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Wystąpił błąd przy wysyłaniu kodu.')
      } else {
        setEmailSent(true)
        setError('')
        // Focus na pierwszy input po wysłaniu
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

      if (authError) {
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

  // Funkcja do ponownego wysłania kodu
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
      } else {
        setEmailSent(true)
        setError('')
        // Focus na pierwszy input po ponownym wysłaniu
        setTimeout(() => {
          const firstInput = document.getElementById('code-0')
          firstInput?.focus()
        }, 100)
      }
    } catch (err) {
      console.error('Error resending verification code:', err)
      setError('Wystąpił błąd przy wysyłaniu kodu. Spróbuj ponownie.')
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

          <form className="register-form">
            {!codeSent ? (
              <>
                <label>Imię</label>
                <input
                  type="text"
                  placeholder="Twoje imię"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={loading}
                />

                <label>Email</label>
                <input
                  type="email"
                  placeholder="twoj@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />

                <label>Hasło</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 znaków"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
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
                    disabled={loading}
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
    </section>
  )
}

export default Register
