import {
  initializeDatabase as apiInitialize,
  executeSQL as apiExecute,
  getDatabaseTables as apiGetTables,
  getTableSchema as apiGetSchema,
  getTableData as apiGetData,
  resetDatabase as apiReset,
  downloadDatabase as apiDownload,
  uploadDatabase as apiUpload,
  databaseExists as apiExists
} from './api.js'

const getUserId = () => {
  const userStr = localStorage.getItem('user')
  console.log('localStorage.user:', userStr)
  if (!userStr) return 'guest'
  try {
    const user = JSON.parse(userStr)
    console.log('Parsed user:', user)
    return user.id || 'guest'
  } catch {
    console.error('Error parsing user:', userStr)
    return 'guest'
  }
}

export const loadSQL = async () => {
  return true
}

export const createLessonDatabase = async (lessonId) => {
  console.log('createLessonDatabase called with lessonId:', lessonId)
  const userId = getUserId()
  console.log('createLessonDatabase userId:', userId)
  return await apiInitialize(userId, lessonId)
}

export const loadDatabaseFromBuffer = async (buffer) => {
  return true
}

export const saveDatabaseToLocalStorage = (userId, lessonId, buffer) => {
  return true
}

export const loadDatabaseFromLocalStorage = (userId, lessonId) => {
  return null
}

export const getDatabaseTables = async (db) => {
  const userId = getUserId()
  const result = await apiGetTables(userId, db.lessonId)
  return result.tables || []
}

export const getTableSchema = async (db, tableName) => {
  const userId = getUserId()
  const result = await apiGetSchema(userId, db.lessonId, tableName)
  return result.schema || []
}

export const getTableData = async (db, tableName, limit = 100) => {
  const userId = getUserId()
  const result = await apiGetData(userId, db.lessonId, tableName, limit)
  return {
    columns: result.columns || [],
    rows: result.rows || []
  }
}

export const executeSQL = async (db, sql) => {
  console.log('executeSQL called with db:', db, 'sql:', sql)
  const userId = getUserId()
  return await apiExecute(userId, db.lessonId, sql)
}

export const downloadDatabase = (buffer, filename = 'database.sqlite') => {
  const blob = new Blob([buffer], { type: 'application/x-sqlite3' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const uploadDatabase = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const buffer = e.target.result
      resolve(buffer)
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export const resetLessonDatabase = async (userId, lessonId) => {
  return await apiReset(userId, lessonId)
}

export const resetDatabase = resetLessonDatabase

export const databaseExists = async (lessonId) => {
  const userId = getUserId()
  console.log('databaseExists called with:', { userId, lessonId })
  const result = await apiExists(userId, lessonId)
  console.log('databaseExists result:', result)
  return result.exists || false
}

export const uploadDatabaseToServer = async (file, lessonId) => {
  const buffer = await uploadDatabase(file)
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
  const userId = getUserId()
  return await apiUpload(userId, lessonId, base64)
}

export const downloadDatabaseFromServer = async (lessonId, filename = 'database.sqlite') => {
  const userId = getUserId()
  const result = await apiDownload(userId, lessonId)
  if (result.data) {
    const buffer = Uint8Array.from(atob(result.data), c => c.charCodeAt(0))
    downloadDatabase(buffer, filename)
  }
}
