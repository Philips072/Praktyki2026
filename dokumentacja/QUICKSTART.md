# Szybki start (Quick Start)

## 1. Wymagania wstępne

- Node.js 18+ → [nodejs.org](https://nodejs.org/)
- Konto Supabase → [supabase.com](https://supabase.com/)
- Klucz OpenRouter API → [openrouter.ai/keys](https://openrouter.ai/keys)

## 2. Instalacja zależności

```bash
cd projekt/backend
npm install

cd ../DataMindAi
npm install
```

## 3. Konfiguracja zmiennych środowiskowych

### Backend (`projekt/backend/.env`)
Skopiuj z `.env.example` i uzupełnij:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
OPENROUTER_API_KEY=sk-or-v1-xxxxx...
```

### Frontend (`projekt/DataMindAi/.env`)
Skopiuj z `.env.example` i uzupełnij:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJxxxxx...
VITE_BACKEND_URL=http://localhost:3001
```

Wartości Supabase znajdziesz: **Project Settings → API**

## 4. Uruchomienie

### Terminal 1 — Backend:
```bash
cd projekt/backend
npm run dev
```

### Terminal 2 — Frontend:
```bash
cd projekt/DataMindAi
npm run dev
```

## 5. Otwórz w przeglądarce

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:3001/api/health`

---

**Pełna dokumentacja:** [uruchomienie.md](uruchomienie.md)
