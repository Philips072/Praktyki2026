# Architektura projektu

## Technologie

| Technologia | Wersja | Rola |
|-------------|--------|------|
| React | 19 | Biblioteka UI — komponenty, stan, renderowanie |
| Vite | 8 | Bundler, serwer deweloperski, HMR |
| React Router DOM | 7 | Routing po stronie klienta (SPA) |
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
        │   ├── App.jsx        # Główny komponent z routingiem
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
| `DashboardPage.jsx` | `/dashboard` | Panel użytkownika |
| `LecturesPage.jsx` | `/lekcje` | Lista lekcji SQL |
| `AIChatPage.jsx` | `/ai-chat` | Czat z asystentem AI |
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
| `Login` | Formularz logowania |
| `Register` | Formularz rejestracji |

## Routing

Routing obsługiwany przez React Router DOM v7. Konfiguracja w `App.jsx`:

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/"            element={<HomePage />} />
    <Route path="/logowanie"   element={<LoginPage />} />
    <Route path="/rejestracja" element={<RegisterPage />} />
    <Route path="/dashboard"   element={<DashboardPage />} />
  </Routes>
</BrowserRouter>
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
