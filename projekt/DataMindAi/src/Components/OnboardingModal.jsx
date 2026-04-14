import './OnboardingModal.css'
import './AiChat.css'
import { useState } from 'react'
import logo from '../assets/nazwa.PNG'

const LEVELS = [
  {
    id: 'poczatkujacy',
    label: 'Początkujący',
    desc: 'Nigdy nie pracowałem z SQL',
  },
  {
    id: 'sredniozaawansowany',
    label: 'Średniozaawansowany',
    desc: 'Znam podstawy SELECT, WHERE, JOIN',
  },
  {
    id: 'zaawansowany',
    label: 'Zaawansowany',
    desc: 'Używam SQL regularnie w pracy',
  },
]

// Krok 1 — wybór poziomu
function LevelStep({ selected, onSelect, onNext }) {
  return (
    <div className="ob-step ob-step--level">
      <img src={logo} alt="DataMindAI" className="ob-logo" />
      <div className="ob-progress">
        <div className="ob-progress-bar ob-progress-bar--active" />
        <div className="ob-progress-bar" />
      </div>
      <h2 className="ob-title">Twoje doświadczenie z SQL</h2>
      <p className="ob-subtitle">Pomóż nam dostosować poziom trudności do Twoich umiejętności</p>

      <div className="ob-levels">
        {LEVELS.map(lvl => (
          <button
            key={lvl.id}
            className={`ob-level-card${selected === lvl.id ? ' ob-level-card--active' : ''}`}
            onClick={() => onSelect(lvl.id)}
            type="button"
          >
            <span className="ob-level-name">{lvl.label}</span>
            <span className="ob-level-desc">{lvl.desc}</span>
          </button>
        ))}
      </div>

      <div className="ob-actions">
        <button className="ob-btn ob-btn--primary" onClick={onNext} disabled={!selected}>
          Rozpocznij naukę &rarr;
        </button>
      </div>
    </div>
  )
}

// Krok 2 — chat AI o zainteresowaniach
function InterestsStep({ onBack, onFinish, loading }) {
  const [input, setInput] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [replied, setReplied] = useState(false)

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setUserMessage(trimmed)
    setReplied(true)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="ob-step ob-step--interests">
      <img src={logo} alt="DataMindAI" className="ob-logo" />
      <div className="ob-progress">
        <div className="ob-progress-bar ob-progress-bar--active" />
        <div className="ob-progress-bar ob-progress-bar--active" />
      </div>

      {/* Box identyczny jak na AIChatPage */}
      <div className="aichat-box ob-aichat-box">
        <div className="aichat-messages">

          {/* Wiadomość AI */}
          <div className="aichat-row aichat-row--ai">
            <div className="aichat-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#fcf6f3"/>
              </svg>
            </div>
            <div className="aichat-bubble aichat-bubble--ai">
              <p className="aichat-line">Świetnie! Napisz czym się interesujesz — dostosujemy do tego przykłady i ćwiczenia.</p>
              <p className="aichat-line">Możesz napisać o swojej pracy, hobby lub dziedzinach, które Cię fascynują.</p>
            </div>
          </div>

          {/* Odpowiedź użytkownika */}
          {replied && (
            <div className="aichat-row aichat-row--user">
              <div className="aichat-bubble aichat-bubble--user">
                <p className="aichat-line">{userMessage}</p>
              </div>
            </div>
          )}

          {/* Odpowiedź AI po wysłaniu */}
          {replied && (
            <div className="aichat-row aichat-row--ai">
              <div className="aichat-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#fcf6f3"/>
                </svg>
              </div>
              <div className="aichat-bubble aichat-bubble--ai">
                <p className="aichat-line">Doskonale! Twój profil jest gotowy. Czas zacząć naukę!</p>
              </div>
            </div>
          )}
        </div>

        {/* Input bar — tylko przed wysłaniem */}
        {!replied && (
          <div className="aichat-input-bar">
            <input
              className="aichat-input"
              type="text"
              placeholder="Np. analiza danych, marketing, finanse..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
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
      </div>

      <div className="ob-actions">
        {!replied && (
          <button className="ob-btn ob-btn--ghost" onClick={onBack} type="button">
            Wstecz
          </button>
        )}
        {replied && (
          <button
            className="ob-btn ob-btn--primary"
            onClick={() => onFinish(userMessage)}
            disabled={loading}
            type="button"
          >
            {loading ? 'Zapisywanie...' : 'Przejdź do nauki →'}
          </button>
        )}
      </div>
    </div>
  )
}

// Eksportowana treść onboardingu — bez wrappera strony
function OnboardingContent({ onComplete }) {
  const [step, setStep] = useState(1)
  const [level, setLevel] = useState('')
  const [saving, setSaving] = useState(false)

  const handleFinish = async (interests) => {
    setSaving(true)
    await onComplete({ sql_level: level, interests })
    setSaving(false)
  }

  return (
    <div className="ob-card">
      {step === 1 && (
        <LevelStep
          selected={level}
          onSelect={setLevel}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <InterestsStep
          onBack={() => setStep(1)}
          onFinish={handleFinish}
          loading={saving}
        />
      )}
    </div>
  )
}

export default OnboardingContent
