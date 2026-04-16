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
│  - Supabase client  │        │  /api/health             │
└─────────────────────┘        └──────────┬───────────────┘
         │                                │
         │ Supabase JS SDK                │ fetch (klucz serwera)
         ▼                                ▼
┌─────────────────────┐        ┌──────────────────────────┐
│  Supabase           │        │  Mistral AI API          │
│  - Auth             │        │  mistral-small-latest    │
│  - PostgreSQL       │        └──────────────────────────┘
│  - Realtime         │
└─────────────────────┘
```

## Technologie

### Frontend (`projekt/DataMindAi/`)

| Technologia | Wersja | Rola |
|-------------|--------|------|
| React | 19 | Biblioteka UI — komponenty, stan, renderowanie |
| Vite | 8 | Bundler, serwer deweloperski, HMR |
| React Router DOM | 7 | Routing po stronie klienta (SPA) |
| Supabase JS | 2 | Auth, baza danych (PostgreSQL), realtime |
| CSS (własne arkusze) | — | Stylowanie komponentów |

### Backend (`projekt/backend/`)

| Technologia | Wersja | Rola |
|-------------|--------|------|
| Node.js | ≥ 18 | Środowisko uruchomieniowe |
| Express | 4 | Framework HTTP |
| cors | 2 | Obsługa nagłówków CORS |
| dotenv | 16 | Wczytywanie zmiennych środowiskowych |
| Mistral AI API | — | Model językowy (wywołania server-side) |

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
    │   │   ├── App.jsx            # Główny komponent z routingiem
    │   │   ├── AuthContext.jsx    # Kontekst autoryzacji (Supabase)
    │   │   ├── supabaseClient.js  # Inicjalizacja klienta Supabase
    │   │   ├── main.jsx           # Punkt wejścia aplikacji
    │   │   └── index.css          # Globalne style i zmienne CSS
    │   ├── .env                   # Zmienne środowiskowe frontendu
    │   ├── index.html
    │   ├── package.json
    │   └── vite.config.js
    └── backend/               # Backend — Node.js / Express
        ├── src/
        │   ├── routes/
        │   │   └── ai.js          # Endpointy AI (chat, interests)
        │   └── middleware/
        │       └── errorHandler.js
        ├── .env                   # Zmienne środowiskowe backendu (klucz Mistral)
        ├── .env.example
        ├── package.json
        └── server.js              # Punkt wejścia — Express + routing
```

## Endpointy backendu

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| `GET` | `/api/health` | Sprawdzenie stanu serwera |
| `POST` | `/api/ai/chat` | Czat z asystentem AI (strona `/ai-chat`) |
| `POST` | `/api/ai/interests` | AI przetwarza zainteresowania użytkownika (onboarding, ustawienia) |

### POST `/api/ai/chat`

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
| `LessonPage.jsx` | `/lekcja/:id` | zalogowani | Pojedyncza lekcja SQL |
| `AIChatPage.jsx` | `/ai-chat` | zalogowani | Czat z asystentem AI |
| `MessagesPage.jsx` | `/wiadomosci` | zalogowani | Wiadomości między użytkownikami |
| `UserSettingsPage.jsx` | `/ustawienia` | zalogowani | Ustawienia konta |
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

### Pozostałe

| Komponent | Opis |
|-----------|------|
| `AiChat` | Interfejs czatu z asystentem AI — wysyła wiadomości przez backend |
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
| Wywołania Mistral AI | ❌ przeniesione | ✅ klucz API serwera |
| Klucz Mistral | ❌ usunięty z `.env` | ✅ `MISTRAL_KEY` w `.env` |

> **Dlaczego Supabase jest w frontendzie?**
> Klucz `anon` jest publiczny z założenia — dostęp do danych chroni Row Level Security (RLS) po stronie PostgreSQL. Supabase Realtime wymaga połączenia WebSocket bezpośrednio z przeglądarką.

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

Tabele wiadomości w Supabase:

| Tabela | Opis |
|--------|------|
| `conversations` | Para użytkowników (participant1_id, participant2_id) |
| `messages` | Wiadomości przypisane do rozmowy (text, sender_id, deleted, read_by_recipient) |

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
