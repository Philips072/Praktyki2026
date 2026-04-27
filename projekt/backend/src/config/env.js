import dotenvSafe from 'dotenv-safe'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Załaduj .env, rzuć błąd jeśli wymagane zmienne są nieobecne
const result = dotenvSafe.config({
  path: path.join(process.cwd(), '.env'),
  example: path.join(process.cwd(), '.env.example'),
  allowEmptyValues: false
})

// Jeśli wystąpił błąd (brak .env.example), spróbuj tylko .env
if (result.error) {
  console.warn('⚠️  dotenv-safe warning:', result.error.message)
  console.log('Próba załadowania tylko .env...')

  const dotenv = await import('dotenv')
  dotenv.config({ path: path.join(process.cwd(), '.env') })
}

// Wymagane zmienne środowiskowe
const requiredEnvVars = [
  'OPENROUTER_API_KEY',
  'FRONTEND_URL'
]

const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingVars.length > 0) {
  console.error('❌ Brakujące zmienne środowiskowe:')
  missingVars.forEach(v => console.error(`   - ${v}`))
  console.error('\nUtwórz plik .env z wymaganymi zmiennymi lub sprawdź .env.example')
  process.exit(1)
}

// Eksportuj bezpiecznie skonfigurowane wartości
export const env = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  openRouterKey: process.env.OPENROUTER_API_KEY,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
}

// Loguj konfigurację (bez wrażliwych danych)
console.log('✅ Environment validated:')
console.log(`   - Port: ${env.port}`)
console.log(`   - Environment: ${env.nodeEnv}`)
console.log(`   - Frontend: ${env.frontendUrl}`)
console.log(`   - OpenRouter: ${env.openRouterKey ? 'configured' : 'MISSING'}`)
