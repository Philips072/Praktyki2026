# Architektura projektu

## Ogólny schemat

```
Przeglądarka
    │
    ▼
┌─────────────────────┐        ┌──────────────────────────┐
│  Frontend (React)   │◄──────►│  Backend (Node.js)       │
│  localhost:5173     │  HTTP  │  localhost:3001          │
│                     │        │  /api/ai/chat            │
│  - UI / routing     │        │  /api/ai/interests       │
│  - Supabase client  │        │  /api/sqlite/*           │
│  - SQLite manager   │        │  /api/health             │
└─────────────────────┘        └──────────┬───────────────┘
         │                                │
         │ Supabase JS SDK                │ fetch (klucz API)
         ▼                                ▼
┌─────────────────────┐        ┌──────────────────────────┐
│  Supabase           │        │  OpenRouter API           │
│  - Auth             │        │  (Google Gemma 4)         │
│  - PostgreSQL       │        └──────────────────────────┘
│  - Realtime         │
└─────────────────────┘
```

## Technologie

### Frontend (`projekt/DataMindAi/`)

| Technologia | Wersja | Rola |
|-------------|--------|------|
| React | 19.2.4 | Biblioteka UI — komponenty, stan, renderowanie |
| Vite | 8.0.4 | Bundler, serwer deweloperski, HMR |
| React Router DOM | 7.14.1 | Routing po stronie klienta (SPA) |
| Supabase JS | 2.103.0 | Auth, baza danych (PostgreSQL), realtime |
| react-toastify | 11.1.0 | Powiadomienia (toasty) |
| react-markdown | 9.1.0 | Renderowanie Markdown (odpowiedzi AI) |
| chart.js | 4.5.1 | Wykresy w dashboardach |
| file-saver | 2.0.5 | Eksport plików (CSV/PDF) |
| remark-gfm | 4.0.1 | GitHub Flavored Markdown |
| CSS (własne arkusze) | — | Stylowanie komponentów |
| sql.js | 1.14.1 | SQLite w przeglądarce (sandbox) |

### Backend (`projekt/backend/`)

| Technologia | Wersja | Rola |
|-------------|--------|------|
| Node.js | ≥ 18 | Środowisko uruchomieniowe |
| Express | 4.22.1 | Framework HTTP |
| cors | 2.8.6 | Obsługa nagłówków CORS |
| dotenv | 16.5.0 | Wczytywanie zmiennych środowiskowych |
| dotenv-safe | 9.1.0 | Walidacja zmiennych środowiskowych |
| compression | 1.8.1 | Kompresja odpowiedzi HTTP (gzip) |
| helmet | 8.1.0 | Security headers |
| express-rate-limit | 8.4.1 | Rate limiting API |
| morgan | 1.10.1 | Logger HTTP |
| knex | 3.2.9 | Query builder dla SQLite |
| sqlite3 | 6.0.1 | Sterownik SQLite |
| uuid | 14.0.0 | Generowanie unikalnych ID |
| xss-clean | 0.1.4 | Ochrona przed XSS |
| zod | 4.3.6 | Walidacja danych |
| OpenRouter API | — | Agregator modeli AI (Google Gemma 4) |
| @supabase/supabase-js | 2.104.1 | Klient Supabase (opcjonalnie w backend) |

## Struktura folderów

