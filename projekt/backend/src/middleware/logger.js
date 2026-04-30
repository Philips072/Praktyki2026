import morgan from 'morgan'

/**
 * Logger middleware - loguje wszystkie requesty
 * W środowisku produkcyjnym używa 'combined', w dev 'dev'
 */
export const logger = morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')
