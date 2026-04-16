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

const AI_MODEL = 'mistral-small-latest'
const MISTRAL_KEY = import.meta.env.VITE_MISTRAL_KEY

async function askGemma(userText) {
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MISTRAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: `Jesteś przyjaznym asystentem platformy DataMindAI do nauki SQL. Użytkownik pisze Ci o swoich zainteresowaniach. Odpowiedz w formacie JSON (i tylko JSON, bez markdown):
{
  "message": "<ciepła, ludzka reakcja po polsku, 2-3 zdania — zacznij od czegoś w stylu 'Okej, super!' albo 'Fajnie!', odnieś się do tego co użytkownik napisał i powiedz że dostosujesz ćwiczenia SQL do tych zainteresowań>",
  "interests": "<przepisz zainteresowania użytkownika w 2. osobie liczby pojedynczej po polsku — używaj WYŁĄCZNIE informacji które użytkownik podał, nie dodawaj żadnych szczegółów, przykładów ani domysłów których nie było w wiadomości>"
}`,
        },
        {
          role: 'user',
          content: userText,
        },
      ],
      max_tokens: 250,
      temperature: 0.8,
    }),
  })
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    const msg = errBody?.error?.message || errBody?.message || `HTTP ${res.status}`
    throw new Error(msg)
  }
  const data = await res.json()
  const raw = data.choices[0].message.content.trim()
  try {
    return JSON.parse(raw)
  } catch {
    // Fallback jeśli AI nie zwróci poprawnego JSON
    return { message: raw, interests: raw }
  }
}

// Krok 2 — chat AI o zainteresowaniach
function InterestsStep({ onBack, onFinish, loading }) {
  const [input, setInput] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [aiMessage, setAiMessage] = useState('')
  const [aiInterests, setAiInterests] = useState('')
  const [thinking, setThinking] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setUserMessage(trimmed)
    setInput('')
    setThinking(true)
    setError('')
    try {
      const { message, interests } = await askGemma(trimmed)
      setAiMessage(message)
      setAiInterests(interests)
    } catch (err) {
      setError(`Błąd AI: ${err.message}`)
      setUserMessage('')
    } finally {
      setThinking(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const replied = !!aiMessage

  return (
    <div className="ob-step ob-step--interests">
      <img src={logo} alt="DataMindAI" className="ob-logo" />
      <div className="ob-progress">
        <div className="ob-progress-bar ob-progress-bar--active" />
        <div className="ob-progress-bar ob-progress-bar--active" />
      </div>

      <div className="aichat-box ob-aichat-box">
        <div className="aichat-messages">

          {/* Wiadomość AI — pytanie */}
          <div className="aichat-row aichat-row--ai">
            <div className="aichat-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#fcf6f3"/>
              </svg>
            </div>
            <div className="aichat-bubble aichat-bubble--ai">
              <p className="aichat-line">Hej! Zanim zaczniemy naukę SQL — napisz czym się interesujesz.</p>
              <p className="aichat-line">Może to być praca, hobby, sport, finanse — cokolwiek. Dostosujemy do tego przykłady i ćwiczenia.</p>
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

          {/* Wskaźnik pisania */}
          {thinking && (
            <div className="aichat-row aichat-row--ai">
              <div className="aichat-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#fcf6f3"/>
                </svg>
              </div>
              <div className="aichat-bubble aichat-bubble--ai msg-bubble--typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          {/* Odpowiedź AI */}
          {replied && (
            <div className="aichat-row aichat-row--ai">
              <div className="aichat-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#fcf6f3"/>
                </svg>
              </div>
              <div className="aichat-bubble aichat-bubble--ai">
                <p className="aichat-line">{aiMessage}</p>
                <p className="aichat-line" style={{ marginTop: 6, opacity: 0.7, fontSize: '0.82rem' }}>
                  Twój profil zainteresowań został zapisany. Gotowy do nauki!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        {!replied && !thinking && (
          <div className="aichat-input-bar">
            {error && <p style={{ color: '#e05a5a', fontSize: '0.8rem', padding: '0 12px 8px' }}>{error}</p>}
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
        {!replied && !thinking && (
          <button className="ob-btn ob-btn--ghost" onClick={onBack} type="button">
            Wstecz
          </button>
        )}
        {!replied && !thinking && (
          <button className="ob-btn ob-btn--ghost" onClick={() => onFinish(null)} type="button">
            Pomiń
          </button>
        )}
        {replied && (
          <button
            className="ob-btn ob-btn--primary"
            onClick={() => onFinish(aiInterests)}
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
