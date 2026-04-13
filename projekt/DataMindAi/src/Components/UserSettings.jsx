import './UserSettings.css'

function UserSettings() {
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
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
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
                <input type="password" placeholder="••••••••" />
              </div>
              <div className="settings-form-group">
                <label>Nowe hasło</label>
                <input type="password" placeholder="Minimum 8 znaków" />
              </div>
              <div className="settings-form-group">
                <label>Powtórz nowe hasło</label>
                <input type="password" placeholder="Powtórz hasło" />
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
