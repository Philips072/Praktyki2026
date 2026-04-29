import './Messages.css'
import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'

// ── Helpers ─────────────────────────────────────────────

function getInitials(name, email) {
  if (name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }
  const local = (email || '').split('@')[0]
  const parts = local.split(/[._-]/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return local.slice(0, 2).toUpperCase()
}

function fmtTime(iso) {
  const now = new Date()
  const date = new Date(iso)
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  const timeStr = date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })

  if (diffDays === 0) {
    return timeStr // Dziś: tylko godzina
  } else if (diffDays === 1) {
    return `Wczoraj, ${timeStr}` // Wczoraj
  } else if (diffDays < 7) {
    return `${diffDays}d temu, ${timeStr}` // 2-6 dni temu (skrócone "dni" -> "d")
  } else if (diffDays < 30) {
    return `${diffDays}d temu, ${timeStr}` // Do miesiąca: też skrócone
  } else {
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) + `, ${timeStr}` // Pełna data dla starszych wiadomości
  }
}

const AVATAR_COLORS = ['#39498f', '#2d6e4e', '#6b3a8f', '#8f3a3a', '#7a5c1e', '#1e6b7a', '#5c3a6b']
const ROLE_LABELS = { uczen: 'Uczeń', nauczyciel: 'Nauczyciel', administrator: 'Administrator' }

function Avatar({ initials, colorIndex = 0, size = 'md' }) {
  const bg = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length]
  return (
    <div className={`msg-avatar msg-avatar--${size}`} style={{ background: bg }}>
      {initials}
    </div>
  )
}

// ── Modal dodawania rozmowy ──────────────────────────────