```
praktyki2026/
├── dokumentacja/              # Dokumentacja projektu
├── dziennik/                  # Dzienniki pracy członków zespołu
│   ├── Filip-Strzalka/
│   ├── Pawel-Rak/
│   └── Wiktoria-Maslowiec/
└── projekt/
    ├── DataMindAi/            # Frontend — React / Vite
    │   ├── public/
    │   ├── src/
    │   │   ├── assets/            # Obrazy, logo
    │   │   ├── Components/        # Komponenty wielokrotnego użytku
    │   │   ├── Pages/             # Strony (widoki routera)
    │   │   ├── hooks/             # Custom hooki React
    │   │   ├── data/              # Dane statyczne (lekcje SQL)
    │   │   ├── api.js             # Helper do komunikacji z backendem
    │   │   ├── sqliteManager.js   # Zarządzanie SQLite w przeglądarce
    │   │   ├── Toastify.css       # Style dla react-toastify
    │   │   ├── App.jsx            # Główny komponent z routingiem
    │   │   ├── AuthContext.jsx    # Kontekst autoryzacji (Supabase)
    │   │   ├── supabaseClient.js  # Inicjalizacja klienta Supabase
    │   │   ├── main.jsx           # Punkt wejścia aplikacji
    │   │   └── index.css          # Globalne style i zmienne CSS
    │   ├── .env                   # Zmienne środowiskowe frontendu
    │   ├── .env.example
    │   ├── index.html
    │   ├── package.json
    │   └── vite.config.js
    └── backend/               # Backend — Node.js / Express
        ├── databases/             # Bazy danych SQLite lekcji użytkowników
        ├── sandbox/               # Bazy danych SQLite sandbox użytkowników
        ├── sql-wasm.wasm          # WebAssembly dla sql.js
        ├── src/
        │   ├── config/
        │   │   └── env.js          # Konfiguracja środowiska
        │   ├── db/
        │   │   └── knexConfig.js   # Konfiguracja i operacje SQLite (Knex)
        │   ├── middleware/
        │   │   ├── auth.js         # Autoryzacja
        │   │   ├── compression.js  # Kompresja gzip
        │   │   ├── errorHandler.js # Obsługa błędów
        │   │   ├── health.js       # Health check
        │   │   ├── logger.js       # Logger (Morgan)
        │   │   ├── rateLimiter.js  # Rate limiting
        │   │   ├── requestId.js    # Request ID
        │   │   ├── security.js     # Security headers (Helmet)
        │   │   └── validation.js   # Walidacja (Zod)
        │   └── routes/
        │       ├── ai.js           # Endpointy AI (chat, interests)
        │       └── sqlite.js       # Endpointy SQLite (lekcje, sandbox)
        ├── .env                   # Zmienne środowiskowe backendu
        ├── .env.example
        ├── package.json
        └── server.js              # Punkt wejścia — Express + routing
```

## Endpointy backendu

### AI Endpoints (`/api/ai/`)

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| `POST` | `/api/ai/chat` | Czat z asystentem AI (strona `/ai-chat`) |
| `POST` | `/api/ai/interests` | AI przetwarza zainteresowania użytkownika |

### SQLite Endpoints - Lekcje (`/api/sqlite/`)

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| `POST` | `/api/sqlite/initialize` | Inicjalizuje bazę danych dla lekcji użytkownika |
| `POST` | `/api/sqlite/execute` | Wykonuje zapytanie SQL na bazie lekcji |
| `GET` | `/api/sqlite/tables/:userId/:lessonId` | Zwraca listę tabel |
| `GET` | `/api/sqlite/schema/:userId/:lessonId/:tableName` | Zwraca schemat tabeli |
| `GET` | `/api/sqlite/full-schema/:userId/:lessonId` | Zwraca pełny schemat wszystkich tabel |
| `POST` | `/api/sqlite/reset` | Resetuje bazę danych do stanu początkowego |
| `POST` | `/api/sqlite/exists` | Sprawdza czy baza danych istnieje |

### SQLite Endpoints - Sandbox (`/api/sqlite/sandbox/`)

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| `POST` | `/api/sqlite/sandbox/initialize` | Inicjalizuje nową bazę sandbox |
| `GET` | `/api/sqlite/sandbox/:userId` | Zwraca listę baz sandbox użytkownika |
| `POST` | `/api/sqlite/sandbox/execute` | Wykonuje SQL w sandboxie |
| `GET` | `/api/sqlite/sandbox/tables/:userId/:dbId` | Zwraca listę tabel w sandboxie |
| `GET` | `/api/sqlite/sandbox/schema/:userId/:dbId/:tableName` | Zwraca schemat tabeli w sandboxie |
| `GET` | `/api/sqlite/sandbox/data/:userId/:dbId/:tableName` | Zwraca dane z tabeli (z limitem) |
| `POST` | `/api/sqlite/sandbox/exists` | Sprawdza czy baza sandbox istnieje |
| `POST` | `/api/sqlite/sandbox/drop` | Usuwa bazę sandbox |

### System Endpoints

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| `GET` | `/api/health` | Sprawdzenie stanu serwera |

## Szczegóły endpointów

### POST `/api/ai/chat`

