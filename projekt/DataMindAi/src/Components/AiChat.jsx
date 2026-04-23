import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './AiChat.css';
import { sendChat } from '../api';

const initialMessages = [
  {
    id: 1,
    role: 'ai',
    text: `Cześć! Jestem Twoim asystentem AI w DataMindAI!

Pomagam w nauce SQL i analizie danych. Możesz mnie zapytać o podstawy, zaawansowane zapytania, optymalizację lub wytłumaczenie kodu. Wpisz swoje pytanie, a postaram się pomóc!`,
  },
];

function AiChat() {
  // Inicjalizuj stan z localStorage od razu
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = localStorage.getItem('aichat_messages');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (parsed && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Błąd podczas wczytywania historii:', e);
    }
    return initialMessages;
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFirstRender = useRef(true);

  // Zapisuj historię do localStorage przy każdej zmianie (ale nie przy pierwszym renderze)
  useEffect(() => {
    if (!isFirstRender.current) {
      localStorage.setItem('aichat_messages', JSON.stringify(messages));
    } else {
      isFirstRender.current = false;
    }
  }, [messages]);

  const startNewConversation = () => {
    setMessages(initialMessages);
    setInput('');
    setError(null);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Dodaj wiadomość użytkownika
    const userMessage = { id: Date.now(), role: 'user', text: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Przygotuj wiadomości w formacie wymaganym przez API
      const apiMessages = messages
        .slice(1) // Pomiń wstępną wiadomość powitalną
        .map(msg => ({
          role: msg.role === 'ai' ? 'assistant' : 'user',
          content: msg.text
        }));

      // Dodaj nową wiadomość użytkownika
      apiMessages.push({
        role: 'user',
        content: trimmed
      });

      const response = await sendChat(apiMessages);

      // Dodaj odpowiedź AI
      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        text: response.reply
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error('Błąd podczas wysyłania wiadomości:', err);
      setError('Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.');

      // Dodaj wiadomość o błędzie
      const errorMessage = {
        id: Date.now() + 1,
        role: 'ai',
        text: 'Przepraszam, wystąpił błąd. Spróbuj ponownie.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="aichat-page">


      <div className="aichat-header">
        <div>
          <h1 className="aichat-title">AI Chat</h1>
          <p className="aichat-subtitle">Zapytaj Twojego asystenta AI o cokolwiek</p>
        </div>
        <button className="aichat-new-chat-btn" onClick={startNewConversation}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#fcf6f3"/>
          </svg>
          Nowa konwersacja
        </button>
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
                {msg.role === 'ai' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: ({ node, inline, className, children, ...props }) => {
                        if (inline) {
                          return (
                            <code className="aichat-inline-code" {...props}>
                              {children}
                            </code>
                          );
                        }
                        const codeText = String(children).replace(/\n$/, '');

                        // Sprawdź czy kod zawiera tabelę w formacie markdown
                        if (codeText.includes('|') && codeText.includes('---')) {
                          const lines = codeText.trim().split('\n').filter(line => line.trim());

                          if (lines.length >= 2) {
                            const hasSeparator = lines.some(line => line.includes('---'));

                            if (hasSeparator) {
                              const dataLines = lines.filter(line => !line.includes('---'));
                              const tableData = dataLines
                                .map(line => line.split('|').map(cell => cell.trim()).filter(cell => cell !== ''));

                              if (tableData.length >= 1) {
                                const headers = tableData[0];
                                const rows = tableData.slice(1);

                                return (
                                  <div className="aichat-table-wrapper">
                                    <div className="aichat-table-container">
                                      <table className="aichat-table">
                                        <thead className="aichat-table-head">
                                          <tr className="aichat-table-row">
                                            {headers.map((header, i) => (
                                              <th key={i} className="aichat-table-header">{header}</th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody className="aichat-table-body">
                                          {rows.map((row, rowIndex) => (
                                            <tr key={rowIndex} className="aichat-table-row">
                                              {row.map((cell, cellIndex) => (
                                                <td key={cellIndex} className="aichat-table-cell">{cell}</td>
                                              ))}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                );
                              }
                            }
                          }
                        }

                        return (
                          <pre className="aichat-code-block">
                            <code className="aichat-inline-code" {...props}>
                              {children}
                            </code>
                          </pre>
                        );
                      },
                      p: ({ children }) => <p className="aichat-line">{children}</p>,
                      strong: ({ children }) => <strong className="aichat-strong">{children}</strong>,
                      em: ({ children }) => <em className="aichat-em">{children}</em>,
                      table: ({ children }) => <div className="aichat-table-wrapper"><div className="aichat-table-container"><table className="aichat-table">{children}</table></div></div>,
                      thead: ({ children }) => <thead className="aichat-table-head">{children}</thead>,
                      tbody: ({ children }) => <tbody className="aichat-table-body">{children}</tbody>,
                      tr: ({ children }) => <tr className="aichat-table-row">{children}</tr>,
                      th: ({ children }) => <th className="aichat-table-header">{children}</th>,
                      td: ({ children }) => <td className="aichat-table-cell">{children}</td>,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text.split('\n').map((line, i) => (
                    <p key={i} className="aichat-line">{line}</p>
                  ))
                )}
              </div>
            </div>
          ))}

          {/* Wskaźnik ładowania */}
          {isLoading && (
            <div className="aichat-row aichat-row--ai">
              <div className="aichat-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#fcf6f3"/>
                </svg>
              </div>
              <div className="aichat-bubble aichat-bubble--ai aichat-loading">
                <span className="aichat-dot"></span>
                <span className="aichat-dot"></span>
                <span className="aichat-dot"></span>
              </div>
            </div>
          )}
        </div>

        <div className="aichat-input-bar">
          <input
            className="aichat-input"
            type="text"
            placeholder={isLoading ? "AI pisze..." : "Zadaj pytanie o SQL..."}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            className={`aichat-send-btn ${isLoading ? 'aichat-send-btn--disabled' : ''}`}
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="aichat-send-spinner"></span>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="#fcf6f3"/>
              </svg>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}

export default AiChat;