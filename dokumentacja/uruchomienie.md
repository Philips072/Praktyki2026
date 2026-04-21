# Jak uruchomić projekt

## Wymagania

- **Node.js** w wersji 18 lub nowszej
- **npm** (instalowany razem z Node.js)
- **Konto Supabase** — projekt z włączoną autoryzacją i tabelą `profiles`
- **Klucz OpenRouter API** — wygenerowany na [openrouter.ai](https://openrouter.ai/)
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
OPENROUTER_API_KEY=twoj_klucz_openrouter
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
| `OPENROUTER_API_KEY` | Klucz API OpenRouter (Google Gemma 4) | `sk-or-v1-xxxxx...` |

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
| express | ^4.22.1 | Framework HTTP |
| cors | ^2.8.6 | Obsługa CORS |
| dotenv | ^16.5.0 | Zmienne środowiskowe |

### Frontend

| Pakiet | Wersja | Opis |
|--------|--------|------|
| react | ^19.2.4 | Biblioteka UI |
| react-dom | ^19.2.4 | Renderowanie React w przeglądarce |
| react-router-dom | ^7.14.1 | Routing po stronie klienta |
| @supabase/supabase-js | ^2.103.0 | Klient Supabase (auth, baza danych) |
| react-toastify | ^11.1.0 | Powiadomienia (toasty) |
| react-markdown | ^9.1.0 | Renderowanie Markdown |

---

## Routing — dostępne strony

| Ścieżka | Strona | Wymaga logowania | Rola |
|---------|--------|-----------------|------|
| `/` | Strona główna | Nie | Wszyscy |
| `/logowanie` | Logowanie | Nie (tylko niezalogowani) | Wszyscy |
| `/rejestracja` | Rejestracja | Nie (tylko niezalogowani) | Wszyscy |
| `/reset-hasla` | Resetowanie hasła | Nie | Wszyscy |
| `/onboarding` | Ankieta powitalna | Tak | Wszyscy |
| `/dashboard` | Panel użytkownika | Tak | Uczeń |
| `/lekcje` | Lista lekcji SQL | Tak | Uczeń |
| `/lekcja/:id` | Pojedyncza lekcja | Tak | Uczeń |
| `/ai-chat` | Czat z AI | Tak | Uczeń |
| `/wiadomosci` | Wiadomości | Tak | Wszyscy |
| `/ustawienia` | Ustawienia konta | Tak | Wszyscy |
| `/panel-nauczyciela` | Panel nauczyciela | Tak | Nauczyciel |
| `/panel-admina` | Panel administratora | Tak | Administrator |

---

## Model AI (OpenRouter)

Projekt używa modelu **Google Gemma 4-26B-a4b-it** dostępny przez [OpenRouter](https://openrouter.ai/).

### Jak uzyskać klucz OpenRouter:

1. Zarejestruj się na [openrouter.ai](https://openrouter.ai/)
2. Przejdź do sekcji "Keys"
3. Utwórz nowy klucz API
4. Dodaj klucz do pliku `.env` w backend jako `OPENROUTER_API_KEY`

### Koszty:

OpenRouter oferuje bezpłatny dostęp do niektórych modelów w limicie. Sprawdź aktualne cenniki na stronie OpenRouter.

---

## Rozwiązywanie problemów

### Backend nie uruchamia się

- Sprawdź czy port 3001 nie jest zajęty
- Sprawdź czy plik `.env` zawiera poprawny `OPENROUTER_API_KEY`

### Frontend nie łączy się z backendem

- Sprawdź czy backend działa (`http://localhost:3001/api/health`)
- Sprawdź czy `VITE_BACKEND_URL` w pliku `.env` frontendu jest poprawny
- Sprawdź czy nie ma błędów CORS w konsoli przeglądarki

### Supabase nie działa

- Sprawdź czy `VITE_SUPABASE_URL` i `VITE_SUPABASE_PUBLISHABLE_KEY` są poprawne
- Sprawdź czy w Supabase są włączone: Auth, Database, Realtime
- Sprawdź czy tabele `profiles`, `classes`, `class_students`, `conversations`, `messages`, `tests`, `assignments` istnieją

### AI nie odpowiada

- Sprawdź czy `OPENROUTER_API_KEY` jest poprawny w backend `.env`
- Sprawdź czy masz środki na koncie OpenRouter
- Sprawdź logi backendu pod kątem błędów z API
