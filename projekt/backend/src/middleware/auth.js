/**
 * Auth middleware - sprawdza czy użytkownik jest zalogowany
 * W tym projekcie autentykacja jest przez Supabase na froncie,
 * ale w przyszłości można dodać weryfikację JWT tutaj
 */

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - brak tokenu' })
  }

  const token = authHeader.split(' ')[1]

  // TODO: W przyszłości dodać weryfikację Supabase JWT tutaj
  // Na razie przechodzimy dalej - weryfikacja jest po stronie klienta
  req.user = { token }
  next()
}

/**
 * Opcjonalny auth - nie wymaga logowania, ale jeśli jest token to go dodaje
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer ')) {
    req.user = { token: authHeader.split(' ')[1] }
  }

  next()
}