Używa modelu **Google Gemma 4-26B** przez OpenRouter.

```json
// Żądanie
{ "messages": [{ "role": "user", "content": "Co to jest SELECT?" }] }

// Odpowiedź
{ "reply": "SELECT służy do pobierania danych z bazy..." }
```

### POST `/api/ai/interests`

```json
// Żądanie
{ "message": "Interesuję się sportem i grami wideo" }

// Odpowiedź
{ "message": "Fajnie! Dostosujemy ćwiczenia SQL do Twoich zainteresowań.", "interests": "sport i gry wideo" }
```

### POST `/api/sqlite/initialize`

Tworzy bazę danych SQLite dla użytkownika i lekcji w folderze `databases/`.

```json
// Żądanie
{ "userId": "user-uuid", "lessonId": 1 }

// Odpowiedź
{ "success": true, "message": "Baza danych utworzona" }
```

### POST `/api/sqlite/execute`

Wykonuje zapytanie SQL na bazie lekcji.

```json
// Żądanie
{ "userId": "user-uuid", "lessonId": 1, "sql": "SELECT * FROM users" }

// Odpowiedź (sukces)
{ "success": true, "data": [...], "affectedRows": 5 }

// Odpowiedź (błąd)
{ "success": false, "message": "Błąd: ...", "affectedRows": 0, "data": null }
```

### POST `/api/sqlite/sandbox/initialize`

Tworzy nową bazę SQLite w folderze `sandbox/` do swobodnego ćwiczenia.

```json
// Żądanie
{ "userId": "user-uuid", "dbId": "moja-baza" }

// Odpowiedź
{ "success": true, "message": "Baza danych sandbox utworzona" }
```

## Strony (Pages)

| Plik | Ścieżka | Dostęp | Opis |
|------|---------|--------|------|
| `HomePage.jsx` | `/` | publiczna | Landing page |
| `LoginPage.jsx` | `/logowanie` | tylko niezalogowani | Formularz logowania |
| `RegisterPage.jsx` | `/rejestracja` | tylko niezalogowani | Formularz rejestracji |
| `ForgotPasswordPage.jsx` | `/reset-hasla` | publiczna | Resetowanie hasła przez e-mail |
| `OnboardingPage.jsx` | `/onboarding` | zalogowani | Ankieta powitalna (poziom, zainteresowania AI) |
| `DashboardPage.jsx` | `/dashboard` | zalogowani | Panel użytkownika |
| `LecturesPage.jsx` | `/lekcje` | zalogowani | Lista lekcji SQL |
| `LessonPage.jsx` | `/lekcja/:id` | zalogowani | Pojedyncza lekcja SQL z edytorem SQL |
| `AIChatPage.jsx` | `/ai-chat` | zalogowani | Czat z asystentem AI |
| `MessagesPage.jsx` | `/wiadomosci` | zalogowani | Wiadomości między użytkownikami |
| `UserSettingsPage.jsx` | `/ustawienia` | zalogowani | Ustawienia konta |
| `TeacherPanelPage.jsx` | `/panel-nauczyciela` | zalogowani (nauczyciel) | Panel nauczyciela |
| `AdminPanelPage.jsx` | `/panel-admina` | zalogowani (administrator) | Panel administratora |
| `SandboxPage.jsx` | `/sandbox` | zalogowani | Sandbox SQL - swobodne ćwiczenie |
| `NotFoundPage.jsx` | `*` | publiczna | Strona 404 |

## Komponenty (Components)

### Strona główna

| Komponent | Opis |
|-----------|------|
| `HomeHeader` | Nagłówek z nawigacją i hamburger menu |
| `Home1` | Sekcja hero — tytuł, CTA, okno z przykładem SQL |
| `Home2` | Karty funkcji (Personalizacja, AI, Praktyka) |
| `Home3` | Sekcja z dodatkowymi informacjami |
| `Home4` | Sekcja CTA — wezwanie do rejestracji |
| `Footer` | Stopka strony |

### Dashboard

| Komponent | Opis |
|-----------|------|
| `SidebarHeader` | Layout dashboardu: sidebar + nagłówek + slot na treść |
| `Dashboard1` | Powitanie i statystyki (lekcje, zadania, dni nauki) |
| `Dashboard2` | Skróty do akcji (pierwsza lekcja, czat AI) |

