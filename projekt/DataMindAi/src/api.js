const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

async function post(path, body) {
  console.log('=== API POST ===', 'path:', path, 'body:', body)
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  console.log('Response status:', res.status)
  const data = await res.json();
  console.log('Response data:', data)
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// POST /api/ai/interests
// Zwraca { message, interests }
export const askInterests = (message) => post('/api/ai/interests', { message });

// POST /api/ai/chat
// Zwraca { reply }
export const sendChat = (messages) => post('/api/ai/chat', { messages });

// POST /api/sqlite/initialize
// Zwraca { success, message }
export const initializeDatabase = (userId, lessonId) => post('/api/sqlite/initialize', { userId, lessonId });

// POST /api/sqlite/execute
// Zwraca { success, message, affectedRows, data }
export const executeSQL = (userId, lessonId, sql) => post('/api/sqlite/execute', { userId, lessonId, sql });

// GET /api/sqlite/tables/:userId/:lessonId
// Zwraca { success, tables }
export const getDatabaseTables = (userId, lessonId) => fetch(`${BASE}/api/sqlite/tables/${userId}/${lessonId}`).then(r => r.json());

// GET /api/sqlite/schema/:userId/:lessonId/:tableName
// Zwraca { success, schema }
export const getTableSchema = (userId, lessonId, tableName) => fetch(`${BASE}/api/sqlite/schema/${userId}/${lessonId}/${tableName}`).then(r => r.json());

// GET /api/sqlite/data/:userId/:lessonId/:tableName?limit=N
// Zwraca { success, columns, rows }
export const getTableData = (userId, lessonId, tableName, limit = 100) => fetch(`${BASE}/api/sqlite/data/${userId}/${lessonId}/${tableName}?limit=${limit}`).then(r => r.json());

// POST /api/sqlite/reset
// Zwraca { success, message }
export const resetDatabase = (userId, lessonId) => post('/api/sqlite/reset', { userId, lessonId });

// POST /api/sqlite/download
// Zwraca { success, data: base64 }
export const downloadDatabase = (userId, lessonId) => post('/api/sqlite/download', { userId, lessonId });

// POST /api/sqlite/upload
// Zwraca { success, message }
export const uploadDatabase = (userId, lessonId, base64Data) => post('/api/sqlite/upload', { userId, lessonId, data: base64Data });

// POST /api/sqlite/exists
// Zwraca { success, exists }
export const databaseExists = (userId, lessonId) => post('/api/sqlite/exists', { userId, lessonId });

// GET /api/sqlite/full-schema/:userId/:lessonId
// Zwraca { success, schema: { tableName: { columns: [], foreignKeys: [] } } }
export const getDatabaseSchema = (userId, lessonId) => fetch(`${BASE}/api/sqlite/full-schema/${userId}/${lessonId}`).then(r => r.json());

// POST /api/ai/validate-exercise
// Zwraca { valid: boolean, reason: string }
export const validateExercise = (task, sql, result, validateOnly = false, schema = null) => post('/api/ai/validate-exercise', { task, sql, result, validateOnly, schema });

// POST /api/ai/hint
// Zwraca { hint: string }
export const getHint = (task, currentSql, schema) => post('/api/ai/hint', { task, currentSql, schema });

// POST /api/ai/personalized-content
// Zwraca { sections: array }
export const getPersonalizedContent = async (lessonTitle, lessonSubtitle, sections, interests, schema) => {
  console.log('=== getPersonalizedContent ===');
  console.log('Lesson Title:', lessonTitle);
  console.log('Interests:', interests);
  console.log('Sections count:', sections?.length);
  console.log('Schema count:', schema?.length);

  const result = await post('/api/ai/personalized-content', { lessonTitle, lessonSubtitle, sections, interests, schema });

  console.log('Result sections count:', result.sections?.length);
  console.log('First section:', result.sections?.[0]);

  return result;
};
