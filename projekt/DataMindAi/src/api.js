const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// POST /api/ai/interests
// Zwraca { message, interests }
export const askInterests = (message) => post('/api/ai/interests', { message });

// POST /api/ai/chat
// Zwraca { reply }
export const sendChat = (messages) => post('/api/ai/chat', { messages });