### Autoryzacja

| Komponent | Opis |
|-----------|------|
| `Login` | Formularz logowania (Supabase auth) |
| `Register` | Formularz rejestracji (Supabase auth) |
| `ForgotPassword` | Formularz resetowania hasła |
| `PublicRoute` | Wrapper — przekierowuje zalogowanych z `/logowanie` i `/rejestracja` |
| `PrivateRoute` | Wrapper — przekierowuje niezalogowanych na `/logowanie` |
| `AdminRoute` | Wrapper — przekierowuje nie-administratorów na `/dashboard` |

### Panel nauczyciela

| Komponent | Opis |
|-----------|------|
| `TeacherPanel` | Główny panel nauczyciela z zakładkami |
| `ClassManagement` | Zarządzanie klasami — tworzenie, edycja, usuwanie |
| `BulkAssignmentModal` | Modal do masowego przypisywania testów |
| `StudentSelector` | Komponent do wyboru uczniów przez checkboxy |
| `AssignedTests` | Lista przypisanych testów |
| `StudentDetail` | Szczegóły ucznia |
| `ChatPanel` | Panel czatu z uczniem |

### Panel administratora

| Komponent | Opis |
|-----------|------|
| `AdminPanelPage` | Główny panel administratora z zakładkami (Użytkownicy, Klasy, Statystyki) |

### Sandbox SQL

| Komponent | Opis |
|-----------|------|
| `SandboxPage` | Strona sandbox z edytorem SQL i podglądem bazy |
| `SQLEditor` | Edytor SQL z podświetlaniem składni |
| `ResultsTable` | Tabela wyników zapytań |
| `DatabaseExplorer` | Przeglądarka tabel i schematów |

### Pozostałe

| Komponent | Opis |
|-----------|------|
| `AiChat` | Interfejs czatu z asystentem AI — wyświetla odpowiedzi w Markdown |
| `Lectures` | Lista dostępnych lekcji SQL |
| `Messages` | Widok wiadomości z real-time (Supabase Realtime) |
| `OnboardingModal` | Ankieta onboardingowa — krok 1: poziom, krok 2: zainteresowania (AI) |
| `UserSettings` | Ustawienia konta — zmiana imienia, emaila, hasła, poziomu SQL, zainteresowań (AI) |
| `NotFound` | Komunikat strony 404 |
| `AnimateOnScroll` | Wrapper animacji przy wejściu elementu w viewport |
| `DateHeader` | Nagłówek z aktualną datą |
| `Sidebar` | Nawigacja boczna dashboardu |

## Podział odpowiedzialności: frontend vs backend

| Obszar | Frontend (React) | Backend (Express) |
|--------|-----------------|-------------------|
| Autoryzacja (login, logout, rejestracja) | ✅ Supabase Auth client-side | — |
| Pobieranie/zapis profilu | ✅ Supabase JS (anon key + RLS) | — |
| Wiadomości (realtime) | ✅ Supabase Realtime | — |
| Wywołania AI | ❌ przeniesione | ✅ klucz API serwera |
| Bazy SQLite lekcji | ✅ interfejs | ✅ pełna obsługa (Knex) |
| Bazy SQLite sandbox | ✅ interfejs + sql.js | ✅ pełna obsługa (Knex) |
| Klucz OpenRouter | ❌ usunięty z `.env` | ✅ `OPENROUTER_API_KEY` w `.env` |

> **Dlaczego Supabase jest w frontendzie?**
> Klucz `anon` jest publiczny z założenia — dostęp do danych chroni Row Level Security (RLS) po stronie PostgreSQL. Supabase Realtime wymaga połączenia WebSocket bezpośrednio z przeglądarką.

## Middleware backendu

### Kolejność middleware (w server.js)

1. **requestId** — dodaje unikalne ID do każdego requesta
2. **security** — nagłówki bezpieczeństwa (Helmet, XSS protection)
3. **CORS** — ograniczenie do zaufanego originu
4. **logger** — logowanie requestów (Morgan)
5. **Body parsing** — parsowanie JSON i URL-encoded
6. **compression** — kompresja gzip
7. **Request timeout** — 30s domyślnie, 120s dla AI
8. **Rate limiters** — ochrona przed nadmiernym użyciem
9. **Routes** — endpointy API
10. **Error handler** — obsługa błędów

