import { z } from 'zod'

// ==================== SCHEMATY WALIDACJI ====================

/**
 * Walidacja dla /api/sqlite/initialize
 */
export const initializeSchema = z.object({
  userId: z.string().uuid('Nieprawidłowy format userId'),
  lessonId: z.number().int().positive('LessonId musi być liczbą dodatnią')
})

/**
 * Walidacja dla /api/sqlite/execute
 */
export const executeSchema = z.object({
  userId: z.string().uuid('Nieprawidłowy format userId'),
  lessonId: z.number().int().positive('LessonId musi być liczbą dodatnią'),
  sql: z.string()
    .min(1, 'SQL nie może być puste')
    .max(100000, 'SQL jest zbyt długie (max 100000 znaków)')
    .refine(val => val.trim().length > 0, 'SQL nie może być tylko białymi znakami')
})

/**
 * Walidacja dla /api/sqlite/exists
 */
export const existsSchema = z.object({
  userId: z.string().uuid('Nieprawidłowy format userId'),
  lessonId: z.number().int().positive('LessonId musi być liczbą dodatnią')
})

/**
 * Walidacja dla /api/sqlite/reset
 */
export const resetSchema = z.object({
  userId: z.string().uuid('Nieprawidłowy format userId'),
  lessonId: z.number().int().positive('LessonId musi być liczbą dodatnią')
})

/**
 * Walidacja dla /api/ai/chat
 */
export const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
      .min(1, 'Wiadomość nie może być pusta')
      .max(10000, 'Wiadomość jest zbyt długa (max 10000 znaków)')
  })).min(1, 'Conajmniej jedna wiadomość jest wymagana')
})

/**
 * Walidacja dla /api/ai/interests
 */
export const interestsSchema = z.object({
  message: z.string()
    .min(5, 'Wiadomość musi mieć co najmniej 5 znaków')
    .max(500, 'Wiadomość jest zbyt długa (max 500 znaków)')
    .trim()
})

/**
 * Walidacja dla /api/ai/validate-exercise
 */
export const validateExerciseSchema = z.object({
  task: z.string().min(5, 'Zadanie musi mieć co najmniej 5 znaków').max(1000),
  sql: z.string().min(1, 'SQL nie może być puste').max(10000),
  result: z.union([
    z.array(z.object({
      columns: z.array(z.string()).optional(),
      rows: z.array(z.any()).optional()
    })),
    z.object({
      columns: z.array(z.string()).optional(),
      rows: z.array(z.any()).optional()
    })
  ]).optional(),
  validateOnly: z.boolean().optional(),
  schema: z.any().optional()
})

/**
 * Walidacja dla /api/ai/hint
 */
export const hintSchema = z.object({
  task: z.string().min(5, 'Zadanie musi mieć co najmniej 5 znaków').max(1000),
  currentSql: z.string().max(10000).optional(),
  schema: z.array(z.object({
    name: z.string(),
    type: z.string(),
    desc: z.string().optional()
  })).optional()
})

/**
 * Walidacja dla /api/ai/personalized-content
 */
export const personalizedContentSchema = z.object({
  lessonTitle: z.string().min(1).max(200),
  lessonSubtitle: z.string().max(300).optional(),
  sections: z.array(z.any()).min(1),
  interests: z.string().max(200).optional(),
  schema: z.array(z.any()).optional(),
  exercises: z.array(z.any()).optional()
})

// ==================== VALIDATION MIDDLEWARE ====================

/**
 * Tworzy middleware walidujący request body
 */
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
        return res.status(400).json({
          error: 'Validation error',
          details: errors
        })
      }
      next(error)
    }
  }
}

/**
 * Waliduje params w URL
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.params)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
        return res.status(400).json({
          error: 'Invalid URL parameters',
          details: errors
        })
      }
      next(error)
    }
  }
}

// Schematy dla params
export const paramsUserIdLessonId = z.object({
  userId: z.string().uuid(),
  lessonId: z.string().regex(/^\d+$/, 'LessonId musi być liczbą')
})

export const paramsUserIdLessonIdTable = z.object({
  userId: z.string().uuid(),
  lessonId: z.string().regex(/^\d+$/, 'LessonId musi być liczbą'),
  tableName: z.string().min(1).max(100)
})
