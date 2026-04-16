import './UserSettings.css'
import './AiChat.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'
import { askInterests } from '../api'

const AiAvatar = () => (
  <div className="aichat-avatar">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#fcf6f3"/>
    </svg>
  </div>
)

function InterestsChatBox({ currentInterests, userId, onSaved }) {
  const [input, setInput] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [aiMessage, setAiMessage] = useState('')
  const [thinking, setThinking] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setUserMessage(trimmed)
    setInput('')
    setThinking(true)
    setError('')
    try {
      const { message, interests } = await askInterests(trimmed)
      setAiMessage(message)
      await supabase.from('profiles').update({ interests }).eq('id', userId)
      onSaved(interests)
      setSaved(true)
    } catch (err) {
      setError(`Błąd AI: ${err.message}`)
      setUserMessage('')
    } finally {
      setThinking(false)
    }
  }

  const handleReset = () => {
    setInput('')
    setUserMessage('')
    setAiMessage('')
    setError('')
    setSaved(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const replied = !!aiMessage

  return (
    <div className="aichat-box settings-interests-chat">
      <div className="aichat-messages settings-interests-messages">

        {/* Aktualne zainteresowania */}
        {currentInterests && !replied && (
          <div className="aichat-row aichat-row--ai">
            <AiAvatar />
            <div className="aichat-bubble aichat-bubble--ai">
              <p className="aichat-line" style={{ opacity: 0.65, fontSize: '0.82rem' }}>Obecne zainteresowania:</p>
              <p className="aichat-line"><em>{currentInterests}</em></p>
            </div>
          </div>
        )}

        {/* Powitanie AI */}
        <div className="aichat-row aichat-row--ai">
          <AiAvatar />
          <div className="aichat-bubble aichat-bubble--ai">
            <p className="aichat-line">
              {currentInterests
                ? 'Chcesz zaktualizować zainteresowania? Napisz czym się teraz interesujesz.'
                : 'Napisz czym się interesujesz — dostosujemy do tego przykłady i ćwiczenia SQL.'}
            </p>
          </div>
        </div>

        {/* Wiadomość użytkownika */}
        {userMessage && (
          <div className="aichat-row aichat-row--user">
            <div className="aichat-bubble aichat-bubble--user">
              <p className="aichat-line">{userMessage}</p>
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {thinking && (
          <div className="aichat-row aichat-row--ai">
            <AiAvatar />
            <div className="aichat-bubble aichat-bubble--ai msg-bubble--typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        {/* Odpowiedź AI */}
        {replied && (
          <div className="aichat-row aichat-row--ai">
            <AiAvatar />
            <div className="aichat-bubble aichat-bubble--ai">
              <p className="aichat-line">{aiMessage}</p>
              {saved && (
                <p className="aichat-line" style={{ marginTop: 6, opacity: 0.65, fontSize: '0.82rem' }}>
                  Zainteresowania zostały zaktualizowane.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      {!replied && !thinking && (
        <div className="aichat-input-bar">
          {error && <p style={{ color: '#e05a5a', fontSize: '0.8rem', padding: '0 12px 8px', margin: 0 }}>{error}</p>}
          <input
            className="aichat-input"
            type="text"
            placeholder="Np. analiza danych, marketing, finanse..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="aichat-send-btn"
            onClick={handleSend}
            disabled={!input.trim()}
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="#fcf6f3"/>
            </svg>
          </button>
        </div>
      )}

      {/* Przycisk resetu */}
      {replied && (
        <div className="aichat-input-bar">
          <button
            className="settings-save-btn"
            onClick={handleReset}
            type="button"
            style={{ margin: '4px 0' }}
          >
            Zaktualizuj ponownie
          </button>
        </div>
      )}
    </div>
  )
}

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

function UserSettings() {
  const navigate = useNavigate()
  const { user, profile, refreshProfile } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [sqlLevel, setSqlLevel] = useState('')
  const [interests, setInterests] = useState('')

  const [nameStatus, setNameStatus] = useState({ loading: false, error: '', success: '' })
  const [emailStatus, setEmailStatus] = useState({ loading: false, error: '', success: '' })
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: '', success: '' })
  const [levelStatus, setLevelStatus] = useState({ loading: false, error: '', success: '' })
  const [interestsStatus, setInterestsStatus] = useState({ loading: false, error: '', success: '' })

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    if (profile?.name) setName(profile.name)
    if (user?.email) setEmail(user.email)
    if (profile?.sql_level) setSqlLevel(profile.sql_level)
    if (profile?.interests) setInterests(
      Array.isArray(profile.interests) ? profile.interests.join(', ') : (profile.interests ?? '')
    )
  }, [profile, user])

  const handleSaveName = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setNameStatus({ loading: true, error: '', success: '' })
    const { error } = await supabase
      .from('profiles')
      .update({ name: name.trim() })
      .eq('id', user.id)
    if (error) {
      setNameStatus({ loading: false, error: 'Nie udało się zapisać imienia.', success: '' })
    } else {
      setNameStatus({ loading: false, error: '', success: 'Imię zostało zaktualizowane.' })
      setTimeout(() => window.location.reload(), 800)
    }
  }

  const handleSaveEmail = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setEmailStatus({ loading: true, error: '', success: '' })
    const { error } = await supabase.auth.updateUser({ email: email.trim() })
    if (error) {
      setEmailStatus({ loading: false, error: 'Nie udało się zmienić emaila.', success: '' })
    } else {
      setEmailStatus({ loading: false, error: '', success: 'Potwierdzenie wysłane na nowy adres email.' })
    }
  }

  const handleSavePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ loading: false, error: 'Hasła nie są identyczne.', success: '' })
      return
    }
    if (newPassword.length < 6) {
      setPasswordStatus({ loading: false, error: 'Hasło musi mieć co najmniej 6 znaków.', success: '' })
      return
    }
    setPasswordStatus({ loading: true, error: '', success: '' })

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })
    if (signInError) {
      setPasswordStatus({ loading: false, error: 'Aktualne hasło jest nieprawidłowe.', success: '' })
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPasswordStatus({ loading: false, error: 'Nie udało się zmienić hasła.', success: '' })
    } else {
      setPasswordStatus({ loading: false, error: '', success: 'Hasło zostało zmienione.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  const SQL_LEVELS = [
    { id: 'poczatkujacy', label: 'Początkujący', desc: 'Nigdy nie pracowałem z SQL' },
    { id: 'sredniozaawansowany', label: 'Średniozaawansowany', desc: 'Znam podstawy SELECT, WHERE, JOIN' },
    { id: 'zaawansowany', label: 'Zaawansowany', desc: 'Używam SQL regularnie w pracy' },
  ]

  const handleSaveLevel = async () => {
    if (!sqlLevel) return
    if (!user?.id) {
      setLevelStatus({ loading: false, error: 'Błąd: brak sesji użytkownika.', success: '' })
      return
    }
    setLevelStatus({ loading: true, error: '', success: '' })
    const { error } = await supabase.from('profiles').update({ sql_level: sqlLevel }).eq('id', user.id)
    if (error) {
      setLevelStatus({ loading: false, error: `Błąd: ${error.message}`, success: '' })
    } else {
      setLevelStatus({ loading: false, error: '', success: 'Poziom został zaktualizowany.' })
    }
  }

  const handleSaveInterests = async () => {
    setInterestsStatus({ loading: true, error: '', success: '' })
    const { error } = await supabase.from('profiles').update({ interests }).eq('id', user.id)
    if (error) {
      setInterestsStatus({ loading: false, error: 'Nie udało się zapisać zainteresowań.', success: '' })
    } else {
      setInterestsStatus({ loading: false, error: '', success: 'Zainteresowania zostały zaktualizowane.' })
    }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    navigate('/logowanie')
  }

  return (
    <div className="settings-page">

      <div className="settings-header">
        <div className="settings-avatar">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
              fill="currentColor"
            />
            <path
              d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20"
              fill="currentColor"
            />
          </svg>
        </div>
        <div>
          <h1 className="settings-title">{profile?.name ?? 'Ustawienia konta'}</h1>
          <p className="settings-subtitle">Zarządzaj swoimi danymi i hasłem</p>
        </div>
      </div>

      <div className="settings-sections">

        <div className="settings-card">
          <h2 className="settings-card-title">Imię</h2>
          <p className="settings-card-desc">Zmień imię widoczne w aplikacji</p>
          <form className="settings-form" onSubmit={handleSaveName}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Twoje imię"
              required
            />
            {nameStatus.error && <p className="settings-status settings-status--error">{nameStatus.error}</p>}
            {nameStatus.success && <p className="settings-status settings-status--success">{nameStatus.success}</p>}
            <button type="submit" disabled={nameStatus.loading}>
              {nameStatus.loading ? 'Zapisywanie...' : 'Zapisz'}
            </button>
          </form>
        </div>

        <div className="settings-card">
          <h2 className="settings-card-title">Adres email</h2>
          <p className="settings-card-desc">Zmień adres przypisany do konta</p>
          <form className="settings-form" onSubmit={handleSaveEmail}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="twoj@email.com"
              required
            />
            {emailStatus.error && <p className="settings-status settings-status--error">{emailStatus.error}</p>}
            {emailStatus.success && <p className="settings-status settings-status--success">{emailStatus.success}</p>}
            <button type="submit" disabled={emailStatus.loading}>
              {emailStatus.loading ? 'Zapisywanie...' : 'Zapisz'}
            </button>
          </form>
        </div>

        <div className="settings-card settings-card--wide">
          <h2 className="settings-card-title">Hasło</h2>
          <p className="settings-card-desc">Aby zmienić hasło, najpierw potwierdź aktualne</p>
          <form className="settings-form settings-form--password" onSubmit={handleSavePassword}>
            <div className="settings-form-row">
              <div className="settings-form-group">
                <label>Aktualne hasło</label>
                <div className="password-wrapper">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowCurrent(p => !p)} aria-label={showCurrent ? 'Ukryj hasło' : 'Pokaż hasło'}>
                    <span className="password-toggle-icon" key={showCurrent ? 1 : 0}>{showCurrent ? <EyeOpen /> : <EyeClosed />}</span>
                  </button>
                </div>
              </div>
              <div className="settings-form-group">
                <label>Nowe hasło</label>
                <div className="password-wrapper">
                  <input
                    type={showNew ? 'text' : 'password'}
                    placeholder="Minimum 6 znaków"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowNew(p => !p)} aria-label={showNew ? 'Ukryj hasło' : 'Pokaż hasło'}>
                    <span className="password-toggle-icon" key={showNew ? 1 : 0}>{showNew ? <EyeOpen /> : <EyeClosed />}</span>
                  </button>
                </div>
              </div>
              <div className="settings-form-group">
                <label>Powtórz nowe hasło</label>
                <div className="password-wrapper">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Powtórz hasło"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowConfirm(p => !p)} aria-label={showConfirm ? 'Ukryj hasło' : 'Pokaż hasło'}>
                    <span className="password-toggle-icon" key={showConfirm ? 1 : 0}>{showConfirm ? <EyeOpen /> : <EyeClosed />}</span>
                  </button>
                </div>
              </div>
            </div>
            {passwordStatus.error && <p className="settings-status settings-status--error">{passwordStatus.error}</p>}
            {passwordStatus.success && <p className="settings-status settings-status--success">{passwordStatus.success}</p>}
            <button type="submit" disabled={passwordStatus.loading}>
              {passwordStatus.loading ? 'Zmienianie...' : 'Zmień hasło'}
            </button>
          </form>
        </div>

        <div className="settings-card settings-card--wide">
          <h2 className="settings-card-title">Poziom SQL</h2>
          <p className="settings-card-desc">Zmień swój aktualny poziom zaawansowania SQL</p>
          <div className="settings-levels">
            {SQL_LEVELS.map(lvl => (
              <button
                key={lvl.id}
                type="button"
                className={`settings-level-card${sqlLevel === lvl.id ? ' settings-level-card--active' : ''}`}
                onClick={() => setSqlLevel(lvl.id)}
              >
                <span className="settings-level-name">{lvl.label}</span>
                <span className="settings-level-desc">{lvl.desc}</span>
              </button>
            ))}
          </div>
          {levelStatus.error && <p className="settings-status settings-status--error">{levelStatus.error}</p>}
          {levelStatus.success && <p className="settings-status settings-status--success">{levelStatus.success}</p>}
          <button
            className="settings-save-btn"
            onClick={handleSaveLevel}
            disabled={levelStatus.loading || !sqlLevel}
          >
            {levelStatus.loading ? 'Zapisywanie...' : 'Zapisz poziom'}
          </button>
        </div>

        <div className="settings-card settings-card--wide">
          <h2 className="settings-card-title">Zainteresowania</h2>
          <p className="settings-card-desc">AI zapyta o Twoje zainteresowania i automatycznie zaktualizuje profil</p>
          <InterestsChatBox
            currentInterests={interests}
            userId={user?.id}
            onSaved={(newInterests) => {
              setInterests(newInterests)
              refreshProfile(user?.id)
            }}
          />
        </div>

      </div>

      <div className="settings-logout">
        <button className="settings-logout-btn" onClick={handleLogout} disabled={loggingOut}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {loggingOut ? 'Wylogowywanie...' : 'Wyloguj się'}
        </button>
      </div>

    </div>
  )
}

export default UserSettings
