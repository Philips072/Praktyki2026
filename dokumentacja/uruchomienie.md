# Jak uruchomić projekt

## Wymagania

- **Node.js** w wersji 18 lub nowszej
- **npm** (instalowany razem z Node.js)
- **react-router-dom** v7 (instalowany automatycznie przez `npm install`)
- Przeglądarka internetowa (Chrome, Firefox, Edge)

## Kroki

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/Philips072/Praktyki2026.git
cd Praktyki2026
```

### 2. Przejdź do folderu projektu

```bash
cd projekt/DataMindAi
```

### 3. Zainstaluj zależności

```bash
npm install
```

### 4. Uruchom serwer deweloperski

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:5173`

## Dostępne skrypty

| Skrypt | Opis |
|--------|------|
| `npm run dev` | Uruchamia serwer deweloperski (Vite) |
| `npm run build` | Buduje wersję produkcyjną do folderu `dist/` |
| `npm run preview` | Podgląd zbudowanej wersji produkcyjnej |
| `npm run lint` | Sprawdza kod przez ESLint |

## Zależności

### Produkcyjne

| Pakiet | Wersja | Opis |
|--------|--------|------|
| react | ^19.2.4 | Biblioteka UI |
| react-dom | ^19.2.4 | Renderowanie React w przeglądarce |
| react-router-dom | ^7.14.0 | Routing po stronie klienta — **wymagany**, instalowany przez `npm install` |

### Deweloperskie

| Pakiet | Wersja | Opis |
|--------|--------|------|
| vite | ^8.0.4 | Bundler i serwer deweloperski |
| @vitejs/plugin-react | ^6.0.1 | Wsparcie React dla Vite |
| eslint | ^9.39.4 | Linter kodu |

## Routing — dostępne strony

| Ścieżka | Strona |
|---------|--------|
| `/` | Strona główna |
| `/logowanie` | Logowanie |
| `/rejestracja` | Rejestracja |
| `/dashboard` | Panel użytkownika |
