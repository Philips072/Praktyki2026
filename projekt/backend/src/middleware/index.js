/**
 * Wszystkie middlewary w jednym miejscu
 */

export { errorHandler } from './errorHandler.js'

export {
  securityMiddleware
} from './security.js'

export {
  generalLimiter,
  aiLimiter,
  sqlLimiter,
  dbResetLimiter
} from './rateLimiter.js'

export { logger } from './logger.js'
export { compress } from './compression.js'
export { requireAuth, optionalAuth } from './auth.js'
export { requestId } from './requestId.js'
export { healthCheck } from './health.js'

// Validation
export {
  validate,
  validateParams,
  initializeSchema,
  executeSchema,
  existsSchema,
  resetSchema,
  chatSchema,
  interestsSchema,
  validateExerciseSchema,
  hintSchema,
  personalizedContentSchema,
  paramsUserIdLessonId,
  paramsUserIdLessonIdTable
} from './validation.js'