function AddConversationModal({ onClose, onAdd, myEmail }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) { setError('Wpisz adres email.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setError('Nieprawidłowy adres email.'); return }
    if (trimmed === myEmail) { setError('Nie możesz napisać do siebie.'); return }

    setLoading(true)
    setError('')
    const { data, error: dbError } = await supabase
      .from('profiles')
      .select('id, name, email, role')
      .ilike('email', trimmed)
      .maybeSingle()
    setLoading(false)

    if (dbError) { setError(`Błąd: ${dbError.message}`); return }
    if (!data) { setError('Nie znaleziono użytkownika o tym adresie email.'); return }

    onAdd(data)
    onClose()
  }

  return (
    <div className="msg-modal-overlay" onClick={onClose}>
      <div className="msg-modal" onClick={e => e.stopPropagation()}>
        <div className="msg-modal-header">
          <h3 className="msg-modal-title">Nowa wiadomość</h3>
          <button className="msg-modal-close" onClick={onClose} aria-label="Zamknij">
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="msg-modal-label">Adres email osoby</label>
          <input
            ref={inputRef}
            className="msg-modal-input"
            type="email"
            placeholder="np. jan.kowalski@szkola.pl"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
          />
          {error && <p className="msg-modal-error">{error}</p>}
          <div className="msg-modal-actions">
            <button type="button" className="msg-modal-btn msg-modal-btn--ghost" onClick={onClose} disabled={loading}>Anuluj</button>
            <button type="submit" className="msg-modal-btn msg-modal-btn--primary" disabled={loading}>
              {loading ? 'Szukam…' : 'Rozpocznij rozmowę'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Główny komponent ─────────────────────────────────────

function Messages() {
  const { user, profile: myProfile } = useAuth()
  const [convs, setConvs] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [search, setSearch] = useState('')
  const [input, setInput] = useState('')
  const [mobileView, setMobileView] = useState('list')
  const [showAddModal, setShowAddModal] = useState(false)
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const [replyingTo, setReplyingTo] = useState(null)
  const messagesEndRef = useRef(null)
  const selectedRef = useRef(null)
  const convsRef = useRef(null)
  selectedRef.current = selected
  convsRef.current = convs

  const myInitials = getInitials(myProfile?.name, user?.email)

  // ── Presence tracking ────────────────────────────────────

  // Globalny kanał presence dla wszystkich użytkowników
  useEffect(() => {
    if (!user) return

    const presenceChannel = supabase.channel('global-presence', {
      config: {
        presence: {
          key: user.id,
        },
      },
    })

    // Nasłuchuj zmian presence
    presenceChannel.on('presence', { event: 'sync' }, () => {
      const state = presenceChannel.presenceState()
      const newOnlineUsers = new Set()
      Object.values(state).forEach(presences => {
        presences.forEach(p => {
          if (p.user_id && p.user_id !== user.id) {
            newOnlineUsers.add(p.user_id)
          }
        })
      })
      setOnlineUsers(newOnlineUsers)
    })

    // Dołącz do kanału i ustaw status online
    presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await presenceChannel.track({
          user_id: user.id,
          online_at: new Date().toISOString(),
        })
      }
    })

    // Kiedy użytkownik opuszcza stronę, wyloguj się z presence
    const handleBeforeUnload = () => {
      presenceChannel.untrack()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        presenceChannel.track({
          user_id: user.id,
          online_at: new Date().toISOString(),
        })
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      presenceChannel.untrack()
      supabase.removeChannel(presenceChannel)
    }
  }, [user])

  // ── Ładowanie rozmów ───────────────────────────────────

  const loadConversations = useCallback(async () => {
    if (!user) return
    setLoadingConvs(true)

    const { data: convRows } = await supabase
      .from('conversations')
      .select('id, participant1_id, participant2_id, created_at')
      .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)

    if (!convRows || convRows.length === 0) { setLoadingConvs(false); return }

    const otherIds = convRows.map(c =>
      c.participant1_id === user.id ? c.participant2_id : c.participant1_id
    )

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, email, role')
      .in('id', otherIds)

    const convList = await Promise.all(convRows.map(async conv => {
      const otherId = conv.participant1_id === user.id ? conv.participant2_id : conv.participant1_id
      const other = profiles?.find(p => p.id === otherId)

      const { data: lastMsgs } = await supabase
        .from('messages')
        .select('id, text, deleted, created_at')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)

      const { count: unread } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .eq('sender_id', otherId)
        .eq('read_by_recipient', false)

      const last = lastMsgs?.[0]
      return {
        id: conv.id,
        otherUserId: otherId,
        name: other?.name || other?.email || 'Nieznany',
        role: ROLE_LABELS[other?.role] ?? 'Użytkownik',
        initials: getInitials(other?.name, other?.email),
        online: onlineUsers.has(otherId),
        time: last ? fmtTime(last.created_at) : '',
        lastMessage: last?.deleted ? 'Wiadomość usunięta' : (last?.text ?? 'Brak wiadomości'),
        unread: unread ?? 0,
        createdAt: conv.created_at,
      }
    }))

    // Sortuj: najpierw te z ostatnią wiadomością (najnowsze), potem nowe rozmowy
    convList.sort((a, b) => {
      const ta = a.time || a.createdAt
      const tb = b.time || b.createdAt
      return tb > ta ? 1 : -1
    })

    setConvs(convList)
    setLoadingConvs(false)
  }, [user])

  // Aktualizuj status online bez przeładowania rozmów
  useEffect(() => {
    setConvs(prev => prev.map(c => ({
      ...c,
      online: onlineUsers.has(c.otherUserId)
    })))
  }, [onlineUsers])

  useEffect(() => { loadConversations() }, [loadConversations])

  // Przy pierwszym załadowaniu otwórz pierwszą rozmowę
  const initializedRef = useRef(false)
  useEffect(() => {
    if (!initializedRef.current && convs.length > 0) {
      initializedRef.current = true
      setSelected(convs[0])
    }
  }, [convs])

  // ── Wiadomości ──────────────────────────────────────────

  const loadMessages = useCallback(async (convId, otherUserId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, sender_id, text, deleted, read_by_recipient, created_at, reply_to')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Błąd ładowania wiadomości:', error)
        // Jeśli błąd jest spowodowany brakiem kolumny reply_to, spróbuj bez niej
        if (error.message?.includes('column') || error.message?.includes('reply_to')) {
          const fallbackData = await supabase
            .from('messages')
            .select('id, sender_id, text, deleted, read_by_recipient, created_at')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true })

          setMessages(fallbackData.data ?? [])
        } else {
          setMessages([])
        }
      } else {
        setMessages(data ?? [])

        // Oznacz wiadomości od drugiej osoby jako przeczytane
        if (otherUserId) {
          await supabase
            .from('messages')
            .update({ read_by_recipient: true })
            .eq('conversation_id', convId)
            .eq('sender_id', otherUserId)
            .eq('read_by_recipient', false)

          setConvs(prev => prev.map(c => c.id === convId ? { ...c, unread: 0 } : c))
        }
      }
    } catch (err) {
      console.error('Błąd ładowania wiadomości:', err)
      setMessages([])
    }
  }, [])

  useEffect(() => {
    if (selected?.id) loadMessages(selected.id, selected.otherUserId)
  }, [selected?.id])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // ── Real-time ───────────────────────────────────────────

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`msgs-${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        const msg = { ...payload.new, reply_to: payload.new.reply_to }
        const cur = selectedRef.current

        if (cur && msg.conversation_id === cur.id) {
          // Dodaj do bieżącego czatu
          setMessages(prev => [...prev, msg])
          // Oznacz jako przeczytane jeśli to wiadomość od drugiej osoby
          if (msg.sender_id !== user.id) {
            await supabase.from('messages').update({ read_by_recipient: true }).eq('id', msg.id)
          }
          // Aktualizuj ostatnią wiadomość na liście
          setConvs(prev => prev.map(c =>
            c.id === msg.conversation_id
              ? { ...c, lastMessage: msg.deleted ? 'Wiadomość usunięta' : msg.text, time: fmtTime(msg.created_at) }
              : c
          ))
        } else {
          // Nowa wiadomość w innej rozmowie — sprawdź czy rozmowa istnieje w aktualnym stanie
          const currentConvs = convsRef.current
          const convExists = currentConvs.some(c => c.id === msg.conversation_id)
          if (convExists) {
            setConvs(prev => prev.map(c =>
              c.id === msg.conversation_id
                ? {
                    ...c,
                    lastMessage: msg.deleted ? 'Wiadomość usunięta' : msg.text,
                    time: fmtTime(msg.created_at),
                    unread: msg.sender_id !== user.id ? c.unread + 1 : c.unread,
                  }
                : c
            ))
          } else {
            // Nowa rozmowa — ktoś napisał pierwszy
            await loadConversations()
          }
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new
        if (selectedRef.current?.id === msg.conversation_id) {
          setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, ...msg } : m))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, loadConversations])

  // ── Handlers ────────────────────────────────────────────

  const handleSelect = async (conv) => {
    setSelected(conv)
    setMobileView('chat')
    await loadMessages(conv.id, conv.otherUserId)
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || !selected || !user) return
    setInput('')

    const messageData = {
      conversation_id: selected.id,
      sender_id: user.id,
      text,
    }

    // Dodaj reply_to jeśli odpowiadamy na wiadomość
    if (replyingTo) {
      messageData.reply_to = replyingTo.id
    }

    try {
      await supabase.from('messages').insert(messageData)
      setReplyingTo(null)
    } catch (err) {
      console.error('Błąd wysyłania wiadomości:', err)
      // Jeśli błąd jest spowodowany brakiem kolumny reply_to, spróbuj bez niej
      if (err.message?.includes('column') || err.message?.includes('reply_to')) {
        const fallbackData = {
          conversation_id: selected.id,
          sender_id: user.id,
          text,
        }
        await supabase.from('messages').insert(fallbackData)
        setReplyingTo(null)
      }
    }
  }

  const handleDeleteMsg = async (msgId) => {
    await supabase.from('messages').update({ deleted: true }).eq('id', msgId)
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, deleted: true } : m))
  }

  const handleReply = (msg) => {
    setReplyingTo(msg)
    // Focus na input po ustawieniu reply
    setTimeout(() => {
      document.querySelector('.msg-input')?.focus()
    }, 100)
  }

  const cancelReply = () => {
    setReplyingTo(null)
  }

  const handleAddConversation = async (otherProfile) => {
    if (!user) return

    // Sprawdź czy rozmowa już istnieje lokalnie
    const existing = convs.find(c => c.otherUserId === otherProfile.id)
    if (existing) { setSelected(existing); setMobileView('chat'); return }

    // Utwórz w bazie
    const { data, error } = await supabase
      .from('conversations')
      .insert({ participant1_id: user.id, participant2_id: otherProfile.id })
      .select()
      .single()

    if (error) {
      // Mogła już istnieć (unique constraint) — pobierz istniejącą
      const { data: found } = await supabase
        .from('conversations')
        .select('id, participant1_id, participant2_id, created_at')
        .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${otherProfile.id}),and(participant1_id.eq.${otherProfile.id},participant2_id.eq.${user.id})`)
        .maybeSingle()
      if (found) await loadConversations()
      return
    }

    const newConv = {
      id: data.id,
      otherUserId: otherProfile.id,
      name: otherProfile.name || otherProfile.email,
      role: ROLE_LABELS[otherProfile.role] ?? 'Użytkownik',
      initials: getInitials(otherProfile.name, otherProfile.email),
      online: onlineUsers.has(otherProfile.id),
      time: '',
      lastMessage: 'Brak wiadomości',
      unread: 0,
      createdAt: data.created_at,
    }
    setConvs(prev => [newConv, ...prev])
    setSelected(newConv)
    setMessages([])
    setMobileView('chat')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const filtered = convs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  // ── Render ──────────────────────────────────────────────

  return (
    <div className="msg-page">
      {showAddModal && (
        <AddConversationModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddConversation}
          myEmail={user?.email}
        />
      )}

      {/* ── Lista rozmów ── */}
      <aside className={`msg-sidebar ${mobileView === 'chat' ? 'msg-sidebar--hidden' : ''}`}>
        <div className="msg-sidebar-top">
          <div className="msg-search-row">
            <div className="msg-search-wrap">
              <svg className="msg-search-icon" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                className="msg-search"
                placeholder="Szukaj wiadomości..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="msg-add-btn" onClick={() => setShowAddModal(true)} title="Nowa rozmowa">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="msg-conv-list">
          {loadingConvs && <p className="msg-conv-placeholder">Ładowanie…</p>}
          {!loadingConvs && filtered.length === 0 && (
            <p className="msg-conv-placeholder">Brak rozmów. Kliknij + aby dodać.</p>
          )}
          {filtered.map((conv, i) => (
            <button
              key={conv.id}
              className={`msg-conv-item${selected?.id === conv.id ? ' msg-conv-item--active' : ''}`}
              onClick={() => handleSelect(conv)}
            >
              <div className="msg-conv-avatar-wrap">
                <Avatar initials={conv.initials} colorIndex={i} />
                {onlineUsers.has(conv.otherUserId) && <span className="msg-online-dot" />}
              </div>
              <div className="msg-conv-info">
                <div className="msg-conv-row">
                  <span className="msg-conv-name">{conv.name}</span>
                  <span className="msg-conv-time">{conv.time}</span>
                </div>
                <div className="msg-conv-row">
                  <span className="msg-conv-role">{conv.role}</span>
                  {conv.unread > 0 && <span className="msg-unread-badge">{conv.unread}</span>}
                </div>
                <p className="msg-conv-last">{conv.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* ── Okno czatu ── */}
      <div className={`msg-chat ${mobileView === 'list' ? 'msg-chat--hidden' : ''}`}>
        {selected ? (
          <>
            <div className="msg-chat-header">
              <button className="msg-back-btn" onClick={() => setMobileView('list')} aria-label="Wróć">
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <Avatar initials={selected.initials} size="sm" />
              <div className="msg-chat-header-info">
                <span className="msg-chat-name">{selected.name}</span>
                <span className={`msg-chat-status ${onlineUsers.has(selected.otherUserId) ? 'msg-chat-status--online' : ''}`}>
                  {onlineUsers.has(selected.otherUserId) ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            <div className="msg-messages">
              {messages.length === 0 && (
                <div className="msg-empty-chat">Napisz pierwszą wiadomość!</div>
              )}
              {messages.map(msg => {
                const isMe = msg.sender_id === user?.id
                const repliedMsg = msg.reply_to ? messages.find(m => m.id === msg.reply_to) : null

                return (
                  <div key={msg.id} className={`msg-row ${isMe ? 'msg-row--me' : 'msg-row--them'}`}>
                    {isMe && <Avatar initials={myInitials} size="sm" />}
                    {!isMe && <Avatar initials={selected.initials} size="sm" />}
                    <div className="msg-bubble-wrap">
                      {repliedMsg && (
                        <div className="msg-reply-indicator">
                          <svg viewBox="0 0 24 24" fill="none" width="12" height="12">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="msg-reply-preview-text">
                            {repliedMsg.deleted ? 'Wiadomość usunięta' : repliedMsg.text.substring(0, 40) + (repliedMsg.text.length > 40 ? '...' : '')}
                          </span>
                        </div>
                      )}
                      <div className={`msg-bubble ${isMe ? 'msg-bubble--me' : 'msg-bubble--them'}${msg.deleted ? ' msg-bubble--deleted' : ''}`}>
                        {isMe && !msg.deleted && (
                          <button
                            className="msg-delete-btn"
                            onClick={() => handleDeleteMsg(msg.id)}
                            aria-label="Usuń wiadomość"
                            title="Usuń wiadomość"
                          >
                            <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                              <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <path d="M8 6V4h8v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        )}
                        {msg.deleted
                          ? <span className="msg-deleted-text">Wiadomość usunięta</span>
                          : msg.text}
                      </div>
                      <div className="msg-message-actions">
                        <button
                          className="msg-reply-btn"
                          onClick={() => handleReply(msg)}
                          aria-label="Odpowiedz na wiadomość"
                        >
                          <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <span className="msg-time">{fmtTime(msg.created_at)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="msg-input-bar">
              {replyingTo && (
                <div className="msg-reply-preview">
                  <span className="msg-reply-label">Odpowiadasz na:</span>
                  <span className="msg-reply-text">
                    {replyingTo.deleted
                      ? 'Wiadomość usunięta'
                      : replyingTo.text.length > 50
                        ? replyingTo.text.substring(0, 50) + '...'
                        : replyingTo.text}
                  </span>
                  <button
                    className="msg-reply-cancel"
                    onClick={cancelReply}
                    aria-label="Anuluj odpowiedź"
                  >
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              )}
              <div className="msg-input-container">
                <input
                  className="msg-input"
                  placeholder={replyingTo ? "Napisz odpowiedź..." : "Napisz wiadomość..."}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="msg-send-btn" onClick={handleSend} disabled={!input.trim()}>
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                    <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="msg-empty">
            <p>{loadingConvs ? 'Ładowanie…' : 'Wybierz rozmowę, aby zacząć'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages
