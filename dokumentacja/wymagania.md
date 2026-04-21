# Wymagania projektu

## Wymagania funkcjonalne

### Użytkownik niezalogowany

- Użytkownik może przeglądać stronę główną z opisem platformy
- Użytkownik może założyć konto (rejestracja) — konto tworzone jest w Supabase Auth
- Użytkownik może zalogować się na istniejące konto
- Użytkownik może zresetować hasło przez e-mail

### Nowy użytkownik (onboarding)

- Po rejestracji użytkownik przechodzi ankietę powitalną (OnboardingPage)
- Użytkownik wybiera swój poziom SQL (początkujący / średniozaawansowany / zaawansowany)
- Użytkownik opisuje swoje zainteresowania w oknie czatu z AI
- AI (Google Gemma 4 przez OpenRouter) przetwarza odpowiedź i zapisuje znormalizowane zainteresowania do profilu
- Dane zapisywane są w tabeli `profiles` w Supabase

### Użytkownik zalogowany

- Użytkownik widzi panel (dashboard) z podsumowaniem swoich postępów
- Użytkownik widzi liczbę ukończonych lekcji, rozwiązanych zadań i dni nauki
- Użytkownik może przeglądać dostępne lekcje SQL
- Użytkownik może otworzyć wybraną lekcję i ją przerobić
- Użytkownik może zadawać pytania asystentowi AI dotyczące SQL i baz danych
- Odpowiedzi AI są renderowane z formatowaniem Markdown (tabela, pogrubienia, inline code)
- Użytkownik otrzymuje powiadomienia (toasty) o akcjach w systemie
- Użytkownik może wysyłać i odbierać wiadomości od innych użytkowników (real-time)
- Użytkownik może edytować ustawienia swojego konta

### Użytkownik - Nauczyciel

- Nauczyciel ma dostęp do Panel Nauczyciela
- Nauczyciel widzi listę wszystkich uczniów z ich poziomami SQL
- Nauczyciel może tworzyć testy (ręcznie lub przez AI)
- Nauczyciel może przypisywać testy do uczniów (pojedynczo lub masowo)
- Nauczyciel może zarządzać klasami (tworzyć, edytować, usuwać)
- Nauczyciel może filtrować uczniów według klas
- Nauczyciel może przeglądać statystyki klasy
- Nauczyciel może dodawać/usuwać uczniów z klas
- Nauczyciel może przypisywać testy do całych klas naraz
- Nauczyciel może tworzyć klasy (walidacja nazwy: cyfra + 1-2 litery)

### Użytkownik - Administrator

- Administrator ma dostęp do Panel Administratora (`/panel-admina`)
- Administrator widzi pełną listę użytkowników z wszystkimi danymi
- Administrator może edytować profile użytkowników (imię, email, poziom SQL)
- Administrator może zmieniać role użytkowników (uczeń ↔ nauczyciel ↔ administrator)
- Administrator może usuwać użytkowników (automatyczne usunięcie przypisań i powiązań z klasami)
- Administrator może zarządzać wszystkimi klasami (tworzyć, edytować, usuwać)
- Administrator ma dostęp do statystyk systemowych (liczba użytkowników, klas, testów, przypisań)
- Administrator jest chroniony przed zmianą/usunięciem własnego konta

### Ustawienia konta

- Użytkownik może zmienić wyświetlane imię
- Użytkownik może zmienić adres e-mail (wymaga potwierdzenia)
- Użytkownik może zmienić hasło (wymagane podanie aktualnego)
- Użytkownik może zmienić poziom SQL
- Użytkownik może zaktualizować zainteresowania przez czat z AI

### Personalizacja

- System dopasowuje przykłady i ćwiczenia SQL do zainteresowań użytkownika
- Asystent AI dostosowuje styl odpowiedzi do poziomu użytkownika
- Zainteresowania przetwarzane są przez model AI po stronie serwera (nie w przeglądarce)
- AI (Google Gemma 4) odpowiada na pytania z formatowaniem Markdown

### Panel Nauczyciela

- Nauczyciel może przeglądać listę wszystkich uczniów
- Nauczyciel może tworzyć testy ręcznie lub generować je przez AI
- Nauczyciel może przypisywać testy do pojedynczych uczniów
- Nauczyciel może przeglądać statystyki klasy
- Nauczyciel może eksportować wyniki do CSV/PDF
- Nauczyciel może komunikować się z uczniami przez system wiadomości

### System Klas

- Nauczyciel może tworzyć klasy z nazwami w formacie 2a, 2d, 3f, 10b
- Nauczyciel może edytować nazwy i opisy klas
- Nauczyciel może usuwać klasy
- Nauczyciel może dodawać uczniów do klas (wielu naraz)
- Nauczyciel może usuwać uczniów z klas
- Nauczyciel może filtrować listę uczniów według klas
- System waliduje nazwy klas (tylko format: cyfra + 1-2 litery)
- Administrator ma pełną kontrolę nad wszystkimi klasami

### Masowe Przypisywanie Testów

- Nauczyciel może przypisać test do wielu uczniów naraz (checkboxes)
- Nauczyciel może przypisać test do całej klasy jednym kliknięciem
- System zapobiega duplikatom w przypisaniach
- Modal ma zakładki: "Wybierz uczniów" lub "Wybierz klasę"
- System pokazuje licznik wybranych uczniów

### Zarządzanie Uczniami w Klasach

- Nauczyciel może zarządzać uczniami w każdej klasie osobno
- Interfejs pokazuje aktualnie przypisanych uczniów
- Nauczyciel może dodawać nowych uczniów do klasy (wielu naraz)
- System pokazuje listę dostępnych uczniów do dodania
- Nauczyciel może usuwać uczniów z klas

### Wiadomości

- Użytkownik może rozpocząć rozmowę z innym użytkownikiem wpisując jego e-mail
- Nowe wiadomości pojawiają się w czasie rzeczywistym (Supabase Realtime)
- Użytkownik może usunąć własną wiadomość
- Nieprzeczytane wiadomości oznaczone są licznikiem przy rozmowie

### Powiadomienia (Toasts)

- System wyświetla powiadomienia o akcjach w aplikacji (sukces, błąd, ostrzeżenie)
- Powiadomienia pojawiają się w prawym górnym rogu
- Powiadomienia automatycznie znikają po 4 sekundach
- Użytkownik może ręcznie zamknąć powiadomienie

---

## Wymagania niefunkcjonalne

### Bezpieczeństwo

- Klucz API OpenRouter przechowywany wyłącznie po stronie serwera (backend) — nie jest dostępny w przeglądarce
- Klucze Supabase (`anon`) są publiczne zgodnie z projektem Supabase — dostęp do danych chroniony przez Row Level Security (RLS) w PostgreSQL
- Pliki `.env` nie są commitowane do repozytorium (`.gitignore`)
- Komunikacja frontend ↔ backend ograniczona do zaufanego originu (CORS)
- Trasy administratora są chronione przez `AdminRoute` komponent
- Użytkownik nie może zmienić/usunąć swojego konta z poziomu panelu administratora

### Wydajność

- Aplikacja działa jako SPA (Single Page Application) — przełączanie widoków bez przeładowania strony
- Strona główna ładuje się w czasie poniżej 3 sekund
- Odpowiedzi AI są renderowane przy użyciu `react-markdown` dla wydajnego wyświetlania Markdown

### Responsywność

- Interfejs działa poprawnie na urządzeniach mobilnych (szerokość od 320px)
- Interfejs działa poprawnie na tabletach i desktopach
- Sidebar na mobilce wysuwa się jako nakładka (drawer), na desktopie jest stały

### Użyteczność

- Nawigacja jest intuicyjna i spójna na wszystkich podstronach
- Komunikaty błędów są czytelne dla użytkownika (polskie komunikaty)
- Aplikacja używa ciemnego motywu (dark theme)
- Powiadomienia (toasty) zapewniają natychmiastową informację zwrotną

### Techniczne

- Kod podzielony na wielokrotnie używalne komponenty React
- Style zarządzane przez osobne pliki CSS per komponent
- Routing po stronie klienta obsługiwany przez React Router DOM v7
- Frontend budowany przez Vite
- Backend oparty na Node.js + Express — obsługuje wywołania AI
- Baza danych i auth w Supabase (PostgreSQL)
- Dane sesji i profilu użytkownika dostępne globalnie przez `AuthContext`
- Wywołania AI realizowane przez backend (nie bezpośrednio z przeglądarki)
- AI używa modelu Google Gemma 4-26B przez agregator OpenRouter
- Powiadomienia realizowane przez bibliotekę `react-toastify`
- Renderowanie Markdown przez `react-markdown`
