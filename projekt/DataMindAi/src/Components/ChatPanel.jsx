import { useState, useEffect, useRef } from 'react'

/**
 * ChatPanel — sekcja czatu nauczyciela z uczniami.
 *
 * Props:
 *   conversations — Array<{ studentId, studentName, messages: Array<{sender, content, timestamp}>, unread }>
 *   students      — Array<{ id, name, ... }> — do inicjowania nowych rozmów
 *   onSendMessage(studentId, message)
 *   onStartConversation(studentId)
 */
function ChatPanel({ conversations, students, onSendMessage, onStartConversation }) {
  const [activeConvId, setActiveConvId] = useState(
    conversations.length > 0 ? conversations[0].studentId : null
  )
  const [messageInput, setMessageInput] = useState('')
  const [showNewConvModal, setShowNewConvModal] = useState(false)

  // Referencja do dolnej krawędzi listy wiadomości — używana do auto-scroll
  const messagesEndRef = useRef(null)

  const activeConv = conversations.find(c => c.studentId === activeConvId)

  // Auto-scroll do najnowszej wiadomości gdy zmienia się rozmowa lub przychodzi nowa wiadomość
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv?.messages?.length, activeConvId])

  const handleSend = (e) => {
    e.preventDefault()
    if (!messageInput.trim() || !activeConvId) return
    onSendMessage(activeConvId, messageInput.trim())
    setMessageInput('')
  }

  // Enter wysyła, Shift+Enter = nowa linia
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e)
    }
  }

  return (
    <div className="tp-chat">
      {/* ── Lista rozmów (lewa kolumna) ── */}
      <aside className="tp-chat-sidebar">
        <div className="tp-chat-sidebar-header">
          <span className="tp-chat-sidebar-title">Rozmowy</span>
          <button
            className="tp-btn tp-btn--ghost tp-btn--sm"
            onClick={() => setShowNewConvModal(true)}
            title="Nowa rozmowa"
          >
            + Nowa
          </button>
        </div>

        {conversations.length === 0 && (
          <p className="tp-empty-state tp-empty-state--chat">Brak rozmów.</p>
        )}

        {conversations.map(conv => (
          <button
            key={conv.studentId}
            className={`tp-chat-conv-item ${activeConvId === conv.studentId ? 'tp-chat-conv-item--active' : ''}`}
            onClick={() => setActiveConvId(conv.studentId)}
          >
            {/* Avatar z inicjałami */}
            <span className="tp-avatar tp-avatar--sm">
              {conv.studentName.charAt(0).toUpperCase()}
            </span>
            <div className="tp-chat-conv-info">
              <span className="tp-chat-conv-name">{conv.studentName}</span>
              <span className="tp-chat-conv-preview">
                {/* Ostatnia wiadomość */}
                {conv.messages.length > 0
                  ? conv.messages[conv.messages.length - 1].content.slice(0, 40) + '…'
                  : 'Brak wiadomości'}
              </span>
            </div>
            {/* Badge z liczbą nieprzeczytanych */}
            {conv.unread > 0 && (
              <span className="tp-chat-unread-badge">{conv.unread}</span>
            )}
          </button>
        ))}
      </aside>

      {/* ── Panel wiadomości (prawa kolumna) ── */}
      <div className="tp-chat-main">
        {!activeConv ? (
          <div className="tp-chat-empty">
            <p>Wybierz rozmowę z listy lub rozpocznij nową.</p>
          </div>
        ) : (
          <>
            {/* Nagłówek rozmowy */}
            <div className="tp-chat-header">
              <span className="tp-avatar tp-avatar--sm">
                {activeConv.studentName.charAt(0).toUpperCase()}
              </span>
              <span className="tp-chat-header-name">{activeConv.studentName}</span>
            </div>

            {/* Historia wiadomości */}
            <div className="tp-chat-messages">
              {activeConv.messages.length === 0 && (
                <p className="tp-empty-state">Brak wiadomości. Napisz coś!</p>
              )}
              {activeConv.messages.map((msg, idx) => (
                <div
                  key={idx}
                  /* Sender 'teacher' wyrównany do prawej, 'student' do lewej */
                  className={`tp-chat-bubble tp-chat-bubble--${msg.sender === 'teacher' ? 'teacher' : 'student'}`}
                >
                  <span className="tp-chat-bubble-content">{msg.content}</span>
                  <span className="tp-chat-bubble-time">{msg.timestamp}</span>
                </div>
              ))}
              {/* Kotwica do auto-scroll */}
              <div ref={messagesEndRef} />
            </div>

            {/* Pole do pisania */}
            <form className="tp-chat-input-row" onSubmit={handleSend}>
              <textarea
                className="tp-input tp-chat-input"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Wpisz wiadomość… (Enter = wyślij, Shift+Enter = nowa linia)"
                rows={2}
              />
              <button
                type="submit"
                className="tp-btn tp-btn--primary tp-chat-send-btn"
                disabled={!messageInput.trim()}
              >
                Wyślij
              </button>
            </form>
          </>
        )}
      </div>

      {/* Modal inicjowania nowej rozmowy */}
      {showNewConvModal && (
        <div className="tp-modal-overlay" onClick={() => setShowNewConvModal(false)}>
          <div className="tp-modal" onClick={e => e.stopPropagation()}>
            <h3 className="tp-modal-title">Nowa rozmowa</h3>
            <p className="tp-text-secondary">Wybierz ucznia:</p>
            <ul className="tp-assign-list">
              {students.map(student => (
                <li key={student.id} className="tp-assign-item">
                  <span className="tp-avatar tp-avatar--sm">
                    {student.name.charAt(0)}
                  </span>
                  <span>{student.name}</span>
                  <button
                    className="tp-btn tp-btn--primary tp-btn--sm"
                    onClick={() => {
                      onStartConversation(student.id)
                      setActiveConvId(student.id)
                      setShowNewConvModal(false)
                    }}
                  >
                    Napisz
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="tp-btn tp-btn--ghost"
              onClick={() => setShowNewConvModal(false)}
            >
              Anuluj
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatPanel
