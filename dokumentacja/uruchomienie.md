# Jak uruchomić projekt

## Wymagania

- **Node.js** w wersji 18 lub nowszej
- **npm** (instalowany razem z Node.js)
- **Konto Supabase** — projekt z włączoną autoryzacją i tabelą `profiles`
- **Klucz Mistral AI** — wygenerowany na [console.mistral.ai](https://console.mistral.ai/)
- Przeglądarka internetowa (Chrome, Firefox, Edge)

---

## Uruchomienie

Projekt składa się z dwóch niezależnych serwerów — **backendu** i **frontendu**. Oba muszą działać jednocześnie.

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/Philips072/Praktyki2026.git
cd Praktyki2026
```

---

### 2. Backend (Node.js / Express)

```bash
cd projekt/backend
npm install
```

Utwórz plik `.env` w folderze `projekt/backend/` (lub uzupełnij istniejący):

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
MISTRAL_KEY=twoj_klucz_mistral
```

Uruchom serwer:

```bash
npm run dev        # tryb deweloperski (auto-restart przy zmianach)
# lub
npm start          # tryb produkcyjny
```

Backend będzie dostępny pod adresem: `http://localhost:3001`

---

### 3. Frontend (React / Vite)

```bash
cd projekt/DataMindAi
npm install
```

Utwórz plik `.env` w folderze `projekt/DataMindAi/` (lub uzupełnij istniejący):

```env
VITE_SUPABASE_URL=https://<twoj-projekt>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<twoj-anon-key>
VITE_BACKEND_URL=http://localhost:3001
```

Wartości Supabase znajdziesz w panelu: **Project Settings → API**.

Uruchom serwer deweloperski:

```bash
npm run dev
```

Frontend będzie dostępny pod adresem: `http://localhost:5173`

---

## Zmienne środowiskowe

### `projekt/backend/.env`

| Zmienna | Opis | Przykład |
|---------|------|---------|
| `PORT` | Port serwera Express | `3001` |
| `FRONTEND_URL` | Adres frontendu (CORS) | `http://localhost:5173` |
| `MISTRAL_KEY` | Klucz API Mistral AI | `FIa3uTI3...` |

### `projekt/DataMindAi/.env`

| Zmienna | Opis |
|---------|------|
| `VITE_SUPABASE_URL` | URL projektu Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Klucz anon Supabase |
| `VITE_BACKEND_URL` | Adres serwera backend (domyślnie `http://localhost:3001`) |

> **Uwaga:** Pliki `.env` nie są commitowane do repozytorium (znajdują się w `.gitignore`).

---

## Dostępne skrypty

### Backend (`projekt/backend/`)

| Skrypt | Opis |
|--------|------|
| `npm run dev` | Uruchamia serwer z `--watch` (auto-restart) |
| `npm start` | Uruchamia serwer bez auto-restartu |

### Frontend (`projekt/DataMindAi/`)

| Skrypt | Opis |
|--------|------|
| `npm run dev` | Uruchamia serwer deweloperski (Vite) |
| `npm run build` | Buduje wersję produkcyjną do folderu `dist/` |
| `npm run preview` | Podgląd zbudowanej wersji produkcyjnej |
| `npm run lint` | Sprawdza kod przez ESLint |

---

## Zależności

### Backend

| Pakiet | Wersja | Opis |
|--------|--------|------|
| express | ^4.21.2 | Framework HTTP |
| cors | ^2.8.5 | Obsługa CORS |
| dotenv | ^16.5.0 | Zmienne środowiskowe |

### Frontend

| Pakiet | Wersja | Opis |
|--------|--------|------|
| react | ^19.2.4 | Biblioteka UI |
| react-dom | ^19.2.4 | Renderowanie React w przeglądarce |
| react-router-dom | ^7.14.0 | Routing po stronie klienta |
| @supabase/supabase-js | ^2.103.0 | Klient Supabase (auth, baza danych) |

---

## Routing — dostępne strony

| Ścieżka | Strona | Wymaga logowania |
|---------|--------|-----------------|
| `/` | Strona główna | Nie |
| `/logowanie` | Logowanie | Nie (tylko niezalogowani) |
| `/rejestracja` | Rejestracja | Nie (tylko niezalogowani) |
| `/reset-hasla` | Resetowanie hasła | Nie |
| `/onboarding` | Ankieta powitalna | Tak |
| `/dashboard` | Panel użytkownika | Tak |
| `/lekcje` | Lista lekcji SQL | Tak |
| `/lekcja/:id` | Pojedyncza lekcja | Tak |
| `/ai-chat` | Czat z AI | Tak |
| `/wiadomosci` | Wiadomości | Tak |
| `/ustawienia` | Ustawienia konta | Tak |