### Rate Limiting

| Typ | Limit | Okno | Dotyczy |
|-----|-------|------|---------|
| `generalLimiter` | 100 req | 15 min | `/api/*` |
| `aiLimiter` | 20 req | 15 min | `/api/ai/*` |
| `sqlLimiter` | 50 req | 15 min | `/api/sqlite/execute` |
| `dbResetLimiter` | 5 req | 15 min | `/api/sqlite/reset`, `/api/sqlite/initialize` |

## Autoryzacja i Supabase

Kontekst autoryzacji (`AuthContext.jsx`) dostarcza przez cały drzewo komponentów:
- `user` — obiekt zalogowanego użytkownika Supabase (lub `null`)
- `profile` — profil z tabeli `profiles` (name, role, sql_level, interests)
- `loading` — stan ładowania sesji
- `refreshProfile()` — odświeżenie profilu po zmianach

Tabela `profiles` w Supabase:

| Kolumna | Typ | Opis |
|---------|-----|------|
| `id` | uuid (FK → auth.users) | Identyfikator użytkownika |
| `name` | text | Imię/nazwa wyświetlana |
| `email` | text | Adres e-mail |
| `role` | text | Rola: `uczen` / `nauczyciel` / `administrator` |
| `sql_level` | text | Poziom: `poczatkujacy` / `sredniozaawansowany` / `zaawansowany` |
| `interests` | text | Zainteresowania zapisane przez AI podczas onboardingu |
| `class_id` | uuid (FK → classes) | Identyfikator klasy ucznia (opcjonalne) |
| `created_at` | timestamp | Data utworzenia profilu |

### Tabele Systemu Klas

#### `classes` Table
Przechowuje informacje o klasach stworzonych przez nauczycieli:

| Kolumna | Typ | Opis |
|---------|-----|------|
| `id` | UUID (PK) | Unikalny identyfikator klasy |
| `name` | VARCHAR(50) | Nazwa klasy (np. "2a", "3f", "10b") - musi pasować do wzorca `^[0-9][a-zA-Z]{1,2}$` |
| `description` | TEXT | Opcjonalny opis klasy |
| `created_by` | UUID (FK → auth.users) | ID nauczyciela, który utworzył klasę |
| `created_at` | TIMESTAMP | Data utworzenia klasy |
| `updated_at` | TIMESTAMP | Data ostatniej aktualizacji klasy |

#### `class_students` Table
Tabela łącząca klasy z uczniami (relacja many-to-many):

| Kolumna | Typ | Opis |
|---------|-----|------|
| `id` | UUID (PK) | Unikalny identyfikator rekordu |
| `class_id` | UUID (FK → classes) | ID klasy |
| `student_id` | UUID (FK → profiles) | ID ucznia |
| `joined_at` | TIMESTAMP | Data dołączenia ucznia do klasy |
| `added_by` | UUID (FK → auth.users) | ID nauczyciela, który dodał ucznia do klasy |

**Kluczowe cechy systemu klas:**
- Jeden uczeń może należeć do wielu klas
- Jedna klasa może zawierać wielu uczniów
- Kasowanie klasy automatycznie usuwa relacje w `class_students` (CASCADE DELETE)
- Nazwa klasy jest unikalna i walidowana (tylko format: cyfra + 1-2 litery)

### Tabele testów i przypisań

#### `tests` Table
Przechowuje testy stworzone przez nauczycieli:

| Kolumna | Typ | Opis |
|---------|-----|------|
| `id` | UUID (PK) | Unikalny identyfikator testu |
| `title` | VARCHAR(255) | Tytuł testu |
| `description` | TEXT | Opis testu |
| `questions` | JSONB | Pytania testu |
| `created_by` | UUID (FK → auth.users) | ID nauczyciela |
| `created_at` | TIMESTAMP | Data utworzenia |

#### `assignments` Table
Przypisania testów do uczniów:

| Kolumna | Typ | Opis |
|---------|-----|------|
| `id` | UUID (PK) | Unikalny identyfikator przypisania |
| `test_id` | UUID (FK → tests) | ID testu |
| `student_id` | UUID (FK → profiles) | ID ucznia |
| `status` | VARCHAR(20) | Status: `pending` / `in_progress` / `completed` |
| `assigned_at` | TIMESTAMP | Data przypisania |
| `completed_at` | TIMESTAMP | Data ukończenia |

