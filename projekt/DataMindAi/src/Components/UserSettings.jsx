import './UserSettings.css'
import { useState } from 'react'

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
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

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
          <h1 className="settings-title">Ustawienia konta</h1>
          <p className="settings-subtitle">Zarządzaj swoimi danymi i hasłem</p>
        </div>
      </div>

      <div className="settings-sections">

        <div className="settings-card">
          <h2 className="settings-card-title">Imię</h2>
          <p className="settings-card-desc">Zmień imię widoczne w aplikacji</p>
          <form className="settings-form">
            <input type="text" placeholder="Twoje imię" />
            <button type="submit">Zapisz</button>
          </form>
        </div>

        <div className="settings-card">
          <h2 className="settings-card-title">Adres email</h2>
          <p className="settings-card-desc">Zmień adres przypisany do konta</p>
          <form className="settings-form">
            <input type="email" placeholder="twoj@email.com" />
            <button type="submit">Zapisz</button>
          </form>
        </div>

        <div className="settings-card settings-card--wide">
          <h2 className="settings-card-title">Hasło</h2>
          <p className="settings-card-desc">Aby zmienić hasło, najpierw potwierdź aktualne</p>
          <form className="settings-form settings-form--password">
            <div className="settings-form-row">
              <div className="settings-form-group">
                <label>Aktualne hasło</label>
                <div className="password-wrapper">
                  <input type={showCurrent ? 'text' : 'password'} placeholder="••••••••" />
                  <button type="button" className="password-toggle" onClick={() => setShowCurrent(p => !p)} aria-label={showCurrent ? 'Ukryj hasło' : 'Pokaż hasło'}>
                    <span className="password-toggle-icon" key={showCurrent ? 1 : 0}>{showCurrent ? <EyeOpen /> : <EyeClosed />}</span>
                  </button>
                </div>
              </div>
              <div className="settings-form-group">
                <label>Nowe hasło</label>
                <div className="password-wrapper">
                  <input type={showNew ? 'text' : 'password'} placeholder="Minimum 8 znaków" />
                  <button type="button" className="password-toggle" onClick={() => setShowNew(p => !p)} aria-label={showNew ? 'Ukryj hasło' : 'Pokaż hasło'}>
                    <span className="password-toggle-icon" key={showNew ? 1 : 0}>{showNew ? <EyeOpen /> : <EyeClosed />}</span>
                  </button>
                </div>
              </div>
              <div className="settings-form-group">
                <label>Powtórz nowe hasło</label>
                <div className="password-wrapper">
                  <input type={showConfirm ? 'text' : 'password'} placeholder="Powtórz hasło" />
                  <button type="button" className="password-toggle" onClick={() => setShowConfirm(p => !p)} aria-label={showConfirm ? 'Ukryj hasło' : 'Pokaż hasło'}>
                    <span className="password-toggle-icon" key={showConfirm ? 1 : 0}>{showConfirm ? <EyeOpen /> : <EyeClosed />}</span>
                  </button>
                </div>
              </div>
            </div>
            <button type="submit">Zmień hasło</button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default UserSettings
