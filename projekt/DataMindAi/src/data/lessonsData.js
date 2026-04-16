const LESSONS = [
  {
    id: 1,
    title: 'Wprowadzenie',
    subtitle: 'Czym jest SQL i jak działa baza danych?',
    level: 'beginner',
    theory: {
      keywords: ['SQL', 'DATABASE', 'TABLE', 'INTEGER', 'FLOAT', 'VARCHAR', 'BOOLEAN', 'DATE'],
      sections: [
        { type: 'heading', content: 'Czym jest SQL?' },
        { type: 'text', content: 'SQL (Structured Query Language) to język służący do komunikacji z relacyjnymi bazami danych. Pozwala na pobieranie, dodawanie, modyfikowanie i usuwanie danych. Każde polecenie SQL kończy się średnikiem (;).' },
        { type: 'table', label: 'Kategorie poleceń SQL:', columns: ['Kategoria', 'Do czego służy', 'Przykłady poleceń'], rows: [['DDL', 'Definiowanie struktury bazy', 'CREATE, ALTER, DROP'], ['DML', 'Operacje na danych', 'INSERT, UPDATE, DELETE'], ['DQL', 'Pobieranie danych', 'SELECT'], ['DCL', 'Zarządzanie uprawnieniami', 'GRANT, REVOKE']] },
        { type: 'hint', content: 'Nie musisz znać wszystkich kategorii na pamięć — chodzi o to, żebyś wiedział że SQL to nie tylko pobieranie danych, ale cały zestaw narzędzi do zarządzania bazą.' },

        { type: 'heading', content: 'Komentarze w SQL' },
        { type: 'text', content: 'Komentarz to fragment kodu, który SQL całkowicie ignoruje — nie jest wykonywany. Służy jako notatka dla osoby czytającej kod, np. żeby wyjaśnić co dany fragment robi. Możesz napisać tam cokolwiek — baza danych tego nie przeczyta.' },
        { type: 'code', label: 'Rodzaje komentarzy:', content: '-- To jest komentarz jednoliniowy (zaczyna się od --)\nCREATE DATABASE liga_pilkarska; -- komentarz może być też na końcu linii\n\n/*\n  To jest komentarz wieloliniowy.\n  Może zajmować wiele linii.\n  Przydatny do dłuższych opisów.\n*/\nUSE liga_pilkarska;' },
        { type: 'hint', content: 'Komentarze to dobra praktyka — pomagają zrozumieć kod gdy wracasz do niego po czasie lub gdy czyta go ktoś inny.' },

        { type: 'heading', content: 'Czym jest tabela?' },
        { type: 'text', content: 'Baza danych przechowuje dane w tabelach — podobnie jak arkusz kalkulacyjny. Każda tabela ma kolumny (pola) i wiersze (rekordy).' },
        { type: 'table', label: 'Przykładowa tabela gracze:', columns: ['id', 'imie', 'nazwisko', 'pozycja'], rows: [['1', 'Robert', 'Lewandowski', 'napastnik'], ['2', 'Kevin', 'De Bruyne', 'pomocnik']] },
        { type: 'hint', content: 'Każda tabela musi mieć unikalny identyfikator (klucz główny) — zazwyczaj kolumnę o nazwie id.' },

        { type: 'heading', content: 'Typy danych' },
        { type: 'text', content: 'Każda kolumna w tabeli przechowuje dane określonego typu. Typ danych mówi bazie, co może znajdować się w danej kolumnie.' },
        { type: 'table', label: 'Najważniejsze typy danych:', columns: ['Typ', 'Co przechowuje', 'Przykład'], rows: [['INTEGER', 'Liczby całkowite', '1, 42, -7'], ['FLOAT', 'Liczby dziesiętne', '3.14, 99.99'], ['VARCHAR', 'Dowolny tekst (znaki)', "'Robert', 'napastnik'"], ['BOOLEAN', 'Prawda lub fałsz', 'TRUE, FALSE'], ['DATE', 'Data', "'2024-03-15'"]] },
        { type: 'hint', content: 'W tabeli gracze: id to INTEGER (liczba), a imie, nazwisko i pozycja to VARCHAR (tekst). Typ danych decyduje m.in. czy możesz na kolumnie wykonywać działania matematyczne.' },

        { type: 'heading', content: 'Tworzenie bazy danych — CREATE DATABASE' },
        { type: 'text', content: 'Zanim stworzysz tabele, potrzebujesz bazy danych — kontenera, w którym tabele będą przechowywane. CREATE DATABASE tworzy nową, pustą bazę. Następnie musisz wskazać bazie, że chcesz jej używać — służy do tego polecenie USE.' },
        { type: 'code', label: 'Tworzenie i wybór bazy danych:', content: '-- Tworzy nową bazę danych:\nCREATE DATABASE liga_pilkarska;\n\n-- Przełącza się na tę bazę (wszystkie kolejne zapytania działają na niej):\nUSE liga_pilkarska;\n\n-- Teraz możesz tworzyć tabele wewnątrz tej bazy:\nCREATE TABLE gracze (\n    id      INTEGER PRIMARY KEY AUTO_INCREMENT,\n    imie    VARCHAR(100) NOT NULL\n);' },
        { type: 'hint', content: 'Pamiętaj o kolejności: najpierw CREATE DATABASE, potem USE, dopiero potem CREATE TABLE. Bez USE zapytania mogą trafić do złej bazy lub zwrócić błąd.' },

        { type: 'heading', content: 'Wyświetlanie baz danych i tabel' },
        { type: 'text', content: 'MySQL udostępnia specjalne polecenia do przeglądania struktury serwera — możesz sprawdzić jakie bazy istnieją, jakie tabele są w aktywnej bazie oraz jak wygląda struktura konkretnej tabeli.' },
        { type: 'table', label: 'Przydatne polecenia przeglądania:', columns: ['Polecenie', 'Co wyświetla'], rows: [['SHOW DATABASES;', 'Lista wszystkich baz danych na serwerze'], ['SHOW TABLES;', 'Lista wszystkich tabel w aktywnej bazie (po USE)'], ['DESCRIBE nazwa_tabeli;', 'Struktura tabeli — kolumny, typy, ograniczenia'], ['SHOW CREATE TABLE nazwa_tabeli;', 'Pełna instrukcja CREATE TABLE użyta do stworzenia tabeli']] },
        { type: 'code', label: 'Przykład użycia:', content: '-- Pokaż wszystkie bazy na serwerze:\nSHOW DATABASES;\n\n-- Przełącz się na bazę i sprawdź jej tabele:\nUSE liga_pilkarska;\nSHOW TABLES;\n\n-- Sprawdź strukturę tabeli gracze:\nDESCRIBE gracze;' },
        { type: 'hint', content: 'DESCRIBE (skrót: DESC) to najszybszy sposób by sprawdzić nazwy kolumn i ich typy w danej tabeli — bardzo przydatne gdy pracujesz z cudzą bazą danych.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator gracza' },
        { name: 'imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'nazwisko', type: 'VARCHAR', desc: 'Nazwisko gracza' },
        { name: 'pozycja', type: 'VARCHAR', desc: 'Pozycja na boisku' },
      ],
    },
    exercises: [
      { id: 1, task: 'Utwórz bazę danych o nazwie liga_pilkarska.', placeholder: '', hint: 'Użyj: CREATE DATABASE nazwa_bazy;', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Przełącz się na bazę danych liga_pilkarska.', placeholder: '', hint: 'Użyj polecenia USE.', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Wyświetl wszystkie bazy danych na serwerze.', placeholder: '', hint: 'Użyj: SHOW DATABASES;', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Wyświetl wszystkie tabele w aktywnej bazie danych.', placeholder: '', hint: 'Użyj: SHOW TABLES;', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Wyświetl strukturę tabeli gracze (nazwy kolumn i ich typy).', placeholder: '', hint: 'Użyj: DESCRIBE gracze; — możesz też napisać DESC gracze;', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 2,
    title: 'CREATE',
    subtitle: 'Tworzenie tabel i baz danych',
    level: 'beginner',
    theory: {
      keywords: ['CREATE', 'PRIMARY KEY', 'NOT NULL', 'DEFAULT', 'UNIQUE', 'AUTO_INCREMENT'],
      sections: [
        { type: 'heading', content: 'Polecenie CREATE TABLE' },
        { type: 'text', content: 'Zanim zaczniesz dodawać dane, musisz stworzyć tabelę — czyli określić jej strukturę. CREATE TABLE tworzy nową, pustą tabelę. Podajesz nazwę tabeli i listę kolumn: każda kolumna ma nazwę i typ danych.' },
        { type: 'code', label: 'Składnia CREATE TABLE:', content: 'CREATE TABLE nazwa_tabeli (\n    kolumna1  TYP_DANYCH,\n    kolumna2  TYP_DANYCH,\n    kolumna3  TYP_DANYCH\n);' },
        { type: 'code', label: 'Przykład — tworzenie tabeli gracze:', content: 'CREATE TABLE gracze (\n    id        INTEGER  PRIMARY KEY,\n    imie      VARCHAR     NOT NULL,\n    nazwisko  VARCHAR     NOT NULL,\n    pozycja   VARCHAR\n);' },

        { type: 'heading', content: 'Ograniczenia kolumn (constraints)' },
        { type: 'text', content: 'Do każdej kolumny możesz dodać ograniczenia — zasady, których baza danych będzie pilnować przy każdym dodaniu lub zmianie danych.' },
        { type: 'table', label: 'Najważniejsze ograniczenia:', columns: ['Ograniczenie', 'Co robi'], rows: [['PRIMARY KEY', 'Klucz główny — wartość musi być unikalna i nie może być NULL. Zazwyczaj kolumna id.'], ['NOT NULL', 'Kolumna musi mieć wartość — nie można jej zostawić pustej.'], ['DEFAULT wartość', 'Jeśli nie podasz wartości, baza wstawi podaną wartość domyślną.'], ['UNIQUE', 'Każda wartość w kolumnie musi być unikalna (np. adres email).']] },
        { type: 'code', label: 'Przykład z ograniczeniami:', content: 'CREATE TABLE produkty (\n    id      INTEGER  PRIMARY KEY,\n    nazwa   VARCHAR     NOT NULL,\n    cena    FLOAT    DEFAULT 0.0,\n    email   VARCHAR     UNIQUE\n);' },
        { type: 'hint', content: 'Kolumna PRIMARY KEY najczęściej nazywa się id i jest INTEGER. Baza automatycznie pilnuje, że żadne dwa wiersze nie mają tego samego id.' },

        { type: 'heading', content: 'Auto increment — automatyczna numeracja' },
        { type: 'text', content: 'Auto increment to mechanizm, który automatycznie przypisuje kolejną liczbę całkowitą do kolumny przy każdym dodaniu nowego wiersza. Dzięki temu nie musisz ręcznie podawać wartości id — baza robi to za Ciebie. W MySQL używa się słowa kluczowego AUTO_INCREMENT.' },
        { type: 'code', label: 'Przykład z AUTO_INCREMENT:', content: 'CREATE TABLE gracze (\n    id       INTEGER  PRIMARY KEY AUTO_INCREMENT,\n    imie     VARCHAR(100)  NOT NULL,\n    pozycja  VARCHAR(50)\n);\n\n-- Przy INSERT pomijasz kolumnę id — baza nada ją automatycznie:\nINSERT INTO gracze (imie, pozycja)\nVALUES (\'Robert\', \'napastnik\');\n-- id = 1\n\nINSERT INTO gracze (imie, pozycja)\nVALUES (\'Kevin\', \'pomocnik\');\n-- id = 2' },
        { type: 'hint', content: 'Kolumnę z AUTO_INCREMENT pomijasz w INSERT — nie podajesz jej nazwy ani wartości. Baza sama nada kolejny numer: 1, 2, 3 itd.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Klucz główny — PRIMARY KEY' },
        { name: 'nazwa', type: 'VARCHAR', desc: 'Przykładowa kolumna tekstowa' },
      ],
    },
    exercises: [
      { id: 1, task: 'Utwórz tabelę produkty z kolumnami id (INTEGER, klucz główny) i nazwa (VARCHAR, NOT NULL).', placeholder: '', hint: 'Użyj składni: id INTEGER PRIMARY KEY, nazwa VARCHAR NOT NULL', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Utwórz tabelę klienci z kolumnami id (INTEGER, klucz główny), imie (VARCHAR) i email (VARCHAR, unikalny).', placeholder: '', hint: 'Każda kolumna to: nazwa_kolumny TYP_DANYCH ograniczenie, oddzielone przecinkami.', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Utwórz tabelę mecze z kolumnami id (INTEGER, klucz główny), data (VARCHAR), wynik (VARCHAR) i druzyna_id (INTEGER).', placeholder: '', hint: 'Pamiętaj o przecinkach między kolumnami i nawiasach.', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Utwórz tabelę statystyki z kolumnami id (INTEGER, klucz główny), gracz_id (INTEGER), bramki (INTEGER, domyślnie 0) i asysty (INTEGER, domyślnie 0).', placeholder: '', hint: 'Użyj DEFAULT 0 po typie kolumny, np. bramki INTEGER DEFAULT 0', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 3,
    title: 'INSERT',
    subtitle: 'Dodawanie nowych rekordów do tabel',
    level: 'beginner',
    theory: {
      keywords: ['INSERT', 'INTO', 'VALUES'],
      sections: [
        { type: 'heading', content: 'Polecenie INSERT INTO' },
        { type: 'text', content: 'INSERT INTO dodaje nowy wiersz (rekord) do tabeli. Podajesz nazwę tabeli, listę kolumn i odpowiadające im wartości. Kolejność wartości musi być taka sama jak kolejność kolumn.' },
        { type: 'code', label: 'Składnia INSERT INTO:', content: 'INSERT INTO nazwa_tabeli (kolumna1, kolumna2)\nVALUES (\'wartość1\', \'wartość2\');' },
        { type: 'code', label: 'Przykład — dodawanie gracza:', content: "INSERT INTO gracze (imie, nazwisko, pozycja)\nVALUES ('Robert', 'Lewandowski', 'napastnik');" },

        { type: 'heading', content: 'Dodawanie wielu wierszy naraz' },
        { type: 'text', content: 'Zamiast pisać kilka osobnych zapytań INSERT, możesz dodać wiele wierszy jednym poleceniem — oddzielasz je przecinkami po słowie VALUES.' },
        { type: 'code', label: 'Wiele wierszy naraz:', content: "INSERT INTO gracze (imie, pozycja)\nVALUES\n    ('Robert', 'napastnik'),\n    ('Kevin',  'pomocnik'),\n    ('Anna',   'bramkarz');" },

        { type: 'heading', content: 'Pomijanie nazw kolumn' },
        { type: 'text', content: 'Jeśli podajesz wartości dla wszystkich kolumn tabeli (w tej samej kolejności co w definicji tabeli), możesz pominąć listę kolumn. Jednak podawanie nazw kolumn to dobra praktyka — czyni kod czytelniejszym i odpornym na zmiany struktury tabeli.' },
        { type: 'code', label: 'Bez nazw kolumn (krótsza forma):', content: "-- Kolejność: id, imie, nazwisko, pozycja\nINSERT INTO gracze VALUES (10, 'Anna', 'Kowalska', 'bramkarz');" },
        { type: 'hint', content: "Wartości tekstowe (VARCHAR) zawsze wpisuj w apostrofach: 'Robert'. Liczby (INTEGER, FLOAT) wpisuj bez apostrofów: 42, 3.14." },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator' },
        { name: 'imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'pozycja', type: 'VARCHAR', desc: 'Pozycja na boisku' },
      ],
    },
    exercises: [
      { id: 1, task: "Dodaj gracza o imieniu Robert i pozycji napastnik do tabeli gracze.", placeholder: '', hint: "Wartości tekstowe wpisuj w apostrofach: 'Robert'", expectedColumns: [], expectedRows: [] },
      { id: 2, task: "Dodaj dwóch graczy jednym zapytaniem INSERT — Kevin (pomocnik) i Marek (obrońca).", placeholder: '', hint: 'Wiele rekordów oddzielaj przecinkiem po VALUES — VALUES (...), (...)', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Dodaj nowego gracza podając wszystkie kolumny: id = 10, imie = Anna, pozycja = bramkarz. Pomiń nazwy kolumn.', placeholder: '', hint: 'Gdy podajesz wartości dla wszystkich kolumn, możesz pominąć ich nazwy: INSERT INTO gracze VALUES (...)', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Dodaj gracza tylko z imieniem Piotr — nie podawaj kolumny pozycja (przyjmie wartość NULL).', placeholder: '', hint: "Podaj tylko kolumnę imie — brakujące kolumny przyjmą NULL lub wartość domyślną.", expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 4,
    title: 'UPDATE',
    subtitle: 'Modyfikowanie istniejących danych',
    level: 'beginner',
    theory: {
      keywords: ['UPDATE', 'SET', 'WHERE'],
      sections: [
        { type: 'heading', content: 'Polecenie UPDATE' },
        { type: 'text', content: 'UPDATE zmienia wartości w już istniejących wierszach. Wskazujesz które kolumny zmienić (SET) i które wiersze mają zostać zmienione (WHERE). Bez klauzuli WHERE zmienią się WSZYSTKIE wiersze w tabeli — dlatego prawie zawsze należy jej używać.' },
        { type: 'code', label: 'Składnia UPDATE:', content: 'UPDATE nazwa_tabeli\nSET kolumna = \'nowa_wartość\'\nWHERE warunek;' },
        { type: 'code', label: 'Przykład — zmiana pozycji gracza:', content: "UPDATE gracze\nSET pozycja = 'obrońca'\nWHERE id = 3;" },

        { type: 'heading', content: 'Zmiana wielu kolumn naraz' },
        { type: 'text', content: 'W jednym zapytaniu UPDATE możesz zmienić kilka kolumn jednocześnie — oddziel je przecinkami w klauzuli SET.' },
        { type: 'code', label: 'Zmiana wielu kolumn:', content: "UPDATE gracze\nSET imie = 'Jan',\n    pozycja = 'pomocnik'\nWHERE id = 5;" },

        { type: 'heading', content: 'Zmiana wartości na podstawie obecnej wartości' },
        { type: 'text', content: 'Możesz odwołać się do aktualnej wartości kolumny — np. żeby zwiększyć liczbę o pewną wartość. Baza najpierw odczyta wartość, potem ją zmieni.' },
        { type: 'code', label: 'Zwiększanie wartości:', content: '-- Zwiększ wartość rynkową wszystkich napastników o 10\nUPDATE gracze\nSET wartosc_rynkowa = wartosc_rynkowa + 10\nWHERE pozycja = \'napastnik\';' },
        { type: 'hint', content: 'Zawsze sprawdź najpierw, które wiersze dotkniesz: SELECT * FROM gracze WHERE twoj_warunek. Dopiero potem uruchom UPDATE z tym samym warunkiem.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator' },
        { name: 'imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'pozycja', type: 'VARCHAR', desc: 'Pozycja na boisku' },
        { name: 'wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
      ],
    },
    exercises: [
      { id: 1, task: 'Zmień wartość rynkową gracza o id = 1 na 55 milionów.', placeholder: '', hint: 'Użyj SET do określenia nowej wartości i WHERE do wskazania wiersza.', expectedColumns: [], expectedRows: [] },
      { id: 2, task: "Zmień pozycję gracza o id = 3 na 'pomocnik'.", placeholder: '', hint: "Pamiętaj o apostrofach przy wartościach tekstowych: SET pozycja = 'pomocnik'", expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Zwiększ wartość rynkową wszystkich napastników o 10 milionów.', placeholder: '', hint: "Możesz odwołać się do bieżącej wartości: SET wartosc_rynkowa = wartosc_rynkowa + 10, potem WHERE pozycja = 'napastnik'", expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Ustaw wartość rynkową na 0 dla wszystkich graczy bez przypisanej pozycji (pozycja IS NULL).', placeholder: '', hint: 'Do sprawdzenia braku wartości użyj: WHERE pozycja IS NULL', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 5,
    title: 'DELETE, DROP',
    subtitle: 'Usuwanie rekordów i tabel',
    level: 'beginner',
    theory: {
      keywords: ['DELETE', 'DROP'],
      sections: [
        { type: 'heading', content: 'Polecenie DELETE' },
        { type: 'text', content: 'DELETE usuwa wybrane wiersze z tabeli. Tabela sama w sobie zostaje — znikają tylko dane pasujące do warunku WHERE. Bez klauzuli WHERE zostaną usunięte WSZYSTKIE wiersze (tabela stanie się pusta, ale nadal istnieje).' },
        { type: 'code', label: 'Składnia DELETE:', content: 'DELETE FROM nazwa_tabeli\nWHERE warunek;' },
        { type: 'code', label: 'Przykład — usunięcie jednego gracza:', content: 'DELETE FROM gracze\nWHERE id = 5;' },
        { type: 'code', label: 'Przykład — usunięcie wielu wierszy:', content: "-- Usuwa wszystkich graczy na pozycji bramkarz\nDELETE FROM gracze\nWHERE pozycja = 'bramkarz';" },

        { type: 'heading', content: 'Polecenie DROP TABLE' },
        { type: 'text', content: 'DROP TABLE usuwa całą tabelę z bazy danych — razem z jej strukturą i wszystkimi danymi. Nie można tego cofnąć. Stosuje się go gdy tabela jest już niepotrzebna.' },
        { type: 'code', label: 'Składnia DROP TABLE:', content: 'DROP TABLE nazwa_tabeli;' },

        { type: 'heading', content: 'Różnica między DELETE a DROP TABLE' },
        { type: 'table', label: 'Porównanie:', columns: ['Polecenie', 'Co usuwa', 'Czy tabela zostaje?'], rows: [['DELETE FROM ...', 'Wybrane wiersze (dane)', 'TAK — tabela istnieje dalej'], ['DROP TABLE ...', 'Całą tabelę (dane + strukturę)', 'NIE — tabela znika całkowicie']] },
        { type: 'hint', content: 'DROP TABLE jest nieodwracalne — upewnij się, że na pewno chcesz usunąć tabelę, zanim to zrobisz. Jeśli chcesz tylko wyczyścić dane, użyj DELETE FROM bez WHERE.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator' },
        { name: 'imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'pozycja', type: 'VARCHAR', desc: 'Pozycja na boisku' },
        { name: 'wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
      ],
    },
    exercises: [
      { id: 1, task: 'Usuń gracza o id = 5 z tabeli gracze.', placeholder: '', hint: 'Zawsze używaj WHERE — bez niego usuniesz WSZYSTKIE wiersze!', expectedColumns: [], expectedRows: [] },
      { id: 2, task: "Usuń wszystkich graczy, których pozycja to 'bramkarz'.", placeholder: '', hint: "Wpisz: WHERE pozycja = 'bramkarz'", expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Usuń wszystkich graczy z wartością rynkową poniżej 10 milionów.', placeholder: '', hint: 'Użyj operatora < w klauzuli WHERE.', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Usuń tabelę tymczasowe_wyniki z bazy danych.', placeholder: '', hint: 'DROP TABLE usuwa całą tabelę — nie można tego cofnąć!', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 6,
    title: 'ALTER TABLE',
    subtitle: 'Zmiana struktury istniejących tabel',
    level: 'intermediate',
    theory: {
      keywords: ['ALTER', 'ADD', 'COLUMN', 'RENAME'],
      sections: [
        { type: 'heading', content: 'Polecenie ALTER TABLE' },
        { type: 'text', content: 'ALTER TABLE pozwala zmieniać strukturę tabeli już po jej utworzeniu — bez usuwania i tworzenia jej od nowa. Możesz dodawać i usuwać kolumny, a także zmieniać nazwy tabeli lub kolumn.' },

        { type: 'heading', content: 'Dodawanie kolumny — ADD COLUMN' },
        { type: 'text', content: 'Dodaje nową kolumnę do istniejącej tabeli. Nowo dodana kolumna dla dotychczasowych wierszy przyjmie wartość NULL (lub wartość domyślną, jeśli ją podasz).' },
        { type: 'code', label: 'Dodanie kolumny:', content: 'ALTER TABLE gracze\nADD COLUMN wiek INTEGER;\n\n-- Z wartością domyślną:\nALTER TABLE gracze\nADD COLUMN aktywny INTEGER DEFAULT 1;' },

        { type: 'heading', content: 'Usuwanie kolumny — DROP COLUMN' },
        { type: 'text', content: 'Usuwa kolumnę z tabeli razem ze wszystkimi jej danymi. Operacja jest nieodwracalna — upewnij się, że kolumna nie jest już potrzebna.' },
        { type: 'code', label: 'Usunięcie kolumny:', content: 'ALTER TABLE gracze\nDROP COLUMN wiek;' },

        { type: 'heading', content: 'Zmiana nazwy tabeli — RENAME TO' },
        { type: 'text', content: 'Pozwala zmienić nazwę całej tabeli. Dane i struktura pozostają bez zmian.' },
        { type: 'code', label: 'Zmiana nazwy tabeli:', content: 'ALTER TABLE gracze\nRENAME TO zawodnicy;' },

        { type: 'table', label: 'Podsumowanie ALTER TABLE:', columns: ['Operacja', 'Składnia'], rows: [['Dodaj kolumnę', 'ALTER TABLE tabela ADD COLUMN nazwa TYP'], ['Usuń kolumnę', 'ALTER TABLE tabela DROP COLUMN nazwa'], ['Zmień nazwę tabeli', 'ALTER TABLE stara_nazwa RENAME TO nowa_nazwa']] },
        { type: 'hint', content: 'ALTER TABLE zmienia strukturę — nie dane. Jeśli chcesz zmienić wartości w wierszach, użyj UPDATE.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator' },
        { name: 'imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'wiek', type: 'INTEGER', desc: 'Wiek gracza (nowa kolumna)' },
      ],
    },
    exercises: [
      { id: 1, task: 'Dodaj kolumnę email (VARCHAR) do tabeli gracze.', placeholder: '', hint: 'Składnia: ALTER TABLE gracze ADD COLUMN email VARCHAR', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Usuń kolumnę wiek z tabeli gracze.', placeholder: '', hint: 'Składnia: ALTER TABLE gracze DROP COLUMN wiek', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Dodaj kolumnę aktywny (INTEGER) z domyślną wartością 1 do tabeli gracze.', placeholder: '', hint: 'Dodaj DEFAULT 1 na końcu definicji kolumny.', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Zmień nazwę tabeli gracze na zawodnicy.', placeholder: '', hint: 'Składnia: ALTER TABLE gracze RENAME TO zawodnicy', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 7,
    title: 'SELECT',
    subtitle: 'Pobieranie i filtrowanie danych',
    level: 'beginner',
    theory: {
      keywords: ['SELECT', 'FROM', 'WHERE', '*'],

      sections: [
        { type: 'heading', content: 'Czym jest SELECT?' },
        { type: 'text', content: 'SELECT to podstawowe polecenie SQL służące do pobierania danych z tabeli. Możesz wybrać wszystkie kolumny (SELECT *) lub wypisać tylko te, które cię interesują. To jak pytanie bazy: "Pokaż mi te dane".' },
        { type: 'code', label: 'Podstawowa składnia:', content: '-- Wszystkie kolumny:\nSELECT * FROM nazwa_tabeli;\n\n-- Wybrane kolumny:\nSELECT kolumna1, kolumna2 FROM nazwa_tabeli;' },

        { type: 'heading', content: 'Filtrowanie wyników — WHERE' },
        { type: 'text', content: 'Klauzula WHERE pozwala wybrać tylko te wiersze, które spełniają podany warunek. Bez WHERE SELECT zwraca wszystkie wiersze z tabeli.' },
        { type: 'code', label: 'Przykład z WHERE:', content: "-- Tylko napastnicy:\nSELECT imie, nazwisko\nFROM gracze\nWHERE pozycja = 'napastnik';\n\n-- Gracze o wartości powyżej 50 mln:\nSELECT imie, wartosc_rynkowa\nFROM gracze\nWHERE wartosc_rynkowa > 50;" },

        { type: 'heading', content: 'Operatory porównania' },
        { type: 'table', label: 'Dostępne operatory w WHERE:', columns: ['Operator', 'Znaczenie', 'Przykład'], rows: [['=', 'Równa się', "pozycja = 'napastnik'"], ['!= lub <>', 'Różne od', 'wartosc_rynkowa != 0'], ['>', 'Większe niż', 'wartosc_rynkowa > 50'], ['<', 'Mniejsze niż', 'wiek < 30'], ['>=', 'Większe lub równe', 'bramki >= 10'], ['<=', 'Mniejsze lub równe', 'wiek <= 25']] },

        { type: 'heading', content: 'Przykładowa tabela gracze' },
        { type: 'table', label: '', columns: ['id', 'imie', 'nazwisko', 'pozycja', 'wartosc_rynkowa'], rows: [['1', 'Robert', 'Lewandowski', 'napastnik', '45'], ['2', 'Kevin', 'De Bruyne', 'pomocnik', '80']] },
        { type: 'hint', content: 'Używaj SELECT * tylko gdy naprawdę potrzebujesz wszystkich kolumn. Wypisanie konkretnych kolumn jest szybsze i czytelniejsze.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator gracza' },
        { name: 'imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'nazwisko', type: 'VARCHAR', desc: 'Nazwisko gracza' },
        { name: 'narodowosc', type: 'VARCHAR', desc: 'Narodowość gracza' },
        { name: 'pozycja', type: 'VARCHAR', desc: 'Pozycja na boisku (napastnik, pomocnik, obrońca, bramkarz)' },
        { name: 'wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
      ],
    },
    exercises: [
      { id: 1, task: 'Wyświetl imiona i nazwiska wszystkich graczy.', placeholder: '', hint: 'Wypisz nazwy kolumn: imie, nazwisko po słowie SELECT.', expectedColumns: ['imie', 'nazwisko'], expectedRows: [['Robert', 'Lewandowski'], ['Kevin', 'De Bruyne']] },
      { id: 2, task: 'Wyświetl wszystkich graczy, których pozycja to "napastnik".', placeholder: '', hint: "Użyj klauzuli WHERE pozycja = 'napastnik'", expectedColumns: ['imie', 'nazwisko', 'pozycja'], expectedRows: [['Robert', 'Lewandowski', 'napastnik']] },
      { id: 3, task: 'Wyświetl imię, nazwisko i wartość rynkową graczy z wartością powyżej 50 milionów.', placeholder: '', hint: 'Użyj operatora > w klauzuli WHERE.', expectedColumns: ['imie', 'nazwisko', 'wartosc_rynkowa'], expectedRows: [['Kevin', 'De Bruyne', '80']] },
      { id: 4, task: 'Wyświetl wszystkie dane graczy o narodowości "Polska".', placeholder: '', hint: "Wpisz: WHERE narodowosc = 'Polska'", expectedColumns: ['imie', 'nazwisko', 'narodowosc'], expectedRows: [['Robert', 'Lewandowski', 'Polska']] },
      { id: 5, task: 'Wyświetl imię i pozycję graczy, których imię to "Kevin".', placeholder: '', hint: "Użyj WHERE imie = 'Kevin'", expectedColumns: ['imie', 'pozycja'], expectedRows: [['Kevin', 'pomocnik']] },
    ],
  },
  {
    id: 8,
    title: 'AVG, MIN, MAX, SUM, COUNT',
    subtitle: 'Funkcje agregujące do obliczania statystyk',
    level: 'intermediate',
    theory: {
      keywords: ['AVG', 'MIN', 'MAX', 'SUM', 'COUNT'],
      sections: [
        { type: 'heading', content: 'Czym są funkcje agregujące?' },
        { type: 'text', content: 'Funkcje agregujące działają na całej grupie wierszy i zwracają jeden wynik — np. średnią, sumę lub maksimum. Zamiast wyświetlać każdy wiersz osobno, agregują (zbierają) dane w jedną wartość.' },
        { type: 'table', label: 'Dostępne funkcje agregujące:', columns: ['Funkcja', 'Co oblicza', 'Przykład użycia'], rows: [['COUNT(*)', 'Liczba wszystkich wierszy', 'SELECT COUNT(*) FROM gracze'], ['COUNT(kolumna)', 'Liczba wierszy z wartością (bez NULL)', 'SELECT COUNT(pozycja) FROM gracze'], ['SUM(kolumna)', 'Suma wartości w kolumnie', 'SELECT SUM(wartosc_rynkowa) FROM gracze'], ['AVG(kolumna)', 'Średnia arytmetyczna kolumny', 'SELECT AVG(wartosc_rynkowa) FROM gracze'], ['MAX(kolumna)', 'Największa wartość w kolumnie', 'SELECT MAX(wartosc_rynkowa) FROM gracze'], ['MIN(kolumna)', 'Najmniejsza wartość w kolumnie', 'SELECT MIN(wartosc_rynkowa) FROM gracze']] },

        { type: 'heading', content: 'Przykłady użycia' },
        { type: 'code', label: 'Podstawowe użycie funkcji:', content: '-- Ilu graczy jest w tabeli?\nSELECT COUNT(*) FROM gracze;\n\n-- Jaka jest średnia wartość rynkowa?\nSELECT AVG(wartosc_rynkowa) FROM gracze;\n\n-- Łączna wartość wszystkich graczy:\nSELECT SUM(wartosc_rynkowa) FROM gracze;\n\n-- Najdroższy i najtańszy gracz:\nSELECT MAX(wartosc_rynkowa), MIN(wartosc_rynkowa) FROM gracze;' },

        { type: 'heading', content: 'Łączenie z WHERE' },
        { type: 'text', content: 'Możesz połączyć funkcje agregujące z klauzulą WHERE — wtedy agregacja dotyczy tylko wybranych wierszy, a nie całej tabeli.' },
        { type: 'code', label: 'Agregacja z filtrem WHERE:', content: "-- Średnia wartość tylko napastników:\nSELECT AVG(wartosc_rynkowa)\nFROM gracze\nWHERE pozycja = 'napastnik';" },
        { type: 'hint', content: 'COUNT(*) liczy wszystkie wiersze, nawet z NULL. COUNT(kolumna) pomija wiersze, gdzie ta kolumna to NULL — warto znać tę różnicę.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator' },
        { name: 'imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
        { name: 'bramki', type: 'INTEGER', desc: 'Liczba strzelonych bramek' },
      ],
    },
    exercises: [
      { id: 1, task: 'Oblicz średnią wartość rynkową wszystkich graczy.', placeholder: '', hint: 'Użyj AVG(wartosc_rynkowa).', expectedColumns: ['avg'], expectedRows: [['62.5']] },
      { id: 2, task: 'Znajdź maksymalną wartość rynkową w tabeli.', placeholder: '', hint: 'Użyj MAX(wartosc_rynkowa).', expectedColumns: ['max'], expectedRows: [['80']] },
      { id: 3, task: 'Policz ilu graczy jest w tabeli.', placeholder: '', hint: 'Użyj COUNT(*) żeby policzyć wszystkie wiersze.', expectedColumns: ['count'], expectedRows: [['2']] },
      { id: 4, task: 'Oblicz łączną wartość rynkową wszystkich graczy.', placeholder: '', hint: 'Użyj SUM(wartosc_rynkowa).', expectedColumns: ['sum'], expectedRows: [['125']] },
      { id: 5, task: 'Znajdź minimalną liczbę bramek strzelonych przez gracza.', placeholder: '', hint: 'Użyj MIN(bramki).', expectedColumns: ['min'], expectedRows: [['12']] },
    ],
  },
  {
    id: 9,
    title: 'ORDER BY, GROUP BY, HAVING, AS',
    subtitle: 'Sortowanie, grupowanie i aliasy',
    level: 'intermediate',
    theory: {
      keywords: ['ORDER BY', 'GROUP BY', 'HAVING', 'AS', 'ASC', 'DESC'],
      sections: [
        { type: 'heading', content: 'Sortowanie wyników — ORDER BY' },
        { type: 'text', content: 'ORDER BY sortuje wyniki zapytania według wybranej kolumny. Domyślnie sortuje rosnąco (od najmniejszej do największej). Możesz zmienić kierunek na malejący dodając DESC.' },
        { type: 'table', label: 'Kierunki sortowania:', columns: ['Słowo', 'Znaczenie', 'Przykład'], rows: [['ASC', 'Rosnąco (domyślne)', 'ORDER BY wartosc_rynkowa ASC'], ['DESC', 'Malejąco', 'ORDER BY wartosc_rynkowa DESC']] },
        { type: 'code', label: 'Przykład ORDER BY:', content: '-- Gracze posortowani od najdroższego:\nSELECT imie, wartosc_rynkowa\nFROM gracze\nORDER BY wartosc_rynkowa DESC;\n\n-- Posortuj alfabetycznie po nazwisku:\nSELECT imie, nazwisko\nFROM gracze\nORDER BY nazwisko ASC;' },

        { type: 'heading', content: 'Grupowanie danych — GROUP BY' },
        { type: 'text', content: 'GROUP BY grupuje wiersze, które mają tę samą wartość w wybranej kolumnie. Używa się go razem z funkcjami agregującymi — np. żeby policzyć ilu graczy jest na każdej pozycji.' },
        { type: 'code', label: 'Przykład GROUP BY:', content: '-- Ile graczy gra na każdej pozycji?\nSELECT pozycja, COUNT(*) AS liczba\nFROM gracze\nGROUP BY pozycja;\n\n-- Średnia wartość na każdej pozycji:\nSELECT pozycja, AVG(wartosc_rynkowa) AS srednia\nFROM gracze\nGROUP BY pozycja;' },

        { type: 'heading', content: 'Filtrowanie grup — HAVING' },
        { type: 'text', content: 'HAVING działa jak WHERE, ale dla grup — filtruje wyniki po wykonaniu GROUP BY. WHERE filtruje wiersze przed grupowaniem, HAVING filtruje grupy po grupowaniu.' },
        { type: 'code', label: 'Przykład HAVING:', content: '-- Pokaż tylko pozycje, na których gra więcej niż 2 graczy:\nSELECT pozycja, COUNT(*) AS liczba\nFROM gracze\nGROUP BY pozycja\nHAVING COUNT(*) > 2;' },

        { type: 'heading', content: 'Aliasy — AS' },
        { type: 'text', content: 'AS pozwala nadać kolumnie lub tabeli tymczasową nazwę (alias). Alias obowiązuje tylko w wynikach danego zapytania — nie zmienia nazwy w bazie danych.' },
        { type: 'code', label: 'Przykład AS:', content: 'SELECT imie AS "Imię zawodnika",\n       wartosc_rynkowa AS "Wartość (mln €)"\nFROM gracze;' },
        { type: 'hint', content: 'Kolejność klauzul w zapytaniu jest ważna: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY. Napisane inaczej — SQL zwróci błąd.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator' },
        { name: 'imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'pozycja', type: 'VARCHAR', desc: 'Pozycja na boisku' },
        { name: 'wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
      ],
    },
    exercises: [
      { id: 1, task: 'Wyświetl imię i wartość rynkową graczy posortowanych malejąco po wartości.', placeholder: '', hint: 'Dodaj ORDER BY wartosc_rynkowa DESC na końcu zapytania.', expectedColumns: ['imie', 'wartosc_rynkowa'], expectedRows: [['Kevin', '80'], ['Robert', '45']] },
      { id: 2, task: 'Policz ilu graczy gra na każdej pozycji.', placeholder: '', hint: 'Użyj GROUP BY pozycja razem z COUNT(*).', expectedColumns: ['pozycja', 'liczba'], expectedRows: [['napastnik', '1'], ['pomocnik', '1']] },
      { id: 3, task: 'Wyświetl pozycje, na których gra więcej niż 1 gracz (użyj HAVING).', placeholder: '', hint: 'Użyj HAVING COUNT(*) > 1 po GROUP BY pozycja.', expectedColumns: ['pozycja', 'liczba'], expectedRows: [] },
      { id: 4, task: 'Wyświetl imię gracza z aliasem "Imię zawodnika" i wartość z aliasem "Wartość (mln €)".', placeholder: '', hint: 'Użyj słowa kluczowego AS po nazwie kolumny, np. imie AS "Imię zawodnika".', expectedColumns: ['Imię zawodnika', 'Wartość (mln €)'], expectedRows: [] },
    ],
  },
  {
    id: 10,
    title: 'BETWEEN, DISTINCT, EXISTS, IN, NOT, LIKE, AND, OR',
    subtitle: 'Operatory i warunki filtrowania',
    level: 'intermediate',
    theory: {
      keywords: ['BETWEEN', 'DISTINCT', 'IN', 'NOT', 'LIKE', 'AND', 'OR'],
      sections: [
        { type: 'heading', content: 'Łączenie warunków — AND, OR' },
        { type: 'text', content: 'AND i OR pozwalają łączyć wiele warunków w klauzuli WHERE. AND wymaga spełnienia obu warunków jednocześnie. OR wymaga spełnienia przynajmniej jednego.' },
        { type: 'code', label: 'Przykład AND i OR:', content: "-- Napastnicy z wartością powyżej 40 mln:\nSELECT * FROM gracze\nWHERE pozycja = 'napastnik' AND wartosc_rynkowa > 40;\n\n-- Napastnicy LUB bramkarze:\nSELECT * FROM gracze\nWHERE pozycja = 'napastnik' OR pozycja = 'bramkarz';" },

        { type: 'heading', content: 'Zakres wartości — BETWEEN' },
        { type: 'text', content: 'BETWEEN sprawdza czy wartość mieści się w podanym zakresie (włącznie z granicami). Działa zarówno na liczbach jak i tekstach (alfabetycznie).' },
        { type: 'code', label: 'Przykład BETWEEN:', content: '-- Gracze z wartością między 30 a 70 mln:\nSELECT * FROM gracze\nWHERE wartosc_rynkowa BETWEEN 30 AND 70;' },

        { type: 'heading', content: 'Lista wartości — IN' },
        { type: 'text', content: 'IN sprawdza czy wartość należy do podanej listy. To skrót od wielu warunków OR połączonych ze sobą.' },
        { type: 'code', label: 'Przykład IN:', content: "-- Gracze na pozycji napastnik lub bramkarz:\nSELECT * FROM gracze\nWHERE pozycja IN ('napastnik', 'bramkarz');\n\n-- Równoważne, ale dłuższe:\nSELECT * FROM gracze\nWHERE pozycja = 'napastnik' OR pozycja = 'bramkarz';" },

        { type: 'heading', content: 'Wzorce tekstowe — LIKE' },
        { type: 'text', content: 'LIKE wyszukuje tekst pasujący do wzorca. Używa specjalnych symboli: % zastępuje dowolny ciąg znaków, _ zastępuje dokładnie jeden znak.' },
        { type: 'table', label: 'Wzorce LIKE:', columns: ['Wzorzec', 'Co pasuje', 'Przykład'], rows: [["'L%'", "Zaczyna się na L", "Lewandowski, Lloris"], ["'%ski'", "Kończy się na ski", "Lewandowski, Kowalski"], ["'%ewan%'", "Zawiera 'ewan'", "Lewandowski"], ["'De_Bruyne'", "De + jeden znak + Bruyne", "De Bruyne"]] },
        { type: 'code', label: 'Przykład LIKE:', content: "SELECT * FROM gracze\nWHERE nazwisko LIKE 'L%';" },

        { type: 'heading', content: 'Unikalne wartości — DISTINCT' },
        { type: 'text', content: 'DISTINCT usuwa duplikaty z wyników — wyświetla każdą unikalną wartość tylko raz.' },
        { type: 'code', label: 'Przykład DISTINCT:', content: '-- Jakie pozycje istnieją w tabeli? (bez powtórzeń)\nSELECT DISTINCT pozycja FROM gracze;' },

        { type: 'heading', content: 'Negacja warunku — NOT' },
        { type: 'text', content: 'NOT odwraca warunek — zwraca wiersze, dla których warunek jest fałszywy. Można go łączyć z IN, LIKE, BETWEEN i innymi operatorami.' },
        { type: 'code', label: 'Przykład NOT:', content: "-- Gracze, którzy NIE są napastnikami:\nSELECT * FROM gracze\nWHERE NOT pozycja = 'napastnik';\n\n-- Alternatywna forma:\nWHERE pozycja != 'napastnik'" },
        { type: 'hint', content: 'Możesz łączyć operatory: WHERE wartosc_rynkowa BETWEEN 20 AND 80 AND pozycja != \'bramkarz\'. Używaj nawiasów żeby kontrolować kolejność: WHERE (a = 1 OR b = 2) AND c = 3.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator' },
        { name: 'imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'nazwisko', type: 'VARCHAR', desc: 'Nazwisko gracza' },
        { name: 'pozycja', type: 'VARCHAR', desc: 'Pozycja na boisku' },
        { name: 'wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
      ],
    },
    exercises: [
      { id: 1, task: 'Wyświetl graczy z wartością rynkową między 30 a 70 milionów.', placeholder: '', hint: 'Wpisz: WHERE wartosc_rynkowa BETWEEN 30 AND 70', expectedColumns: ['imie', 'wartosc_rynkowa'], expectedRows: [['Robert', '45']] },
      { id: 2, task: "Znajdź graczy, których nazwisko zaczyna się na literę 'L'.", placeholder: '', hint: "Wzorzec: LIKE 'L%' — % oznacza dowolny ciąg znaków.", expectedColumns: ['imie', 'nazwisko'], expectedRows: [['Robert', 'Lewandowski']] },
      { id: 3, task: 'Wyświetl unikalne pozycje w tabeli gracze (bez powtórzeń).', placeholder: '', hint: 'Użyj DISTINCT przed nazwą kolumny.', expectedColumns: ['pozycja'], expectedRows: [['napastnik'], ['pomocnik']] },
      { id: 4, task: "Wyświetl graczy, których pozycja to 'napastnik' LUB 'bramkarz' — użyj operatora IN.", placeholder: '', hint: "Użyj: WHERE pozycja IN ('napastnik', 'bramkarz')", expectedColumns: ['imie', 'pozycja'], expectedRows: [['Robert', 'napastnik']] },
      { id: 5, task: 'Wyświetl graczy, których wartość rynkowa NIE jest równa 45.', placeholder: '', hint: 'Użyj: WHERE NOT wartosc_rynkowa = 45 lub WHERE wartosc_rynkowa != 45', expectedColumns: ['imie', 'wartosc_rynkowa'], expectedRows: [['Kevin', '80']] },
    ],
  },
  {
    id: 11,
    title: 'Łączenie tabel',
    subtitle: 'INNER JOIN, LEFT JOIN, RIGHT JOIN i FULL JOIN',
    level: 'intermediate',
    theory: {
      keywords: ['JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'ON'],
      sections: [
        { type: 'heading', content: 'Czym jest JOIN?' },
        { type: 'text', content: 'JOIN łączy dane z dwóch lub więcej tabel w jedno zapytanie. Tabele łączymy na podstawie wspólnej kolumny — najczęściej klucza obcego (np. druzyna_id w tabeli gracze) z kluczem głównym (id w tabeli druzyny).' },
        { type: 'table', label: 'Przykładowe tabele:', columns: ['gracze: id', 'gracze: imie', 'gracze: druzyna_id'], rows: [['1', 'Robert', '10'], ['2', 'Kevin', '20'], ['3', 'Anna', 'NULL']] },
        { type: 'table', label: '', columns: ['druzyny: id', 'druzyny: nazwa', 'druzyny: kraj'], rows: [['10', 'Bayern Monachium', 'Niemcy'], ['20', 'Manchester City', 'Anglia']] },

        { type: 'heading', content: 'INNER JOIN' },
        { type: 'text', content: 'INNER JOIN zwraca tylko te wiersze, które mają dopasowanie w obu tabelach. Wiersze bez dopasowania (np. Anna bez druzyna_id) są pomijane.' },
        { type: 'code', label: 'INNER JOIN — tylko pasujące wiersze:', content: 'SELECT g.imie, d.nazwa\nFROM gracze g\nINNER JOIN druzyny d ON g.druzyna_id = d.id;\n\n-- Wynik: Robert (Bayern), Kevin (Man City)\n-- Anna znika — nie ma drużyny' },

        { type: 'heading', content: 'LEFT JOIN' },
        { type: 'text', content: 'LEFT JOIN zwraca wszystkie wiersze z lewej tabeli (FROM), nawet jeśli nie mają dopasowania w prawej. Brakujące wartości z prawej tabeli przyjmą NULL.' },
        { type: 'code', label: 'LEFT JOIN — wszyscy gracze, nawet bez drużyny:', content: 'SELECT g.imie, d.nazwa\nFROM gracze g\nLEFT JOIN druzyny d ON g.druzyna_id = d.id;\n\n-- Wynik: Robert (Bayern), Kevin (Man City), Anna (NULL)' },

        { type: 'heading', content: 'RIGHT JOIN i FULL JOIN' },
        { type: 'text', content: 'RIGHT JOIN zwraca wszystkie wiersze z prawej tabeli — nawet drużyny bez żadnego gracza. FULL JOIN łączy obie strony — zwraca wszystko z obu tabel, wstawiając NULL tam gdzie brak dopasowania.' },
        { type: 'table', label: 'Porównanie typów JOIN:', columns: ['Typ JOIN', 'Co zwraca'], rows: [['INNER JOIN', 'Tylko wiersze z dopasowaniem w obu tabelach'], ['LEFT JOIN', 'Wszystkie z lewej + pasujące z prawej (NULL gdzie brak)'], ['RIGHT JOIN', 'Wszystkie z prawej + pasujące z lewej (NULL gdzie brak)'], ['FULL JOIN', 'Wszystkie wiersze z obu tabel (NULL gdzie brak dopasowania)']] },
        { type: 'hint', content: 'Alias tabeli (np. g dla gracze, d dla druzyny) skraca zapis i czyni kod czytelniejszym. Zamiast gracze.imie piszesz g.imie.' },
      ],
      schema: [
        { name: 'gracze.id', type: 'INTEGER', desc: 'ID gracza' },
        { name: 'gracze.imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'gracze.druzyna_id', type: 'INTEGER', desc: 'Klucz obcy do tabeli druzyny' },
        { name: 'druzyny.id', type: 'INTEGER', desc: 'ID drużyny (klucz główny)' },
        { name: 'druzyny.nazwa', type: 'VARCHAR', desc: 'Nazwa drużyny' },
        { name: 'druzyny.kraj', type: 'VARCHAR', desc: 'Kraj drużyny' },
      ],
    },
    exercises: [
      { id: 1, task: 'Wyświetl imię gracza i nazwę jego drużyny używając INNER JOIN.', placeholder: '', hint: 'Warunek łączenia: ON g.druzyna_id = d.id', expectedColumns: ['imie', 'nazwa'], expectedRows: [] },
      { id: 2, task: 'Wyświetl wszystkich graczy i ich drużyny — uwzględnij też graczy bez drużyny (LEFT JOIN).', placeholder: '', hint: 'LEFT JOIN zwróci NULL w kolumnie drużyny dla graczy bez druzyna_id.', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Wyświetl nazwy drużyn i liczbę graczy w każdej drużynie (użyj JOIN i GROUP BY).', placeholder: '', hint: 'Połącz INNER JOIN z GROUP BY d.nazwa i COUNT(g.id).', expectedColumns: ['nazwa', 'liczba_graczy'], expectedRows: [] },
      { id: 4, task: "Wyświetl imiona graczy i nazwy drużyn, ale tylko dla drużyn z kraju 'Niemcy'.", placeholder: '', hint: "Dodaj WHERE d.kraj = 'Niemcy' na końcu zapytania z JOIN.", expectedColumns: ['imie', 'nazwa'], expectedRows: [] },
    ],
  },
  {
    id: 12,
    title: 'Zapytania zagnieżdżone',
    subtitle: 'SELECT wewnątrz SELECT — zaawansowana analiza danych',
    level: 'advanced',
    theory: {
      keywords: ['EXISTS', 'SUBQUERY'],
      sections: [
        { type: 'heading', content: 'Czym są podzapytania?' },
        { type: 'text', content: 'Podzapytanie (subquery) to zapytanie SELECT umieszczone wewnątrz innego zapytania. Baza najpierw wykonuje podzapytanie, a jego wynik używa w zapytaniu zewnętrznym. To sposób na zadawanie złożonych pytań bez tworzenia tabel tymczasowych.' },
        { type: 'code', label: 'Podzapytanie — ogólny schemat:', content: 'SELECT kolumna\nFROM tabela\nWHERE kolumna OPERATOR (\n    SELECT kolumna\n    FROM inna_tabela\n    WHERE warunek\n);' },

        { type: 'heading', content: 'Podzapytanie z IN' },
        { type: 'text', content: 'Podzapytanie zwracające listę wartości można użyć z operatorem IN. Zewnętrzne zapytanie wybierze tylko te wiersze, których wartość jest na liście zwróconej przez podzapytanie.' },
        { type: 'code', label: 'Przykład z IN:', content: "-- Pokaż graczy z drużyn z Polski:\nSELECT imie, nazwisko\nFROM gracze\nWHERE druzyna_id IN (\n    SELECT id\n    FROM druzyny\n    WHERE kraj = 'Polska'\n);" },

        { type: 'heading', content: 'Podzapytanie skalarne (jeden wynik)' },
        { type: 'text', content: 'Jeśli podzapytanie zwraca dokładnie jedną wartość (np. MAX lub AVG), możesz go użyć bezpośrednio w warunku porównania.' },
        { type: 'code', label: 'Przykład ze skalarnym podzapytaniem:', content: '-- Gracze drożsi od średniej:\nSELECT imie, wartosc_rynkowa\nFROM gracze\nWHERE wartosc_rynkowa > (\n    SELECT AVG(wartosc_rynkowa)\n    FROM gracze\n);\n\n-- Gracz z najwyższą wartością:\nSELECT imie\nFROM gracze\nWHERE wartosc_rynkowa = (\n    SELECT MAX(wartosc_rynkowa)\n    FROM gracze\n);' },

        { type: 'heading', content: 'Podzapytanie z EXISTS' },
        { type: 'text', content: 'EXISTS sprawdza czy podzapytanie zwróciło jakikolwiek wynik. Jeśli tak — warunek jest spełniony. EXISTS jest wydajny, bo baza nie musi pobierać wszystkich wyników — zatrzymuje się przy pierwszym dopasowaniu.' },
        { type: 'code', label: 'Przykład z EXISTS:', content: '-- Drużyny, które mają przynajmniej jednego gracza:\nSELECT nazwa\nFROM druzyny d\nWHERE EXISTS (\n    SELECT 1\n    FROM gracze g\n    WHERE g.druzyna_id = d.id\n);\n\n-- SELECT 1 to skrót — liczy się sam fakt istnienia wiersza, nie jego zawartość' },
        { type: 'hint', content: 'Podzapytania można zagnieżdżać wielopoziomowo — SELECT w SELECT w SELECT. Im głębiej, tym wolniej — jeśli to możliwe, zastąp zagnieżdżone podzapytania przez JOIN.' },
      ],
      schema: [
        { name: 'gracze.id', type: 'INTEGER', desc: 'ID gracza' },
        { name: 'gracze.druzyna_id', type: 'INTEGER', desc: 'Klucz obcy do druzyny' },
        { name: 'gracze.wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
        { name: 'statystyki.gracz_id', type: 'INTEGER', desc: 'Klucz obcy do gracze' },
        { name: 'statystyki.bramki', type: 'INTEGER', desc: 'Liczba bramek w sezonie' },
        { name: 'druzyny.id', type: 'INTEGER', desc: 'ID drużyny' },
        { name: 'druzyny.kraj', type: 'VARCHAR', desc: 'Kraj drużyny' },
      ],
    },
    exercises: [
      { id: 1, task: "Wyświetl imiona graczy, którzy należą do drużyn z Polski (użyj podzapytania z IN).", placeholder: '', hint: "Podzapytanie zwraca listę id drużyn z Polski: SELECT id FROM druzyny WHERE kraj = 'Polska'", expectedColumns: ['imie'], expectedRows: [] },
      { id: 2, task: 'Znajdź graczy, których wartość rynkowa jest wyższa niż średnia wszystkich graczy.', placeholder: '', hint: 'Podzapytanie: SELECT AVG(wartosc_rynkowa) FROM gracze — użyj go z operatorem >.', expectedColumns: ['imie', 'wartosc_rynkowa'], expectedRows: [] },
      { id: 3, task: 'Wyświetl imię i nazwisko gracza z najwyższą wartością rynkową (użyj podzapytania z MAX).', placeholder: '', hint: 'Podzapytanie zwróci jedną wartość: SELECT MAX(wartosc_rynkowa) FROM gracze.', expectedColumns: ['imie', 'nazwisko'], expectedRows: [] },
      { id: 4, task: 'Wyświetl drużyny, które mają przynajmniej jednego gracza (użyj EXISTS).', placeholder: '', hint: 'EXISTS sprawdza czy SELECT 1 FROM gracze WHERE g.druzyna_id = d.id zwraca jakiś wiersz.', expectedColumns: ['nazwa'], expectedRows: [] },
    ],
  },
]

export default LESSONS