### Tabele wiadomości w Supabase:

| Tabela | Opis |
|--------|------|
| `conversations` | Para użytkowników (participant1_id, participant2_id) |
| `messages` | Wiadomości przypisane do rozmowy (text, sender_id, deleted, read_by_recipient) |

## SQLite w projekcie

### Bazy danych lekcji

Każda para (userId, lessonId) ma własną bazę SQLite w folderze `databases/`:
- Nazwa pliku: `{userId}_lesson{lessonId}.db`
- Inicjowana przez `/api/sqlite/initialize`
- Resetowalna przez `/api/sqlite/reset`

### Bazy danych sandbox

Użytkownicy mogą tworzyć własne bazy do swobodnego ćwiczenia w folderie `sandbox/`:
- Nazwa pliku: `{userId}_{dbId}.db`
- Zarządzane przez `/api/sqlite/sandbox/*` endpointy
- Możliwość tworzenia wielu baz, wykonywania dowolnych zapytań

### Technologia SQLite w backend

- **Knex.js** — Query builder do zarządzania bazami
- **sqlite3** — Sterownik Node.js dla SQLite
- **Knex Config** (`src/db/knexConfig.js`) — centralna konfiguracja operacji

### Technologia SQLite w frontend

- **sql.js** — SQLite skompilowany do WebAssembly
- **sqliteManager.js** — Manager do lokalnych operacji SQLite w przeglądarce
- Używany do lokalnego podglądu i wstępnego sprawdzania zapytań

## Zmienne CSS (design tokens)

Globalne zmienne zdefiniowane w `index.css`:

| Zmienna | Wartość | Opis |
|---------|---------|------|
| `--primaryBg` | `#1a1a1a` | Główne tło aplikacji |
| `--containerBoxBg` | `#212121` | Tło kart i kontenerów |
| `--sidebarBg` | `#1c1c1c` | Tło sidebara |
| `--primaryText` | `#fcf6f3` | Kolor tekstu głównego |
| `--secondaryText` | `#a6a6a6` | Kolor tekstu drugorzędnego |
| `--accentColor` | `#324277` | Kolor akcentu (niebieski) |
| `--borderColor` | `#363636` | Kolor obramowań |

## Responsywność

| Breakpoint | Zachowanie |
|------------|-----------|
| > 900px | Sidebar pełnej szerokości (280px), layout desktop |
| 641px – 900px | Sidebar węższy (220px) |
| ≤ 640px | Sidebar jako nakładka (position: fixed) z backdrop |

## Powiadomienia (Toastify)

Aplikacja używa `react-toastify` do wyświetlania powiadomień:

- Pozycja: `top-right`
- Auto-zamykanie: 4000ms
- Wspiera sukces, błędy, ostrzeżenia i informacje

## Funkcje panelu administratora

Panel administratora (`/panel-admina`) zawiera trzy zakładki:

### 1. Użytkownicy
- Pełna lista użytkowników z danymi: imię, email, rola, poziom SQL, klasa, data utworzenia
- Wyszukiwanie po imieniu lub emailu
- Filtrowanie po roli (wszyscy, uczniowie, nauczyciele, administratorzy)
- Edycja profilu użytkownika (imię, email, poziom SQL)
- Zmiana roli użytkownika (dropdown)
- Usuwanie użytkownika (z usunięciem przypisań i powiązań z klasami)
- Ochrona przed zmianą/usunięciem własnego konta

### 2. Klasy
- Lista wszystkich klas z danymi: nazwa, opis, liczba uczniów, twórca
- Tworzenie nowych klas (tylko administrator i nauczyciel)
- Edycja nazwy i opisu klasy (tylko twórca lub administrator)
- Usuwanie klas (tylko twórca lub administrator)
- Walidacja nazwy klasy (format: cyfra + 1-2 litery)

### 3. Statystyki
- Całkowita liczba użytkowników
- Liczba użytkowników według roli (uczniowie, nauczyciele, administratorzy)
- Liczba klas
- Liczba testów
- Liczba przypisań (wszystkie i ukończone)
