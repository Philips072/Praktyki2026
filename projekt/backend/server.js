import express from 'express';
import cors from 'cors';

// Environment validation - pierwsza rzecz! musi być na początku
import { env } from './src/config/env.js';

import aiRouter from './src/routes/ai.js';
import sqliteRouter from './src/routes/sqlite.js';

// Security i utility middlewary
import { securityMiddleware } from './src/middleware/security.js';
import { generalLimiter, aiLimiter, sqlLimiter, dbResetLimiter } from './src/middleware/rateLimiter.js';
import { logger } from './src/middleware/logger.js';
import { compress } from './src/middleware/compression.js';
import { requestId } from './src/middleware/requestId.js';
import { healthCheck } from './src/middleware/health.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();

// ==================== MIDDLEWARE KOLEJNOŚĆ ====================

// 1. Request ID - dodaje ID do każdego requesta (pierwsze!)
app.use(requestId);

// 2. Security headers i XSS protection
app.use(...securityMiddleware);

// 3. CORS
app.use(cors({
  origin: env.frontendUrl,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
}));

// 4. Request logging (po requestId, żeby widzieć ID w logach)
app.use(logger);

// 5. Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Compression
app.use(compress);

// 7. Request timeout - 30 sekund dla wszystkich requestów
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    req.log?.warn?.({ reqId: req.id }, 'Request timeout');
    if (!res.headersSent) {
      res.status(408).json({ error: 'Request timeout' });
    }
  });
  next();
});

// ==================== RATE LIMITING ====================

app.use('/api/', generalLimiter);

// ==================== ROUTES ====================

// AI routes - use longer timeout (120s) for AI generation
app.use('/api/ai', aiLimiter, (req, res, next) => {
  res.setTimeout(120000, () => {
    req.log?.warn?.({ reqId: req.id }, 'AI request timeout');
    if (!res.headersSent) {
      res.status(408).json({ error: 'AI request timeout' });
    }
  });
  next();
}, aiRouter);
app.use('/api/sqlite', sqliteRouter);

// Specific strict limiters for sensitive operations
app.post('/api/sqlite/reset', dbResetLimiter);
app.post('/api/sqlite/initialize', dbResetLimiter);
app.post('/api/sqlite/execute', sqlLimiter);

// ==================== HEALTH CHECK ====================

app.get('/api/health', healthCheck);

// ==================== ERROR HANDLER ====================

// Error handler (musi być ostatni)
app.use(errorHandler);

// ==================== START SERVER ====================

app.listen(env.port, () => {
  console.log(`🚀 Backend running on http://localhost:${env.port}`);
  console.log(`📝 Environment: ${env.nodeEnv}`);
  console.log(`🔗 Frontend: ${env.frontendUrl}`);
});
