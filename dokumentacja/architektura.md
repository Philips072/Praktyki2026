# Architektura projektu

## Technologie

| Technologia | Wersja | Rola |
|-------------|--------|------|
| React | 19 | Biblioteka UI — komponenty, stan, renderowanie |
| Vite | 8 | Bundler, serwer deweloperski, HMR |
| React Router DOM | 7 | Routing po stronie klienta (SPA) |
| Supabase JS | 2 | Backend-as-a-Service: auth, baza danych (PostgreSQL), realtime |
| CSS (własne arkusze) | — | Stylowanie komponentów |
| Venn (czcionka) | — | Typografia aplikacji |

## Struktura folderów

```
Praktyki2026/
├── dokumentacja/          # Dokumentacja projektu
├── dziennik/              # Dzienniki pracy członków zespołu
│   ├── Filip-Strzalka/
│   ├── Pawel-Rak/
│   └── Wiktoria-Maslowiec/
└── projekt/
    └── DataMindAi/        # Główna aplikacja React
        ├── public/
        ├── src/
        │   ├── assets/        # Obrazy, logo
        │   ├── Components/    # Komponenty wielokrotnego użytku
        │   ├── Pages/         # Strony (widoki routera)
        │   ├── hooks/         # Custom hooki React
        │   ├── data/          # Dane statyczne (lekcje SQL)
        │   ├── App.jsx        # Główny komponent z routingiem
        │   ├── AuthContext.jsx # Kontekst autoryzacji (Supabase)
        │   ├── supabaseClient.js # Inicjalizacja klienta Supabase
        │   ├── main.jsx       # Punkt wejścia aplikacji
        │   └── index.css      # Globalne style i zmienne CSS
        ├── index.html
        ├── package.json
        └── vite.config.js
```

## Strony (Pages)

| Plik | Ścieżka | Opis |
|------|---------|------|
| `HomePage.jsx` | `/` | Strona główna — landing page |
| `LoginPage.jsx` | `/logowanie` | Formularz logowania |
| `RegisterPage.jsx` | `/rejestracja` | Formularz rejestracji |
| `ForgotPasswordPage.jsx` | `/reset-hasla` | Resetowanie hasła przez e-mail |
| `OnboardingPage.jsx` | `/onboarding` | Ankieta powitalna (poziom, zainteresowania) |
| `DashboardPage.jsx` | `/dashboard` | Panel użytkownika |
| `LecturesPage.jsx` | `/lekcje` | Lista lekcji SQL |
| `LessonPage.jsx` | `/lekcja/:id` | Pojedyncza lekcja SQL |
| `AIChatPage.jsx` | `/ai-chat` | Czat z asystentem AI |
| `MessagesPage.jsx` | `/wiadomosci` | Wiadomości |
| `UserSettingsPage.jsx` | `/ustawienia` | Ustawienia konta |
| `NotFoundPage.jsx` | `*` | Strona 404 |

## Komponenty (Components)

### Strona główna

| Komponent | Opis |
|-----------|------|
| `HomeHeader` | Nagłówek z nawigacją i hamburger menu |
| `Home1` | Sekcja hero — tytuł, CTA, okno z przykładem SQL |
| `Home2` | Sekcja z kartami funkcji (Personalizacja, AI, Praktyka) |
| `Home3` | Sekcja z dodatkowymi informacjami |
| `Home4` | Sekcja CTA — wezwanie do rejestracji |
| `Footer` | Stopka strony |

### Dashboard

| Komponent | Opis |
|-----------|------|
| `SidebarHeader` | Layout dashboardu: sidebar + nagłówek + slot na treść |
| `Dashboard1` | Powitanie użytkownika i statystyki (lekcje, zadania, dni nauki) |
| `Dashboard2` | Skróty do akcji (pierwsza lekcja, czat AI) |

### Autoryzacja

| Komponent | Opis |
|-----------|------|
| `Login` | Formularz logowania (Supabase auth) |
| `Register` | Formularz rejestracji (Supabase auth) |
| `ForgotPassword` | Formularz resetowania hasła |
| `PublicRoute` | Wrapper blokujący dostęp do stron auth dla zalogowanych |

### Pozostałe

| Komponent | Opis |
|-----------|------|
| `AiChat` | Interfejs czatu z asystentem AI |
| `Lectures` | Lista dostępnych lekcji SQL |
| `Messages` | Widok wiadomości |
| `OnboardingModal` | Modal ankiety onboardingowej |
| `UserSettings` | Formularz ustawień konta |
| `NotFound` | Komunikat strony 404 |
| `AnimateOnScroll` | Wrapper animacji przy wejściu elementu w viewport |
| `DateHeader` | Nagłówek z aktualną datą |
| `Sidebar` | Nawigacja boczna dashboardu |

## Autoryzacja i Supabase

Aplikacja korzysta z Supabase jako backendu. Klient inicjowany jest w `supabaseClient.js` na podstawie zmiennych środowiskowych:

```js
// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)
```

Kontekst autoryzacji (`AuthContext.jsx`) dostarcza przez cały drzewo komponentów:
- `user` — obiekt zalogowanego użytkownika (lub `null`)
- `profile` — profil z tabeli `profiles` (name, role, sql_level, interests)
- `loading` — stan ładowania sesji

Tabela `profiles` w Supabase:

| Kolumna | Typ | Opis |
|---------|-----|------|
| `id` | uuid (FK → auth.users) | Identyfikator użytkownika |
| `name` | text | Imię/nazwa wyświetlana |
| `role` | text | Rola użytkownika |
| `sql_level` | text | Poziom SQL (beginner / intermediate / advanced) |
| `interests` | text[] | Zainteresowania wybrane podczas onboardingu |

## Routing

Routing obsługiwany przez React Router DOM v7. Konfiguracja w `App.jsx`. Całe drzewo opakowane jest w `AuthProvider`:

```jsx
<AuthProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/"                element={<HomePage />} />
      <Route path="/logowanie"       element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/rejestracja"     element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/reset-hasla"     element={<ForgotPasswordPage />} />
      <Route path="/onboarding"      element={<OnboardingPage />} />
      <Route path="/dashboard"       element={<DashboardPage />} />
      <Route path="/lekcje"          element={<LecturesPage />} />
      <Route path="/lekcja/:id"      element={<LessonPage />} />
      <Route path="/ai-chat"         element={<AIChatPage />} />
      <Route path="/wiadomosci"      element={<MessagesPage />} />
      <Route path="/ustawienia"      element={<UserSettingsPage />} />
      <Route path="*"                element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
</AuthProvider>
```

## Zmienne CSS (design tokens)

Globalne zmienne zdefiniowane w `index.css`:

| Zmienna | Wartość | Opis |
|---------|---------|------|
| `--primaryBg` | `#1a1a1a` | Główne tło aplikacji |
| `--containerBoxBg` | `#212121` | Tło kart/kontenerów |
| `--sidebarBg` | `#1c1c1c` | Tło sidebara |
| `--primaryText` | `#fcf6f3` | Kolor tekstu głównego |
| `--secondaryText` | `#a6a6a6` | Kolor tekstu drugorzędnego |
| `--accentColor` | `#324277` | Kolor akcentu (niebieski) |
| `--borderColor` | `#363636` | Kolor obramowań |

## Responsywność

Aplikacja dostosowuje się do różnych rozdzielczości:

| Breakpoint | Zachowanie |
|------------|-----------|
| > 900px | Sidebar pełnej szerokości (280px), layout desktop |
| 641px – 900px | Sidebar węższy (220px) |
| ≤ 640px | Sidebar jako nakładka (position: fixed) z backdrop |
