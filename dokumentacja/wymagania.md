# Wymagania projektu

## Wymagania funkcjonalne

### Użytkownik niezalogowany

- Użytkownik może przeglądać stronę główną z opisem platformy
- Użytkownik może założyć konto (rejestracja)
- Użytkownik może zalogować się na istniejące konto

### Użytkownik zalogowany

- Użytkownik widzi panel (dashboard) z podsumowaniem swoich postępów
- Użytkownik widzi liczbę ukończonych lekcji, rozwiązanych zadań i dni nauki
- Użytkownik może przeglądać dostępne lekcje SQL
- Użytkownik może zadawać pytania asystentowi AI dotyczące SQL i baz danych
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
