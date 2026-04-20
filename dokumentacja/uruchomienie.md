# Jak uruchomić projekt

## Wymagania

- **Node.js** w wersji 18 lub nowszej
- **npm** (instalowany razem z Node.js)
- **Konto Supabase** — projekt z włączoną autoryzacją i tabelą `profiles`
- **Klucz Mistral AI** — wygenerowany na [console.mistral.ai](https://console.mistral.ai/)
- Przeglądarka internetowa (Chrome, Firefox, Edge)
- **Skrypt SQL systemu klas** — musi zostać wykonany w Supabase SQL Editor (patrz poniżej)

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

### 4. Konfiguracja Systemu Klas

Aby korzystać z systemu zarządzania klasami i masowego przypisywania testów, należy najpierw skonfigurować bazę danych Supabase:

#### Wykonanie skryptu SQL

1. **Zaloguj się do Supabase Dashboard**
   - Przejdź do: https://supabase.com/dashboard
   - Wybierz swój projekt

2. **Przejdź do SQL Editor**
   - W menu bocznym wybierz: "SQL Editor"

3. **Wykonaj skrypt systemu klas**
   - Otwórz plik: `dokumentacja/class_system_step_by_step.sql`
   - Wykonaj każdy krok oddzielnie w Supabase SQL Editor
   - Alternatywnie: użyj pliku `dokumentacja/class_system_database_fixed.sql`

4. **Weryfikacja**
   - Sprawdź czy tabele `classes` i `class_students` zostały utworzone
   - Sprawdź czy kolumna `class_id` została dodana do tabeli `profiles`
   - W razie problemów zobacz: [class_system_readme.md](class_system_readme.md)

#### Struktura baz danych po konfiguracji

Po wykonaniu skryptu w bazie danych znajdą się:

**Nowe tabele:**
- `classes` - przechowuje informacje o klasach
- `class_students` - tabela łącząca klasy z uczniami

**Zmodyfikowana tabela:**
- `profiles` - dodano kolumnę `class_id`

#### Przykładowe dane testowe (opcjonalne)

Aby przetestować system klas, możesz dodać przykładowe dane:

```sql
-- Dodaj przykładowe klasy
INSERT INTO classes (name, description, created_by) VALUES
('2a', 'Klasa 2a - SQL podstawy', '<TWOJ_USER_ID>'),
('2d', 'Klasa 2d - SQL średniozaawansowany', '<TWOJ_USER_ID>'),
('3f', 'Klasa 3f - SQL zaawansowany', '<TWOJ_USER_ID>');
```

Zamień `<TWOJ_USER_ID>` na ID użytkownika nauczyciela (możesz go znaleźć w tabeli `auth.users`).

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
