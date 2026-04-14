# Wymagania projektu

## Wymagania funkcjonalne

### Użytkownik niezalogowany

- Użytkownik może przeglądać stronę główną z opisem platformy
- Użytkownik może założyć konto (rejestracja) — konto tworzone jest w Supabase Auth
- Użytkownik może zalogować się na istniejące konto
- Użytkownik może zresetować hasło przez e-mail

### Nowy użytkownik (onboarding)

- Po rejestracji użytkownik przechodzi ankietę powitalną (OnboardingPage)
- Użytkownik wybiera swój poziom SQL (beginner / intermediate / advanced)
- Użytkownik wybiera zainteresowania (np. piłka nożna, gry, podróże, muzyka)
- Dane zapisywane są w tabeli `profiles` w Supabase

### Użytkownik zalogowany

- Użytkownik widzi panel (dashboard) z podsumowaniem swoich postępów
- Użytkownik widzi liczbę ukończonych lekcji, rozwiązanych zadań i dni nauki
- Użytkownik może przeglądać dostępne lekcje SQL
- Użytkownik może otworzyć wybraną lekcję i ją przerobić
- Użytkownik może zadawać pytania asystentowi AI dotyczące SQL i baz danych
- Użytkownik może przeglądać wiadomości
- Użytkownik może przeglądać i edytować ustawienia swojego konta

### Personalizacja

- System dopasowuje przykłady SQL do zainteresowań użytkownika (np. piłka nożna, gry, podróże, muzyka)
- Asystent AI dostosowuje poziom trudności do poziomu użytkownika

## Wymagania niefunkcjonalne

### Wydajność

- Aplikacja działa jako SPA (Single Page Application) — przełączanie widoków bez przeładowania strony
- Strona główna powinna ładować się w czasie poniżej 3 sekund

### Responsywność

- Interfejs działa poprawnie na urządzeniach mobilnych (szerokość od 320px)
- Interfejs działa poprawnie na tabletach i desktopach
- Sidebar na mobilce wysuwa się jako nakładka (drawer), na desktopie jest stały

### Użyteczność

- Nawigacja jest intuicyjna i spójna na wszystkich podstronach
- Komunikaty błędów są czytelne dla użytkownika
- Aplikacja używa ciemnego motywu (dark theme) przyjaznego dla oczu

### Techniczne

- Kod podzielony na wielokrotnie używalne komponenty React
- Style zarządzane przez osobne pliki CSS per komponent
- Routing po stronie klienta obsługiwany przez React Router DOM v7
- Aplikacja budowana i serwowana przez Vite
- Backend oparty na Supabase (PostgreSQL + Auth)
- Dane sesji i profilu użytkownika dostępne globalnie przez `AuthContext`
- Zmienne środowiskowe (klucze Supabase) przechowywane w pliku `.env` (nie commitowanym do repozytorium)
