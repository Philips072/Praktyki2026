import { useState } from 'react';
import './AiChat.css';

const initialMessages = [
  {
    id: 1,
    role: 'ai',
    text: 'Cześć! Jestem Twoim asystentem AI :3',
  },
];

function AiChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: trimmed }]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="aichat-page">

      <div className="aichat-topbar">
        <button className="aichat-menu-btn">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <p className="aichat-date">poniedziałek, 13 kwietnia 2026</p>
      </div>

      <div className="aichat-header">
        <h1 className="aichat-title">AI Chat</h1>
        <p className="aichat-subtitle">tytul</p>
      </div>

      <div className="aichat-box">
        <div className="aichat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`aichat-row ${msg.role === 'ai' ? 'aichat-row--ai' : 'aichat-row--user'}`}>
              {msg.role === 'ai' && (
                <div className="aichat-avatar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#fcf6f3"/>
                  </svg>
                </div>
              )}
              <div className={`aichat-bubble ${msg.role === 'ai' ? 'aichat-bubble--ai' : 'aichat-bubble--user'}`}>
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className="aichat-line">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="aichat-input-bar">
          <input
            className="aichat-input"
            type="text"
            placeholder="Zadaj pytanie o SQL..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="aichat-send-btn" onClick={sendMessage}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="#fcf6f3"/>
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}

export default AiChat;