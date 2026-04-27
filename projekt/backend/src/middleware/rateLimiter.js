import rateLimit from 'express-rate-limit'

/**
 * Ogólny rate limiter dla wszystkich endpointów
 * 100 requestów na 15 minut
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Zbyt wiele requestów. Spróbuj ponownie za 15 minut.' },
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * Bardziej restrykcyjny limiter dla AI endpointów (droższe w użyciu)
 * 20 requestów na 5 minut
 */
export const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: { error: 'Limit zapytań AI osiągnięty. Spróbuj ponownie za 5 minut.' },
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * Strict limiter dla operacji wykonujących SQL (potencjalnie niebezpieczne)
 * 50 requestów na 10 minut
 */
export const sqlLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: { error: 'Zbyt wiele zapytań SQL. Spróbuj ponownie za 10 minut.' },
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * Bardzo restrykcyjny limiter dla inicjalizacji/resetu baz
 * 5 requestów na godzinę
 */
export const dbResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Zbyt wielu prób resetu bazy. Spróbuj ponownie za godzinę.' },
  standardHeaders: true,
  legacyHeaders: false,
})
