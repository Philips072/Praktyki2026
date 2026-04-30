import { env } from '../config/env.js'

/**
 * Rozbudowane health check endpoint
 * Sprawdza status backendu i zewnętrznych usług
 */
export const healthCheck = async (_req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.nodeEnv,
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      backend: 'ok',
      openrouter: await checkOpenRouter(),
      memory: getMemoryStatus(),
    }
  }

  // Jeśli jakaś usługa nie działa, zwróć 503
  const hasFailures = Object.values(health.checks).some(check =>
    check !== 'ok' && typeof check === 'string'
  )

  res.status(hasFailures ? 503 : 200).json(health)
}

/**
 * Sprawdza czy OpenRouter API jest dostępny
 */
async function checkOpenRouter() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${env.openRouterKey}`
      },
      signal: AbortSignal.timeout(5000) // timeout 5 sekund
    })

    return response.ok ? 'ok' : `error: ${response.status}`
  } catch (error) {
    return `error: ${error.message}`
  }
}

/**
 * Zwraca status pamięci
 */
function getMemoryStatus() {
  const used = process.memoryUsage()
  const total = process.memoryUsage().heapTotal
  const free = process.memoryUsage().heapUsed
  const percent = Math.round((free / total) * 100)

  return {
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(total / 1024 / 1024)}MB`,
    rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
    percent
  }
}
