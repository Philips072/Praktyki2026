const LESSONS = [
  {
    id: 1,
    title: 'Język DDL — tworzenie i usuwanie tabel',
    subtitle: 'Poznaj instrukcje CREATE DATABASE, CREATE TABLE i DROP',
    level: 'beginner',
    theory: {
      keywords: ['DDL', 'CREATE DATABASE', 'CREATE TABLE', 'DROP', 'USE', 'INTEGER', 'VARCHAR', 'DATE'],
      sections: [
        { type: 'heading', content: 'Czym jest DDL?' },
        { type: 'text', content: 'DDL (Data Definition Language) to część SQL służąca do definiowania i modyfikowania struktury bazy danych. Obejmuje polecenia tworzenia, zmiany i usuwania baz danych, tabel oraz innych obiektów.' },
        { type: 'table', label: 'Polecenia DDL:', columns: ['Polecenie', 'Co robi'], rows: [['CREATE', 'Tworzy nowy obiekt (bazę, tabelę)', 'CREATE DATABASE, CREATE TABLE'], ['ALTER', 'Modyfikuje istniejący obiekt', 'ALTER TABLE'], ['DROP', 'Usuwa obiekt', 'DROP DATABASE, DROP TABLE']] },
        { type: 'hint', content: 'DDL dotyczy struktury — nie danych. Jeśli chcesz dodawać, zmieniać lub usuwać dane, używasz języka DML (INSERT, UPDATE, DELETE).' },

        { type: 'heading', content: 'Tworzenie bazy danych — CREATE DATABASE' },
        { type: 'text', content: 'CREATE DATABASE tworzy nową, pustą bazę danych. Jest to kontener, w którym będziesz przechowywać tabele i inne obiekty.' },
        { type: 'code', label: 'Tworzenie bazy danych:', content: '-- Tworzy nową bazę danych:\nCREATE DATABASE liga_pilkarska;\n\n-- Sprawdza czy baza została utworzona:\nSHOW DATABASES;' },
        { type: 'hint', content: 'Nazwa bazy danych może zawierać litery, cyfry i podkreślenia. Unikaj spacji i znaków specjalnych — użyj podkreślenia zamiast nich.' },

        { type: 'heading', content: 'Wybieranie bazy — USE' },
        { type: 'text', content: 'USE przełącza aktywną bazę danych. Wszystkie kolejne polecenia będą wykonywane na wybranej bazie.' },
        { type: 'code', label: 'Wybór bazy:', content: 'USE liga_pilkarska;\n\n-- Teraz możesz tworzyć tabele w tej bazie:' },
        { type: 'hint', content: 'Zawsze używaj USE przed CREATE TABLE, w przeciwnym razie tabela zostanie utworzona w domyślnej bazie.' },

        { type: 'heading', content: 'Tworzenie tabeli — CREATE TABLE' },
        { type: 'text', content: 'CREATE TABLE tworzy nową tabelę w aktywnej bazie. Musisz podać nazwę tabeli i definicje wszystkich kolumn: nazwę, typ danych i opcjonalne ograniczenia.' },
        { type: 'code', label: 'Składnia CREATE TABLE:', content: 'CREATE TABLE nazwa_tabeli (\n    kolumna1  TYP_DANYCH,\n    kolumna2  TYP_DANYCH,\n    ...\n);' },
        { type: 'code', label: 'Przykład — tabela gracze:', content: 'CREATE TABLE gracze (\n    id        INTEGER PRIMARY KEY AUTO_INCREMENT,\n    imie      VARCHAR(100) NOT NULL,\n    nazwisko  VARCHAR(100) NOT NULL,\n    pozycja   VARCHAR(50)\n);' },

        { type: 'heading', content: 'Typy danych w SQL' },
        { type: 'table', label: 'Najczęściej używane typy:', columns: ['Typ', 'Opis', 'Przykład'], rows: [['INTEGER / INT', 'Liczby całkowite', '1, 42, -7, 1000'], ['VARCHAR(n)', 'Tekst o max n znakach', "'Robert', 'napastnik'"], ['FLOAT / DECIMAL', 'Liczby dziesiętne', '3.14, 99.99'], ['DATE', 'Data (YYYY-MM-DD)', "'2024-03-15'"], ['BOOLEAN', 'Prawda/fałsz', 'TRUE, FALSE'], ['TEXT', 'Długi tekst bez limitu', "'Cały opis...'"]] },

        { type: 'heading', content: 'Usuwanie tabel i baz — DROP' },
        { type: 'text', content: 'DROP TABLE usuwa całą tabelę wraz z danymi. DROP DATABASE usuwa całą bazę. Operacje te są nieodwracalne.' },
        { type: 'code', label: 'Usuwanie obiektów:', content: '-- Usuwa tabelę:\nDROP TABLE gracze;\n\n-- Usuwa bazę danych:\nDROP DATABASE liga_pilkarska;' },
        { type: 'hint', content: 'DROP jest nieodwracalne! Zawsze sprawdź dwa razy, czy na pewno chcesz usunąć obiekt. Jeśli chcesz tylko usunąć dane, użyj DELETE FROM.' },

        { type: 'heading', content: 'Podstawowe ograniczenia kolumn' },
        { type: 'table', label: 'Ograniczenia (constraints):', columns: ['Ograniczenie', 'Znaczenie'], rows: [['PRIMARY KEY', 'Unikalny identyfikator wiersza — zazwyczaj kolumna id'], ['NOT NULL', 'Kolumna musi mieć wartość — nie może być pusta'], ['AUTO_INCREMENT', 'Automatyczna numeracja — baza nadaje kolejne id'], ['DEFAULT wartość', 'Wartość domyślna, gdy nie podano innej'], ['UNIQUE', 'Wartość musi być unikalna w tej kolumnie']] },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Klucz główny — PRIMARY KEY AUTO_INCREMENT' },
        { name: 'imie', type: 'VARCHAR(100)', desc: 'Imię gracza — NOT NULL' },
        { name: 'nazwisko', type: 'VARCHAR(100)', desc: 'Nazwisko gracza — NOT NULL' },
        { name: 'pozycja', type: 'VARCHAR(50)', desc: 'Pozycja na boisku (opcjonalna)' },
      ],
    },
    exercises: [
      { id: 1, task: 'Utwórz bazę danych o nazwie liga_pilkarska.', placeholder: '', hint: 'Użyj: CREATE DATABASE nazwa_bazy;', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Przełącz się na bazę danych liga_pilkarska.', placeholder: '', hint: 'Użyj polecenia USE.', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Utwórz tabelę gracze z kolumnami: id (INTEGER, PRIMARY KEY, AUTO_INCREMENT), imie (VARCHAR(100), NOT NULL), nazwisko (VARCHAR(100), NOT NULL).', placeholder: '', hint: 'Użyj składni: id INTEGER PRIMARY KEY AUTO_INCREMENT, imie VARCHAR(100) NOT NULL...', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Utwórz tabelę mecze z kolumnami: id (INTEGER, PRIMARY KEY, AUTO_INCREMENT), data (DATE), wynik (VARCHAR(50)).', placeholder: '', hint: 'Pamiętaj o typie DATE dla kolumny data.', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Utwórz tabelę statystyki z kolumnami: id (INTEGER, PRIMARY KEY), gracz_id (INTEGER), bramki (INTEGER, DEFAULT 0), asysty (INTEGER, DEFAULT 0).', placeholder: '', hint: 'Użyj DEFAULT 0 po typie kolumny, np. bramki INTEGER DEFAULT 0', expectedColumns: [], expectedRows: [] },
      { id: 6, task: 'Wyświetl strukturę tabeli gracze (nazwy kolumn, typy i ograniczenia).', placeholder: '', hint: 'Użyj: DESCRIBE gracze; lub DESC gracze;', expectedColumns: [], expectedRows: [] },
      { id: 7, task: 'Wyświetl wszystkie tabele w aktywnej bazie danych.', placeholder: '', hint: 'Użyj: SHOW TABLES;', expectedColumns: [], expectedRows: [] },
      { id: 8, task: 'Usuń tabelę statystyki z bazy danych.', placeholder: '', hint: 'Użyj: DROP TABLE nazwa_tabeli;', expectedColumns: [], expectedRows: [] },
      { id: 9, task: 'Usuń bazę danych liga_pilkarska.', placeholder: '', hint: 'Użyj: DROP DATABASE nazwa_bazy;', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 2,
    title: 'ALTER TABLE',
    subtitle: 'Zmiana struktury istniejących tabel',
    level: 'beginner',
    theory: {
      keywords: ['ALTER TABLE', 'ADD COLUMN', 'DROP COLUMN', 'MODIFY COLUMN', 'RENAME', 'CHANGE'],
      sections: [
        { type: 'heading', content: 'Czym jest ALTER TABLE?' },
        { type: 'text', content: 'ALTER TABLE to polecenie z języka DML, które pozwala modyfikować strukturę tabeli już po jej utworzeniu — bez usuwania danych. Możesz dodawać i usuwać kolumny, zmieniać ich typy i nazwy.' },
        { type: 'hint', content: 'ALTER TABLE zmienia strukturę tabeli — nie dane. Jeśli chcesz zmodyfikować wartości w wierszach, użyj UPDATE.' },

        { type: 'heading', content: 'Dodawanie kolumny — ADD COLUMN' },
        { type: 'text', content: 'Dodaje nową kolumnę do istniejącej tabeli. Dla istniejących wierszy nowa kolumna przyjmie wartość NULL (lub wartość domyślną, jeśli ją podasz).' },
        { type: 'code', label: 'Dodawanie kolumny:', content: '-- Dodaje kolumnę do tabeli:\nALTER TABLE gracze\nADD COLUMN wiek INTEGER;\n\n-- Z wartością domyślną:\nALTER TABLE gracze\nADD COLUMN aktywny BOOLEAN DEFAULT TRUE;' },

        { type: 'heading', content: 'Usuwanie kolumny — DROP COLUMN' },
        { type: 'text', content: 'Usuwa kolumnę z tabeli wraz ze wszystkimi danymi, które zawierała. Operacja jest nieodwracalna.' },
        { type: 'code', label: 'Usuwanie kolumny:', content: '-- Usuwa kolumnę wiek:\nALTER TABLE gracze\nDROP COLUMN wiek;' },
        { type: 'hint', content: 'DROP COLUMN usuwa dane — sprawdź dwa razy, czy nie potrzebujesz kolumny lub jej danych przed usunięciem.' },

        { type: 'heading', content: 'Modyfikowanie kolumny — MODIFY / CHANGE' },
        { type: 'text', content: 'Zmienia definicję istniejącej kolumny — np. typ danych, ograniczenia lub domyślną wartość. W MySQL używa się MODIFY (zmiana typu) lub CHANGE (zmiana nazwy).' },
        { type: 'code', label: 'Modyfikowanie kolumny:', content: '-- Zmienia typ kolumny wiek na SMALLINT:\nALTER TABLE gracze\nMODIFY COLUMN wiek SMALLINT;\n\n-- Zmienia nazwę kolumny wiek na lata:\nALTER TABLE gracze\nCHANGE COLUMN wiek lata INTEGER;' },

        { type: 'heading', content: 'Zmiana nazwy tabeli — RENAME' },
        { type: 'text', content: 'Pozwala zmienić nazwę całej tabeli. Dane i struktura pozostają bez zmian.' },
        { type: 'code', label: 'Zmiana nazwy tabeli:', content: 'ALTER TABLE gracze\nRENAME TO zawodnicy;' },

        { type: 'heading', content: 'Podsumowanie operacji ALTER TABLE' },
        { type: 'table', label: 'Dostępne operacje:', columns: ['Operacja', 'Składnia MySQL'], rows: [['Dodaj kolumnę', 'ALTER TABLE tabela ADD COLUMN nazwa typ'], ['Usuń kolumnę', 'ALTER TABLE tabela DROP COLUMN nazwa'], ['Zmień typ kolumny', 'ALTER TABLE tabela MODIFY COLUMN nazwa nowy_typ'], ['Zmień nazwę kolumny', 'ALTER TABLE tabela CHANGE COLUMN stara nowa typ'], ['Zmień nazwę tabeli', 'ALTER TABLE tabela RENAME TO nowa_nazwa']] },

        { type: 'heading', content: 'Dodawanie kluczy i ograniczeń' },
        { type: 'text', content: 'ALTER TABLE pozwala też dodawać klucze obce i inne ograniczenia do istniejącej tabeli.' },
        { type: 'code', label: 'Dodawanie klucza obcego:', content: '-- Dodaje klucz obcy do kolumny druzyna_id:\nALTER TABLE gracze\nADD FOREIGN KEY (druzyna_id) REFERENCES druzyny(id);' },
        { type: 'hint', content: 'Możesz wykonać wiele operacji ALTER TABLE w jednym zapytaniu, oddzielając je przecinkami.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Klucz główny — PRIMARY KEY AUTO_INCREMENT' },
        { name: 'imie', type: 'VARCHAR(100)', desc: 'Imię gracza' },
        { name: 'wiek', type: 'INTEGER', desc: 'Wiek gracza — kolumna do dodania/modyfikacji' },
        { name: 'email', type: 'VARCHAR(255)', desc: 'Adres e-mail — kolumna UNIQUE' },
      ],
    },
    exercises: [
      { id: 1, task: 'Dodaj kolumnę wiek (INTEGER) do tabeli gracze.', placeholder: '', hint: 'Składnia: ALTER TABLE gracze ADD COLUMN wiek INTEGER', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Dodaj kolumnę aktywny (BOOLEAN) z domyślną wartością TRUE do tabeli gracze.', placeholder: '', hint: 'Dodaj DEFAULT TRUE na końcu definicji kolumny.', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Zmień nazwę kolumny wiek na lata w tabeli gracze.', placeholder: '', hint: 'Użyj CHANGE COLUMN: ALTER TABLE gracze CHANGE COLUMN wiek lata INTEGER', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Usuń kolumnę lata z tabeli gracze.', placeholder: '', hint: 'Składnia: ALTER TABLE gracze DROP COLUMN lata', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Zmień typ kolumny aktywny na INTEGER w tabeli gracze.', placeholder: '', hint: 'Użyj MODIFY COLUMN: ALTER TABLE gracze MODIFY COLUMN aktywny INTEGER', expectedColumns: [], expectedRows: [] },
      { id: 6, task: 'Zmień nazwę tabeli gracze na zawodnicy.', placeholder: '', hint: 'Składnia: ALTER TABLE gracze RENAME TO zawodnicy', expectedColumns: [], expectedRows: [] },
      { id: 7, task: 'Dodaj kolumnę druzyna_id (INTEGER) do tabeli zawodnicy, a następnie dodaj klucz obcy do tabeli druzyny.', placeholder: '', hint: 'Najpierw: ALTER TABLE zawodnicy ADD COLUMN druzyna_id INTEGER. Potem: ALTER TABLE zawodnicy ADD FOREIGN KEY (druzyna_id) REFERENCES druzyny(id)', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 3,
    title: 'Atrybuty kolumn',
    subtitle: 'PRIMARY KEY, NOT NULL, AUTO_INCREMENT, UNIQUE, CHECK',
    level: 'beginner',
    theory: {
      keywords: ['PRIMARY KEY', 'NOT NULL', 'AUTO_INCREMENT', 'UNIQUE', 'DEFAULT', 'CHECK'],
      sections: [
        { type: 'heading', content: 'Czym są atrybuty kolumn?' },
        { type: 'text', content: 'Atrybuty kolumn (ograniczenia lub constraints) to zasady, które baza danych pilnuje przy dodawaniu i modyfikowaniu danych. Definiują co jest dozwolone w danej kolumnie.' },

        { type: 'heading', content: 'PRIMARY KEY — klucz główny' },
        { type: 'text', content: 'PRIMARY KEY to unikalny identyfikator każdego wiersza w tabeli. Każda wartość w tej kolumnie musi być unikalna i nie może być NULL. Zazwyczaj jest to kolumna o nazwie id.' },
        { type: 'code', label: 'Przykład PRIMARY KEY:', content: 'CREATE TABLE gracze (\n    id  INTEGER PRIMARY KEY AUTO_INCREMENT,\n    imie VARCHAR(100) NOT NULL\n);' },
        { type: 'hint', content: 'Tabela może mieć tylko jeden klucz główny. Klucz główny automatycznie tworzy indeks, co przyspiesza wyszukiwanie.' },

        { type: 'heading', content: 'NOT NULL — wymagana wartość' },
        { type: 'text', content: 'NOT NULL oznacza, że kolumna musi mieć wartość — nie może być pusta (NULL). Próba dodania wiersza bez tej wartości zakończy się błędem.' },
        { type: 'code', label: 'Przykład NOT NULL:', content: 'CREATE TABLE klienci (\n    id       INTEGER PRIMARY KEY,\n    imie     VARCHAR(100) NOT NULL,\n    nazwisko VARCHAR(100) NOT NULL,\n    email    VARCHAR(255)  -- bez NOT NULL, może być NULL\n);' },
        { type: 'hint', content: 'NOT NULL jest używany dla obowiązkowych pól, takich jak imię, nazwisko, adres email kluczowe dla danej encji.' },

        { type: 'heading', content: 'AUTO_INCREMENT — automatyczna numeracja' },
        { type: 'text', content: 'AUTO_INCREMENT automatycznie nadaje kolejną liczbową wartość do kolumny przy każdym nowym wierszu. Działa tylko z typami całkowitymi (INT, INTEGER) i zazwyczaj jest używany z PRIMARY KEY.' },
        { type: 'code', label: 'Przykład AUTO_INCREMENT:', content: 'CREATE TABLE produkty (\n    id    INTEGER PRIMARY KEY AUTO_INCREMENT,\n    nazwa VARCHAR(100) NOT NULL\n);\n\n-- Przy INSERT pomijasz kolumnę id:\nINSERT INTO produkty (nazwa) VALUES (\'Piłka\');  -- id = 1\nINSERT INTO produkty (nazwa) VALUES (\'Buty\');   -- id = 2' },
        { type: 'hint', content: 'Kolumnę z AUTO_INCREMENT pomijasz w INSERT — baza sama nadaje kolejny numer.' },

        { type: 'heading', content: 'UNIQUE — unikalne wartości' },
        { type: 'text', content: 'UNIQUE wymaga, aby każda wartość w kolumnie była unikalna. W przeciwieństwie do PRIMARY KEY, tabela może mieć wiele kolumn UNIQUE i mogą przyjmować NULL (zazwyczaj jeden NULL jest dozwolony).' },
        { type: 'code', label: 'Przykład UNIQUE:', content: 'CREATE TABLE uzytkownicy (\n    id       INTEGER PRIMARY KEY AUTO_INCREMENT,\n    email    VARCHAR(255) UNIQUE,  -- każdy e-mail musi być unikalny\n    telefon  VARCHAR(20)  UNIQUE   -- każdy telefon musi być unikalny\n);' },
        { type: 'hint', content: 'UNIQUE jest idealny dla pól takich jak email, pesel, nip, telefon, które muszą być unikalne.' },

        { type: 'heading', content: 'DEFAULT — wartość domyślna' },
        { type: 'text', content: 'DEFAULT określa wartość, która zostanie wstawiona automatycznie, jeśli nie podasz innej przy INSERT.' },
        { type: 'code', label: 'Przykład DEFAULT:', content: 'CREATE TABLE produkty (\n    id       INTEGER PRIMARY KEY AUTO_INCREMENT,\n    nazwa    VARCHAR(100) NOT NULL,\n    cena     DECIMAL(10,2) DEFAULT 0.00,\n    aktywny  BOOLEAN DEFAULT TRUE\n);\n\n-- Cena nie podana — wstawi 0.00:\nINSERT INTO produkty (nazwa) VALUES (\'Produkt\');' },

        { type: 'heading', content: 'CHECK — warunek walidacji' },
        { type: 'text', content: 'CHECK definiuje warunek, który musi być spełniony przez wartość w kolumnie. Jeśli warunek nie zostanie spełniony, baza zwróci błąd.' },
        { type: 'code', label: 'Przykład CHECK:', content: 'CREATE TABLE pracownicy (\n    id       INTEGER PRIMARY KEY AUTO_INCREMENT,\n    imie     VARCHAR(100) NOT NULL,\n    wiek     INTEGER CHECK (wiek >= 18),\n    pensja   DECIMAL(10,2) CHECK (pensja > 0)\n);\n\n-- Próba dodania pracownika poniżej 18 lat zakończy się błędem' },
        { type: 'hint', content: 'CHECK służy do walidacji danych — np. wiek >= 18, cena > 0, data >= CURRENT_DATE.' },

        { type: 'heading', content: 'Podsumowanie atrybutów' },
        { type: 'table', label: 'Porównanie atrybutów:', columns: ['Atrybut', 'Zastosowanie', 'Czy może być NULL?'], rows: [['PRIMARY KEY', 'Unikalny identyfikator wiersza', 'NIE'], ['UNIQUE', 'Unikalna wartość (np. email)', 'TAK (zazwyczaj 1 NULL)'], ['NOT NULL', 'Wymagana wartość', 'NIE'], ['DEFAULT', 'Wartość domyślna', 'TAK (jeśli nie podano innej)'], ['CHECK', 'Walidacja warunku', 'TAK (jeśli spełniony)']] },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'PRIMARY KEY AUTO_INCREMENT — unikalne ID' },
        { name: 'email', type: 'VARCHAR(255)', desc: 'UNIQUE — unikalny e-mail' },
        { name: 'imie', type: 'VARCHAR(100)', desc: 'NOT NULL — wymagane pole' },
        { name: 'wiek', type: 'INTEGER', desc: 'CHECK (wiek >= 18) — walidacja' },
        { name: 'aktywny', type: 'BOOLEAN', desc: 'DEFAULT TRUE — wartość domyślna' },
      ],
    },
    exercises: [
      { id: 1, task: 'Utwórz tabelę klienci z kolumnami: id (INTEGER, PRIMARY KEY, AUTO_INCREMENT), email (VARCHAR(255), UNIQUE), imie (VARCHAR(100), NOT NULL).', placeholder: '', hint: 'Użyj PRIMARY KEY AUTO_INCREMENT dla id, UNIQUE dla email, NOT NULL dla imie.', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Utwórz tabelę produkty z kolumnami: id (INTEGER, PRIMARY KEY), nazwa (VARCHAR(100), NOT NULL), cena (DECIMAL(10,2), DEFAULT 0.00).', placeholder: '', hint: 'Użyj DEFAULT 0.00 dla kolumny cena.', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Utwórz tabelę pracownicy z kolumną wiek (INTEGER) z ograniczeniem CHECK, że wiek musi być co najmniej 18 lat.', placeholder: '', hint: 'Użyj CHECK (wiek >= 18) po typie kolumny.', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Utwórz tabelę uzytkownicy z kolumnami: id (INTEGER, PRIMARY KEY, AUTO_INCREMENT), username (VARCHAR(50), UNIQUE, NOT NULL), aktywny (BOOLEAN, DEFAULT TRUE).', placeholder: '', hint: 'Możesz łączyć atrybuty: VARCHAR(50) UNIQUE NOT NULL.', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Utwórz tabelę zamowienia z kolumną ilosc (INTEGER) z ograniczeniem CHECK, że ilość musi być większa od 0.', placeholder: '', hint: 'Użyj CHECK (ilosc > 0).', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 4,
    title: 'Język DML — INSERT, UPDATE, DELETE',
    subtitle: 'Manipulowanie danymi w tabelach',
    level: 'beginner',
    theory: {
      keywords: ['INSERT', 'UPDATE', 'DELETE', 'WHERE', 'SET', 'VALUES'],
      sections: [
        { type: 'heading', content: 'Czym jest DML?' },
        { type: 'text', content: 'DML (Data Manipulation Language) to część SQL służąca do manipulowania danymi w tabelach. Obejmuje trzy główne polecenia: INSERT (dodawanie), UPDATE (zmiana) i DELETE (usuwanie).' },

        { type: 'heading', content: 'INSERT — dodawanie danych' },
        { type: 'text', content: 'INSERT INTO dodaje nowy wiersz (rekord) do tabeli. Podajesz nazwę tabeli, listę kolumn i odpowiadające im wartości.' },
        { type: 'code', label: 'Składnia INSERT:', content: 'INSERT INTO nazwa_tabeli (kolumna1, kolumna2)\nVALUES (\'wartość1\', \'wartość2\');' },
        { type: 'code', label: 'Przykład:', content: "INSERT INTO gracze (imie, nazwisko, pozycja)\nVALUES ('Robert', 'Lewandowski', 'napastnik');" },
        { type: 'code', label: 'Wiele wierszy naraz:', content: "INSERT INTO gracze (imie, pozycja)\nVALUES\n    ('Robert', 'napastnik'),\n    ('Kevin',  'pomocnik'),\n    ('Anna',   'bramkarz');" },
        { type: 'hint', content: "Wartości tekstowe wpisuj w apostrofach: 'Robert'. Liczby wpisuj bez apostrofów: 42." },

        { type: 'heading', content: 'UPDATE — modyfikowanie danych' },
        { type: 'text', content: 'UPDATE zmienia wartości w istniejących wierszach. Wskazujesz które kolumny zmienić (SET) i które wiersze (WHERE). BEZ WHERE zmienią się WSZYSTKIE wiersze!' },
        { type: 'code', label: 'Składnia UPDATE:', content: 'UPDATE nazwa_tabeli\nSET kolumna = \'nowa_wartość\'\nWHERE warunek;' },
        { type: 'code', label: 'Przykład:', content: "UPDATE gracze\nSET pozycja = 'obrońca'\nWHERE id = 3;" },
        { type: 'code', label: 'Zmiana wielu kolumn:', content: "UPDATE gracze\nSET imie = 'Jan',\n    pozycja = 'pomocnik'\nWHERE id = 5;" },
        { type: 'code', label: 'Zwiększanie wartości:', content: '-- Zwiększ wartość o 10:\nUPDATE gracze\nSET wartosc_rynkowa = wartosc_rynkowa + 10\nWHERE id = 1;' },
        { type: 'hint', content: 'Zawsze sprawdź najpierw SELECTem, które wiersze dotkniesz: SELECT * FROM gracze WHERE twoj_warunek. Dopiero potem uruchom UPDATE.' },

        { type: 'heading', content: 'DELETE — usuwanie danych' },
        { type: 'text', content: 'DELETE usuwa wybrane wiersze z tabeli. Tabela pozostaje — znikają tylko dane pasujące do warunku WHERE. BEZ WHERE usuniesz WSZYSTKIE wiersze!' },
        { type: 'code', label: 'Składnia DELETE:', content: 'DELETE FROM nazwa_tabeli\nWHERE warunek;' },
        { type: 'code', label: 'Przykłady:', content: "-- Usuwa jednego gracza:\nDELETE FROM gracze\nWHERE id = 5;\n\n-- Usuwa wielu graczy:\nDELETE FROM gracze\nWHERE pozycja = 'bramkarz';\n\n-- Usuwa wszystkich (!) - UWAGA:\nDELETE FROM gracze;" },
        { type: 'hint', content: 'DELETE usuwa dane, ale nie strukturę tabeli. Do usuwania całej tabeli użyj DROP TABLE.' },

        { type: 'heading', content: 'Porównanie INSERT, UPDATE, DELETE' },
        { type: 'table', label: 'Polecenia DML:', columns: ['Polecenie', 'Co robi', 'Uwaga'], rows: [['INSERT INTO', 'Dodaje nowe wiersze', 'Użyj VALUES dla danych'], ['UPDATE', 'Zmienia istniejące dane', 'ZAWSZE użyj WHERE'], ['DELETE FROM', 'Usuwa wiersze', 'ZAWSZE użyj WHERE']] },

        { type: 'heading', content: 'NULL — brak wartości' },
        { type: 'text', content: 'NULL oznacza brak wartości. W WHERE używa się IS NULL lub IS NOT NULL, a nie = ani !=.' },
        { type: 'code', label: 'Praca z NULL:', content: "-- Gracze bez pozycji:\nSELECT * FROM gracze WHERE pozycja IS NULL;\n\n-- Usuń graczy bez pozycji:\nDELETE FROM gracze WHERE pozycja IS NULL;\n\n-- Ustaw wartość dla graczy bez pozycji:\nUPDATE gracze SET pozycja = 'rezerwowy' WHERE pozycja IS NULL;" },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator' },
        { name: 'imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'nazwisko', type: 'VARCHAR', desc: 'Nazwisko gracza' },
        { name: 'pozycja', type: 'VARCHAR', desc: 'Pozycja na boisku (może być NULL)' },
        { name: 'wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
      ],
    },
    exercises: [
      { id: 1, task: "Dodaj gracza o imieniu Robert i pozycji napastnik do tabeli gracze.", placeholder: '', hint: "INSERT INTO gracze (imie, pozycja) VALUES ('Robert', 'napastnik')", expectedColumns: [], expectedRows: [] },
      { id: 2, task: "Dodaj dwóch graczy jednym zapytaniem INSERT — Kevin (pomocnik) i Marek (obrońca).", placeholder: '', hint: 'Wiele rekordów oddzielaj przecinkami: VALUES (...), (...)', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Zmień pozycję gracza o id = 3 na pomocnik.', placeholder: '', hint: "UPDATE gracze SET pozycja = 'pomocnik' WHERE id = 3", expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Zwiększ wartość rynkową gracza o id = 1 o 10 milionów.', placeholder: '', hint: 'Użyj: SET wartosc_rynkowa = wartosc_rynkowa + 10', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Ustaw wartość rynkową na 0 dla wszystkich graczy bez przypisanej pozycji (IS NULL).', placeholder: '', hint: 'UPDATE gracze SET wartosc_rynkowa = 0 WHERE pozycja IS NULL', expectedColumns: [], expectedRows: [] },
      { id: 6, task: 'Usuń gracza o id = 5 z tabeli gracze.', placeholder: '', hint: 'DELETE FROM gracze WHERE id = 5 — ZAWSZE używaj WHERE!', expectedColumns: [], expectedRows: [] },
      { id: 7, task: "Usuń wszystkich graczy, których pozycja to 'bramkarz'.", placeholder: '', hint: "DELETE FROM gracze WHERE pozycja = 'bramkarz'", expectedColumns: [], expectedRows: [] },
      { id: 8, task: 'Zmień imię i pozycję gracza o id = 10 jednym zapytaniem UPDATE.', placeholder: '', hint: 'Oddziel kolumny przecinkami: SET imie = ..., pozycja = ...', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 5,
    title: 'SELECT — podstawy',
    subtitle: 'Pobieranie i filtrowanie danych z tabel',
    level: 'beginner',
    theory: {
      keywords: ['SELECT', 'FROM', 'WHERE', '*', 'ORDER BY'],
      sections: [
        { type: 'heading', content: 'Czym jest SELECT?' },
        { type: 'text', content: 'SELECT to podstawowe polecenie SQL służące do pobierania danych z tabeli. Możesz wybrać wszystkie kolumny (SELECT *) lub wypisać tylko te, które cię interesują.' },
        { type: 'code', label: 'Podstawowa składnia:', content: '-- Wszystkie kolumny:\nSELECT * FROM nazwa_tabeli;\n\n-- Wybrane kolumny:\nSELECT kolumna1, kolumna2 FROM nazwa_tabeli;' },

        { type: 'heading', content: 'Filtrowanie wyników — WHERE' },
        { type: 'text', content: 'Klauzula WHERE pozwala wybrać tylko te wiersze, które spełniają podany warunek. Bez WHERE SELECT zwraca wszystkie wiersze z tabeli.' },
        { type: 'code', label: 'Przykłady z WHERE:', content: "-- Tylko napastnicy:\nSELECT imie, nazwisko\nFROM gracze\nWHERE pozycja = 'napastnik';\n\n-- Gracze o wartości powyżej 50 mln:\nSELECT imie, wartosc_rynkowa\nFROM gracze\nWHERE wartosc_rynkowa > 50;" },

        { type: 'heading', content: 'Operatory porównania w WHERE' },
        { type: 'table', label: 'Dostępne operatory:', columns: ['Operator', 'Znaczenie', 'Przykład'], rows: [['=', 'Równa się', "pozycja = 'napastnik'"], ['!= lub <>', 'Różne od', 'wartosc_rynkowa != 0'], ['>', 'Większe niż', 'wartosc_rynkowa > 50'], ['<', 'Mniejsze niż', 'wiek < 30'], ['>=', 'Większe lub równe', 'bramki >= 10'], ['<=', 'Mniejsze lub równe', 'wiek <= 25']] },

        { type: 'heading', content: 'Sortowanie wyników — ORDER BY' },
        { type: 'text', content: 'ORDER BY sortuje wyniki zapytania według wybranej kolumny. Domyślnie sortuje rosnąco (ASC). Możesz zmienić kierunek na malejący (DESC).' },
        { type: 'code', label: 'Przykład ORDER BY:', content: '-- Od najdroższego:\nSELECT imie, wartosc_rynkowa\nFROM gracze\nORDER BY wartosc_rynkowa DESC;\n\n-- Alfabetycznie po nazwisku:\nSELECT imie, nazwisko\nFROM gracze\nORDER BY nazwisko ASC;' },

        { type: 'heading', content: 'Operatory logiczne — AND, OR' },
        { type: 'text', content: 'AND i OR pozwalają łączyć wiele warunków. AND wymaga spełnienia obu warunków, OR — przynajmniej jednego.' },
        { type: 'code', label: 'Przykład AND/OR:', content: "-- Napastnicy z wartością powyżej 40 mln:\nSELECT * FROM gracze\nWHERE pozycja = 'napastnik' AND wartosc_rynkowa > 40;" },

        { type: 'hint', content: 'Używaj SELECT * tylko gdy naprawdę potrzebujesz wszystkich kolumn. Wypisanie konkretnych kolumn jest szybsze i czytelniejsze.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator gracza' },
        { name: 'imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'nazwisko', type: 'VARCHAR', desc: 'Nazwisko gracza' },
        { name: 'narodowosc', type: 'VARCHAR', desc: 'Narodowość gracza' },
        { name: 'pozycja', type: 'VARCHAR', desc: 'Pozycja na boisku' },
        { name: 'wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
      ],
    },
    exercises: [
      { id: 1, task: 'Wyświetl imiona i nazwiska wszystkich graczy.', placeholder: '', hint: 'SELECT imie, nazwisko FROM gracze', expectedColumns: ['imie', 'nazwisko'], expectedRows: [] },
      { id: 2, task: 'Wyświetl wszystkich graczy, których pozycja to "napastnik".', placeholder: '', hint: "SELECT * FROM gracze WHERE pozycja = 'napastnik'", expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Wyświetl imię, nazwisko i wartość rynkową graczy z wartością powyżej 50 milionów.', placeholder: '', hint: 'Użyj operatora > w WHERE.', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Wyświetl wszystkich graczy z narodowością "Polska".', placeholder: '', hint: "WHERE narodowosc = 'Polska'", expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Wyświetl imię i wartość rynkową graczy posortowanych malejąco po wartości.', placeholder: '', hint: 'ORDER BY wartosc_rynkowa DESC', expectedColumns: [], expectedRows: [] },
      { id: 6, task: 'Wyświetl graczy, którzy są napastnikami ORAZ mają wartość powyżej 40 milionów.', placeholder: '', hint: 'Użyj AND do połączenia warunków.', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 6,
    title: 'GROUP BY, HAVING, ORDER BY, DISTINCT, TOP',
    subtitle: 'Sortowanie, grupowanie i ograniczanie wyników',
    level: 'intermediate',
    theory: {
      keywords: ['GROUP BY', 'HAVING', 'ORDER BY', 'DISTINCT', 'TOP', 'ASC', 'DESC'],
      sections: [
        { type: 'heading', content: 'Grupowanie danych — GROUP BY' },
        { type: 'text', content: 'GROUP BY grupuje wiersze, które mają tę samą wartość w wybranej kolumnie. Używa się go razem z funkcjami agregującymi (COUNT, SUM, AVG, MAX, MIN) — np. żeby policzyć ilu graczy jest na każdej pozycji.' },
        { type: 'code', label: 'Przykład GROUP BY:', content: "-- Ile graczy gra na każdej pozycji?\nSELECT pozycja, COUNT(*) AS liczba\nFROM gracze\nGROUP BY pozycija;\n\n-- Średnia wartość na każdej pozycji:\nSELECT pozycja, AVG(wartosc_rynkowa) AS srednia\nFROM gracze\nGROUP BY pozycja;" },

        { type: 'heading', content: 'Filtrowanie grup — HAVING' },
        { type: 'text', content: 'HAVING działa jak WHERE, ale dla grup — filtruje wyniki po wykonaniu GROUP BY. WHERE filtruje wiersze przed grupowaniem, HAVING filtruje grupy po grupowaniu.' },
        { type: 'code', label: 'Przykład HAVING:', content: "-- Pokaż tylko pozycje, na których gra więcej niż 2 graczy:\nSELECT pozycja, COUNT(*) AS liczba\nFROM gracze\nGROUP BY pozycja\nHAVING COUNT(*) > 2;" },

        { type: 'heading', content: 'Sortowanie wyników — ORDER BY' },
        { type: 'text', content: 'ORDER BY sortuje wyniki zapytania według wybranej kolumny. Domyślnie sortuje rosnąco (ASC). Możesz zmienić kierunek na malejący (DESC).' },
        { type: 'table', label: 'Kierunki sortowania:', columns: ['Słowo', 'Znaczenie', 'Przykład'], rows: [['ASC', 'Rosnąco (domyślne)', 'ORDER BY wartosc_rynkowa ASC'], ['DESC', 'Malejąco', 'ORDER BY wartosc_rynkowa DESC']] },
        { type: 'code', label: 'Przykład ORDER BY:', content: '-- Od najdroższego:\nSELECT imie, wartosc_rynkowa\nFROM gracze\nORDER BY wartosc_rynkowa DESC;\n\n-- Alfabetycznie po nazwisku:\nSELECT imie, nazwisko\nFROM gracze\nORDER BY nazwisko ASC;' },

        { type: 'heading', content: 'Unikalne wartości — DISTINCT' },
        { type: 'text', content: 'DISTINCT usuwa duplikaty z wyników — wyświetla każdą unikalną wartość tylko raz.' },
        { type: 'code', label: 'Przykład DISTINCT:', content: "-- Jakie pozycje istnieją w tabeli? (bez powtórzeń)\nSELECT DISTINCT pozycja FROM gracze;" },

        { type: 'heading', content: 'Ograniczanie wyników — TOP / LIMIT' },
        { type: 'text', content: 'TOP (SQL Server) lub LIMIT (MySQL) zwraca tylko określoną liczbę wierszy z wyników.' },
        { type: 'code', label: 'Przykład TOP/LIMIT:', content: "-- SQL Server - TOP 5:\nSELECT TOP 5 * FROM gracze;\n\n-- MySQL - LIMIT:\nSELECT * FROM gracze LIMIT 5;\n\n-- Tylko 5 najdroższych:\nSELECT * FROM gracze\nORDER BY wartosc_rynkowa DESC\nLIMIT 5;" },

        { type: 'table', label: 'Porównanie WHERE vs HAVING:', columns: ['Klauzula', 'Kiedy działa', 'Co filtruje'], rows: [['WHERE', 'Przed GROUP BY', 'Filtry wiersze przed grupowaniem'], ['HAVING', 'Po GROUP BY', 'Filtry grupy po agregacji']] },
        { type: 'hint', content: 'Kolejność klauzul w zapytaniu: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → TOP/LIMIT.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator' },
        { name: 'imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'pozycja', type: 'VARCHAR', desc: 'Pozycja na boisku' },
        { name: 'wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
      ],
    },
    exercises: [
      { id: 1, task: 'Wyświetl imię i wartość rynkową graczy posortowanych malejąco po wartości.', placeholder: '', hint: 'ORDER BY wartosc_rynkowa DESC', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Policz ilu graczy gra na każdej pozycji (użyj GROUP BY).', placeholder: '', hint: 'GROUP BY pozycja razem z COUNT(*)', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Wyświetl pozycje, na których gra więcej niż 1 gracz (użyj HAVING).', placeholder: '', hint: 'HAVING COUNT(*) > 1 po GROUP BY pozycja', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Wyświetl unikalne pozycje w tabeli gracze (użyj DISTINCT).', placeholder: '', hint: 'SELECT DISTINCT pozycja FROM gracze', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Wyświetl tylko 5 najdroższych graczy (użyj ORDER BY i LIMIT/TOP).', placeholder: '', hint: 'ORDER BY wartosc_rynkowa DESC LIMIT 5', expectedColumns: [], expectedRows: [] },
      { id: 6, task: 'Policz ile graczy ma tę samą wartość rynkową (GROUP BY wartosc_rynkowa).', placeholder: '', hint: 'GROUP BY wartosc_rynkowa z COUNT(*)', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 7,
    title: 'Łączenie tabel — JOIN',
    subtitle: 'INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN',
    level: 'intermediate',
    theory: {
      keywords: ['JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'ON'],
      sections: [
        { type: 'heading', content: 'Czym jest JOIN?' },
        { type: 'text', content: 'JOIN łączy dane z dwóch lub więcej tabel w jedno zapytanie. Tabele łączymy na podstawie wspólnej kolumny — najczęściej klucza obcego (np. druzyna_id w tabeli gracze) z kluczem głównym (id w tabeli druzyny).' },
        { type: 'table', label: 'Przykładowe tabele:', columns: ['gracze: id', 'gracze: imie', 'gracze: druzyna_id'], rows: [['1', 'Robert', '10'], ['2', 'Kevin', '20'], ['3', 'Anna', 'NULL']] },
        { type: 'table', label: '', columns: ['druzyny: id', 'druzyny: nazwa', 'druzyny: kraj'], rows: [['10', 'Bayern Monachium', 'Niemcy'], ['20', 'Manchester City', 'Anglia']] },

        { type: 'heading', content: 'INNER JOIN' },
        { type: 'text', content: 'INNER JOIN zwraca tylko te wiersze, które mają dopasowanie w obu tabelach. Wiersze bez dopasowania (np. Anna bez druzyna_id) są pomijane.' },
        { type: 'code', label: 'INNER JOIN — tylko pasujące wiersze:', content: "SELECT g.imie, d.nazwa\nFROM gracze g\nINNER JOIN druzyny d ON g.druzyna_id = d.id;\n\n-- Wynik: Robert (Bayern), Kevin (Man City)\n-- Anna znika — nie ma drużyny" },

        { type: 'heading', content: 'LEFT JOIN' },
        { type: 'text', content: 'LEFT JOIN zwraca wszystkie wiersze z lewej tabeli (FROM), nawet jeśli nie mają dopasowania w prawej. Brakujące wartości z prawej tabeli przyjmują NULL.' },
        { type: 'code', label: 'LEFT JOIN — wszyscy gracze, nawet bez drużyny:', content: "SELECT g.imie, d.nazwa\nFROM gracze g\nLEFT JOIN druzyny d ON g.druzyna_id = d.id;\n\n-- Wynik: Robert (Bayern), Kevin (Man City), Anna (NULL)" },

        { type: 'heading', content: 'RIGHT JOIN i FULL JOIN' },
        { type: 'text', content: 'RIGHT JOIN zwraca wszystkie wiersze z prawej tabeli — nawet drużyny bez żadnego gracza. FULL JOIN łączy obie strony — zwraca wszystko z obu tabel, wstawiając NULL tam gdzie brak dopasowania.' },
        { type: 'table', label: 'Porównanie typów JOIN:', columns: ['Typ JOIN', 'Co zwraca'], rows: [['INNER JOIN', 'Tylko wiersze z dopasowaniem w obu tabelach'], ['LEFT JOIN', 'Wszystkie z lewej + pasujące z prawej (NULL gdzie brak)'], ['RIGHT JOIN', 'Wszystkie z prawej + pasujące z lewej (NULL gdzie brak)'], ['FULL JOIN', 'Wszystkie wiersze z obu tabel (NULL gdzie brak dopasowania)']] },

        { type: 'heading', content: 'Alias tabel' },
        { type: 'text', content: 'Alias tabeli (np. g dla gracze, d dla druzyny) skraca zapis i czyni kod czytelniejszym. Zamiast gracze.imie piszesz g.imie.' },
        { type: 'code', label: 'Przykład z aliasami:', content: "SELECT g.imie, d.nazwa\nFROM gracze AS g\nLEFT JOIN druzyny AS d ON g.druzyna_id = d.id;" },

        { type: 'hint', content: 'Przy JOIN zawsze używaj aliasów tabel — ułatwiają czytanie i unikają niejasności, gdy tabele mają kolumny o tej samej nazwie.' },
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
      { id: 1, task: 'Wyświetl imię gracza i nazwę jego drużyny używając INNER JOIN.', placeholder: '', hint: 'Warunek łączenia: ON g.druzyna_id = d.id', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Wyświetl wszystkich graczy i ich drużyny — uwzględnij też graczy bez drużyny (LEFT JOIN).', placeholder: '', hint: 'LEFT JOIN zwróci NULL w kolumnie drużyny dla graczy bez druzyna_id.', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Wyświetl nazwy drużyn i liczbę graczy w każdej drużynie (użyj JOIN i GROUP BY).', placeholder: '', hint: 'Połącz INNER JOIN z GROUP BY d.nazwa i COUNT(g.id).', expectedColumns: [], expectedRows: [] },
      { id: 4, task: "Wyświetl imiona graczy i nazwy drużyn, ale tylko dla drużyn z kraju 'Niemcy'.", placeholder: '', hint: "Dodaj WHERE d.kraj = 'Niemcy' na końcu zapytania z JOIN.", expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Wyświetl wszystkich graczy i ich drużyny używając aliasów tabel (g dla gracze, d dla druzyny).', placeholder: '', hint: 'Użyj AS po nazwie tabeli: FROM gracze AS g JOIN druzyny AS d', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 8,
    title: 'Więzy integralności — klucz obcy',
    subtitle: 'Relacje między tabelami, CASCADE, SET NULL, SET DEFAULT',
    level: 'intermediate',
    theory: {
      keywords: ['FOREIGN KEY', 'REFERENCES', 'CASCADE', 'SET NULL', 'SET DEFAULT', 'RESTRICT', 'ON DELETE', 'ON UPDATE'],
      sections: [
        { type: 'heading', content: 'Czym jest klucz obcy?' },
        { type: 'text', content: 'Klucz obcy (FOREIGN KEY) tworzy relację między tabelami. Wskazuje na klucz główny (PRIMARY KEY) w innej tabeli. Dzięki temu baza danych wie, że dane w tabelach są ze sobą powiązane.' },
        { type: 'code', label: 'Tworzenie klucza obcego:', content: 'CREATE TABLE gracze (\n    id         INTEGER PRIMARY KEY AUTO_INCREMENT,\n    imie       VARCHAR(100) NOT NULL,\n    druzyna_id INTEGER,\n    FOREIGN KEY (druzyna_id) REFERENCES druzyny(id)\n);' },
        { type: 'hint', content: 'Klucz obcy może przyjmować NULL — oznacza to, że gracz nie jest przypisany do żadnej drużyny.' },

        { type: 'heading', content: 'Akcje kaskadowe — ON DELETE, ON UPDATE' },
        { type: 'text', content: 'Gdy zmienisz lub usuniesz dane w tabeli głównej (np. druzyny), baza może automatycznie zaktualizować lub usunąć powiązane dane w tabeli podrzędnej (gracze).' },
        { type: 'table', label: 'Dostępne akcje:', columns: ['Akcja', 'Co się dzieje'], rows: [['CASCADE', 'Usunie/zmieni wszystkie powiązane wiersze'], ['SET NULL', 'Wstawi NULL w kolumnie klucza obcego'], ['SET DEFAULT', 'Wstawi wartość domyślną'], ['RESTRICT/NO ACTION', 'Blokuje operację jeśli są powiązane dane']] },
        { type: 'code', label: 'Przykład kaskady:', content: 'CREATE TABLE gracze (\n    id         INTEGER PRIMARY KEY AUTO_INCREMENT,\n    imie       VARCHAR(100) NOT NULL,\n    druzyna_id INTEGER,\n    FOREIGN KEY (druzyna_id) REFERENCES druzyny(id)\n        ON DELETE CASCADE\n        ON UPDATE CASCADE\n);' },

        { type: 'heading', content: 'CASCADE — usuwanie i aktualizacja kaskadowa' },
        { type: 'text', content: 'CASCADE oznacza, że zmiana w tabeli głównej automatycznie zmienia powiązane dane. Jeśli usuniesz drużynę, usunią się też wszyscy gracze z tej drużyny.' },
        { type: 'code', label: 'Przykład CASCADE:', content: '-- Usunięcie drużyny usuwa też graczy:\nDELETE FROM druzyny WHERE id = 10;\n\n-- Zmiana ID drużyny zmienia u graczy:\nUPDATE druzyny SET id = 100 WHERE id = 10;' },

        { type: 'heading', content: 'SET NULL i SET DEFAULT' },
        { type: 'text', content: 'SET NULL wstawia NULL zamiast usuwać dane — gracze zostaną, ale stracą przypisanie do drużyny. SET DEFAULT wstawia wartość domyślną zdefiniowaną dla kolumny.' },
        { type: 'code', label: 'Przykład SET NULL:', content: 'CREATE TABLE gracze (\n    druzyna_id INTEGER,\n    FOREIGN KEY (druzyna_id) REFERENCES druzyny(id)\n        ON DELETE SET NULL\n);\n\n-- Po usunięciu drużyny gracze mają druzyna_id = NULL' },

        { type: 'heading', content: 'RESTRICT — ochrona przed usunięciem' },
        { type: 'text', content: 'RESTRICT (lub NO ACTION) blokuje usunięcie lub zmianę w tabeli głównej, jeśli są powiązane dane. To domyślna akcja w większości baz.' },
        { type: 'code', label: 'Przykład RESTRICT:', content: '-- Błąd! Nie można usunąć drużyny z graczami:\nDELETE FROM druzyny WHERE id = 10;\n\n-- Najpierw usuń lub zmień graczy, potem drużynę' },

        { type: 'hint', content: 'Używaj CASCADE ostrożnie — łatwo nieświadomie usunąć dużo danych. Rozważ SET NULL jeśli chcesz zachować powiązane wiersze.' },
      ],
      schema: [
        { name: 'gracze.id', type: 'INTEGER', desc: 'PRIMARY KEY AUTO_INCREMENT — ID gracza' },
        { name: 'gracze.imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'gracze.druzyna_id', type: 'INTEGER', desc: 'FOREIGN KEY REFERENCES druzyny(id)' },
        { name: 'druzyny.id', type: 'INTEGER', desc: 'PRIMARY KEY — ID drużyny (tabela nadrzędna)' },
        { name: 'druzyny.nazwa', type: 'VARCHAR', desc: 'Nazwa drużyny' },
      ],
    },
    exercises: [
      { id: 1, task: 'Utwórz tabelę gracze z kluczem obcym druzyna_id wskazującym na druzyny(id).', placeholder: '', hint: 'FOREIGN KEY (druzyna_id) REFERENCES druzyny(id)', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Utwórz tabelę gracze z kluczem obcym, który przy usunięciu drużyny ustawia NULL.', placeholder: '', hint: 'Użyj: ON DELETE SET NULL na końcu definicji FOREIGN KEY.', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Utwórz tabelę mecze z kluczem obcym druzyna_id, który usuwa mecze kaskadowo przy usunięciu drużyny.', placeholder: '', hint: 'Użyj: ON DELETE CASCADE.', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Utwórz tabelę zawodnicy z kluczem obcym, który aktualizuje kaskadowo przy zmianie ID drużyny.', placeholder: '', hint: 'Użyj: ON UPDATE CASCADE.', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Dodaj klucz obcy do istniejącej tabeli gracze na kolumnie druzyna_id.', placeholder: '', hint: 'ALTER TABLE gracze ADD FOREIGN KEY (druzyna_id) REFERENCES druzyny(id)', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 9,
    title: 'Łączenie wyników — UNION, INTERSECT, EXCEPT',
    subtitle: 'Łączenie wielu zapytań w jeden wynik',
    level: 'intermediate',
    theory: {
      keywords: ['UNION', 'UNION ALL', 'INTERSECT', 'EXCEPT', 'MINUS'],
      sections: [
        { type: 'heading', content: 'Czym są operatory łączące?' },
        { type: 'text', content: 'UNION, INTERSECT i EXCEPT łączą wyniki wielu zapytań SELECT w jeden zbiór wyników. Każde zapytanie musi mieć taką samą liczbę kolumn i kompatybilne typy danych.' },
        { type: 'code', label: 'Ogólna składnia:', content: 'SELECT kolumna1, kolumna2 FROM tabela1\nUNION\nSELECT kolumna1, kolumna2 FROM tabela2;' },

        { type: 'heading', content: 'UNION — sumowanie zbiorów' },
        { type: 'text', content: 'UNION łączy wyniki dwóch zapytań, usuwając duplikaty. Zwraca wszystkie unikalne wiersze z obu zapytań.' },
        { type: 'code', label: 'Przykład UNION:', content: '-- Wszystkie nazwiska graczy i trenerów (bez duplikatów):\nSELECT nazwisko FROM gracze\nUNION\nSELECT nazwisko FROM trenerzy;' },

        { type: 'heading', content: 'UNION ALL — sumowanie z duplikatami' },
        { type: 'text', content: 'UNION ALL działa jak UNION, ale NIE usuwa duplikatów. Zwraca wszystkie wiersze, nawet jeśli są identyczne. Jest szybsze niż UNION, bo baza nie musi sprawdzać powtórzeń.' },
        { type: 'code', label: 'Przykład UNION ALL:', content: '-- Liczy wszystkie wystąpienia (z duplikatami):\nSELECT nazwisko FROM gracze\nUNION ALL\nSELECT nazwisko FROM trenerzy;' },
        { type: 'table', label: 'UNION vs UNION ALL:', columns: ['Operator', 'Usuwa duplikaty?', 'Wydajność'], rows: [['UNION', 'TAK', 'Wolniejsze — sprawdza duplikaty'], ['UNION ALL', 'NIE', 'Szybsze — sprawdza duplikaty']] },

        { type: 'heading', content: 'INTERSECT — część wspólna' },
        { type: 'text', content: 'INTERSECT zwraca tylko te wiersze, które występują w OBU zapytaniach — część wspólna zbiorów.' },
        { type: 'code', label: 'Przykład INTERSECT:', content: '-- Nazwiska osób, które są jednocześnie graczami i trenerami:\nSELECT nazwisko FROM gracze\nINTERSECT\nSELECT nazwisko FROM trenerzy;' },

        { type: 'heading', content: 'EXCEPT — różnica zbiorów' },
        { type: 'text', content: 'EXCEPT (w MySQL MINUS) zwraca wiersze z pierwszego zapytania, których NIE ma w drugim zapytaniu. Różnica zbiorów.' },
        { type: 'code', label: 'Przykład EXCEPT:', content: '-- Gracze, którzy nie są trenerami:\nSELECT nazwisko FROM gracze\nEXCEPT\nSELECT nazwisko FROM trenerzy;\n\n-- W MySQL użyj LEFT JOIN...WHERE...IS NULL zamiast EXCEPT' },

        { type: 'heading', content: 'Wymagania dla operatorów łączących' },
        { type: 'table', label: 'Ważne zasady:', columns: ['Wymaganie', 'Opis'], rows: [['Liczba kolumn', 'Oba zapytania muszą mieć tyle samo kolumn'], ['Typy danych', 'Kolumny muszą mieć kompatybilne typy'], ['Kolejność', 'Kolejność kolumn ma znaczenie — 1. kolumna do 1., 2. do 2.']] },
        { type: 'hint', content: 'UNION przydaje się do łączenia danych z podobnych tabel (np. pracownicy i kontrahenci). INTERSECT sprawdza, co jest wspólne. EXCEPT znajduje różnice.' },
      ],
      schema: [
        { name: 'gracze.nazwisko', type: 'VARCHAR', desc: 'Nazwisko gracza' },
        { name: 'gracze.imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'trenerzy.nazwisko', type: 'VARCHAR', desc: 'Nazwisko trenera' },
        { name: 'trenerzy.imie', type: 'VARCHAR', desc: 'Imię trenera' },
      ],
    },
    exercises: [
      { id: 1, task: 'Wyświetl wszystkie unikalne nazwiska z tabel gracze i trenerzy (użyj UNION).', placeholder: '', hint: 'SELECT nazwisko FROM gracze UNION SELECT nazwisko FROM trenerzy', expectedColumns: ['nazwisko'], expectedRows: [] },
      { id: 2, task: 'Wyświetl wszystkie imiona z tabel gracze i trenerzy wraz z duplikatami (użyj UNION ALL).', placeholder: '', hint: 'Użyj UNION ALL zamiast UNION, żeby zachować duplikaty.', expectedColumns: ['imie'], expectedRows: [] },
      { id: 3, task: 'Znajdź nazwiska, które występują jednocześnie w tabeli gracze i trenerzy (użyj INTERSECT).', placeholder: '', hint: 'INTERSECT zwróci tylko wspólne wartości z obu tabel.', expectedColumns: ['nazwisko'], expectedRows: [] },
      { id: 4, task: 'Znajdź nazwiska graczy, którzy NIE są trenerami (użyj EXCEPT).', placeholder: '', hint: 'SELECT nazwisko FROM gracze EXCEPT SELECT nazwisko FROM trenerzy', expectedColumns: ['nazwisko'], expectedRows: [] },
    ],
  },
  {
    id: 10,
    title: 'Podzapytania',
    subtitle: 'SELECT wewnątrz SELECT — EXISTS, IN, ANY, ALL',
    level: 'advanced',
    theory: {
      keywords: ['SUBQUERY', 'EXISTS', 'IN', 'ANY', 'ALL', 'SELECT w SELECT'],
      sections: [
        { type: 'heading', content: 'Czym są podzapytania?' },
        { type: 'text', content: 'Podzapytanie (subquery) to zapytanie SELECT umieszczone wewnątrz innego zapytania. Baza najpierw wykonuje podzapytanie, a jego wynik używa w zapytaniu zewnętrznym.' },
        { type: 'code', label: 'Ogólna składnia:', content: 'SELECT kolumna\nFROM tabela\nWHERE kolumna OPERATOR (\n    SELECT kolumna\n    FROM inna_tabela\n    WHERE warunek\n);' },

        { type: 'heading', content: 'Podzapytanie z IN' },
        { type: 'text', content: 'Podzapytanie zwracające listę wartości można użyć z operatorem IN. Zewnętrzne zapytanie wybierze tylko te wiersze, których wartość jest na liście zwróconej przez podzapytanie.' },
        { type: 'code', label: 'Przykład z IN:', content: "-- Gracze z drużyn z Polski:\nSELECT imie, nazwisko\nFROM gracze\nWHERE druzyna_id IN (\n    SELECT id\n    FROM druzyny\n    WHERE kraj = 'Polska'\n);" },

        { type: 'heading', content: 'Podzapytanie skalarne (jeden wynik)' },
        { type: 'text', content: 'Jeśli podzapytanie zwraca dokładnie jedną wartość (np. MAX lub AVG), możesz go użyć bezpośrednio w warunku porównania.' },
        { type: 'code', label: 'Przykład skalarny:', content: '-- Gracze drożsi od średniej:\nSELECT imie, wartosc_rynkowa\nFROM gracze\nWHERE wartosc_rynkowa > (\n    SELECT AVG(wartosc_rynkowa)\n    FROM gracze\n);\n\n-- Gracz z najwyższą wartością:\nSELECT imie\nFROM gracze\nWHERE wartosc_rynkowa = (\n    SELECT MAX(wartosc_rynkowa)\n    FROM gracze\n);' },

        { type: 'heading', content: 'Podzapytanie z EXISTS' },
        { type: 'text', content: 'EXISTS sprawdza czy podzapytanie zwróciło jakikolwiek wynik. Jeśli tak — warunek jest spełniony. EXISTS jest wydajny, bo baza nie musi pobierać wszystkich wyników.' },
        { type: 'code', label: 'Przykład z EXISTS:', content: '-- Drużyny, które mają przynajmniej jednego gracza:\nSELECT nazwa\nFROM druzyny d\nWHERE EXISTS (\n    SELECT 1\n    FROM gracze g\n    WHERE g.druzyna_id = d.id\n);' },

        { type: 'heading', content: 'Operatory ANY i ALL' },
        { type: 'text', content: 'ANY i ALL służą do porównania z każdym elementem listy zwróconej przez podzapytanie.' },
        { type: 'table', label: 'Operatory:', columns: ['Operator', 'Znaczenie'], rows: [['> ANY', 'Większe niż PRZYNAJMNIJ JEDNA wartość'], ['> ALL', 'Większe niż WSZYSTKIE wartości'], ['= ANY', 'Równoważne z IN'], ['!= ALL', 'Równoważne z NOT IN']] },
        { type: 'code', label: 'Przykłady ANY/ALL:', content: '-- Gracze drożsi niż JAKIŚ inny gracz:\nSELECT imie FROM gracze\nWHERE wartosc_rynkowa > ANY (\n    SELECT wartosc_rynkowa FROM gracze\n);\n\n-- Gracze drożsi niż WSZYSTCY inni (najdroższy):\nSELECT imie FROM gracze\nWHERE wartosc_rynkowa > ALL (\n    SELECT wartosc_rynkowa FROM gracze\n    WHERE id != 1\n);' },

        { type: 'heading', content: 'Podzapytania w klauzuli FROM' },
        { type: 'text', content: 'Podzapytanie może być użyte jako tabela w klauzuli FROM — wtedy nazywamy go "wyprowadzoną tabelą" (derived table).' },
        { type: 'code', label: 'Przykład w FROM:', content: '-- Średnia wartość dla każdej pozycji:\nSELECT srednia_pozycja, AVG(srednia_pozycja)\nFROM (\n    SELECT AVG(wartosc_rynkowa) AS srednia_pozycja\n    FROM gracze\n    GROUP BY pozycja\n) AS srednie;' },

        { type: 'hint', content: 'Zagnieżdżone podzapytania mogą być wolne. Jeśli to możliwe, rozważ zastąpienie ich JOIN.' },
      ],
      schema: [
        { name: 'gracze.id', type: 'INTEGER', desc: 'ID gracza' },
        { name: 'gracze.druzyna_id', type: 'INTEGER', desc: 'Klucz obcy do druzyny' },
        { name: 'gracze.wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
        { name: 'druzyny.id', type: 'INTEGER', desc: 'ID drużyny' },
        { name: 'druzyny.kraj', type: 'VARCHAR', desc: 'Kraj drużyny' },
      ],
    },
    exercises: [
      { id: 1, task: "Wyświetl imiona graczy, którzy należą do drużyn z Polski (użyj podzapytania z IN).", placeholder: '', hint: 'Podzapytanie: SELECT id FROM druzyny WHERE kraj = "Polska"', expectedColumns: ['imie'], expectedRows: [] },
      { id: 2, task: 'Znajdź graczy, których wartość rynkowa jest wyższa niż średnia wszystkich graczy.', placeholder: '', hint: 'Podzapytanie: SELECT AVG(wartosc_rynkowa) FROM gracze', expectedColumns: ['imie', 'wartosc_rynkowa'], expectedRows: [] },
      { id: 3, task: 'Wyświetl imię i nazwisko gracza z najwyższą wartością rynkową (użyj podzapytania z MAX).', placeholder: '', hint: 'Podzapytanie: SELECT MAX(wartosc_rynkowa) FROM gracze', expectedColumns: ['imie', 'nazwisko'], expectedRows: [] },
      { id: 4, task: 'Wyświetl drużyny, które mają przynajmniej jednego gracza (użyj EXISTS).', placeholder: '', hint: 'EXISTS sprawdza czy podzapytanie zwróciło wiersz: EXISTS (SELECT 1 FROM gracze WHERE g.druzyna_id = d.id)', expectedColumns: ['nazwa'], expectedRows: [] },
      { id: 5, task: 'Wyświetl graczy droższych niż WSZYSTKIE gracze z pozycji "bramkarz" (użyj ALL).', placeholder: '', hint: 'WHERE wartosc_rynkowa > ALL (SELECT wartosc_rynkowa FROM gracze WHERE pozycja = "bramkarz")', expectedColumns: ['imie', 'wartosc_rynkowa'], expectedRows: [] },
    ],
  },
  {
    id: 11,
    title: 'Widoki i indeksy',
    subtitle: 'CREATE VIEW i CREATE INDEX — wirtualne tabele i wydajność',
    level: 'advanced',
    theory: {
      keywords: ['VIEW', 'CREATE VIEW', 'DROP VIEW', 'INDEX', 'CREATE INDEX', 'DROP INDEX'],
      sections: [
        { type: 'heading', content: 'Czym jest widok (VIEW)?' },
        { type: 'text', content: 'Widok (VIEW) to wirtualna tabela — zapytanie SELECT zapisane w bazie danych. Widok nie przechowuje danych fizycznie, tylko definicję zapytania. Gdy odwołujesz się do widoku, baza wykonuje zdefiniowane zapytanie.' },
        { type: 'code', label: 'Tworzenie widoku:', content: 'CREATE VIEW nazwidoku AS\nSELECT kolumna1, kolumna2\nFROM tabela\nWHERE warunek;' },

        { type: 'heading', content: 'Tworzenie widoku — CREATE VIEW' },
        { type: 'text', content: 'Widoki służą do upraszczania skomplikowanych zapytań i zabezpieczania danych. Możesz stworzyć widok pokazujący tylko wybrane kolumn lub wiersze.' },
        { type: 'code', label: 'Przykład widoku:', content: '-- Widok z napastnikami powyżej 30 mln:\nCREATE VIEW napastnicy_drodzy AS\nSELECT imie, wartosc_rynkowa\nFROM gracze\nWHERE pozycja = "napastnik" AND wartosc_rynkowa > 30;\n\n-- Użycie widoku (jak zwykłej tabeli):\nSELECT * FROM napastnicy_drodzy;' },

        { type: 'heading', content: 'Modyfikowanie i usuwanie widoków' },
        { type: 'text', content: 'Możesz zmienić definicję widoku używając CREATE OR REPLACE VIEW lub usunąć go DROP VIEW.' },
        { type: 'code', label: 'Modyfikacja i usuwanie:', content: '-- Zmiana definicji widoku:\nCREATE OR REPLACE VIEW napastnicy_drodzy AS\nSELECT imie, nazwisko, wartosc_rynkowa\nFROM gracze\nWHERE pozycja = "napastnik";\n\n-- Usunięcie widoku:\nDROP VIEW napastnicy_drodzy;' },

        { type: 'heading', content: 'Czym jest indeks (INDEX)?' },
        { type: 'text', content: 'Indeks (INDEX) to struktura przyspieszająca wyszukiwanie danych. Działa jak indeks w książce — zamiast przeszukiwać całą tabelę, baza natychmiast finds odpowiedni wiersz.' },
        { type: 'code', label: 'Tworzenie indeksu:', content: 'CREATE INDEX nazwa_indeksu\nON tabela (kolumna);\n\n-- Indeks na kilku kolumnach:\nCREATE INDEX idx_imie_nazwisko\nON gracze (imie, nazwisko);' },

        { type: 'heading', content: 'Rodzaje indeksów' },
        { type: 'table', label: 'Rodzaje indeksów:', columns: ['Rodzaj', 'Opis'], rows: [['UNIQUE', 'Zapewnia unikalność wartości w kolumnie'], ['CLUSTERED', 'Porządkuje fizycznie dane w tabeli (tylko jeden na tabelę)'], ['NONCLUSTERED', 'Oddzielna struktura danych (można mieć wiele)'], ['FULLTEXT', 'Przyspiesza wyszukiwanie w tekście']] },
        { type: 'code', label: 'Przykłady indeksów:', content: '-- Indeks UNIQUE (z unikalnością):\nCREATE UNIQUE INDEX idx_email\nON uzytkownicy (email);\n\n-- Indeks na kolumnie z JOIN:\nCREATE INDEX idx_druzyna_id\nON gracze (druzyna_id);' },

        { type: 'heading', content: 'Kiedy używać indeksów?' },
        { type: 'table', label: 'Zastosowanie indeksów:', columns: ['Użyj indeksu', 'Nie używaj indeksu'], rows: [['Kolumny w WHERE', 'Bardzo małe tabele (< 100 wierszy)'], ['Kolumny w ORDER BY', 'Tabele z częstymi INSERT/UPDATE/DELETE'], ['Klucze obce', 'Kolumny z niską unikalnością (np. płeć)'], ['Kolumny w JOIN', 'NULL']] },
        { type: 'hint', content: 'Indeksy przyspieszają SELECT, ale spowalniają INSERT/UPDATE/DELETE — baza musi aktualizować każdy indeks. Twórz indeksy tam, gdzie to potrzebne.' },
      ],
      schema: [
        { name: 'gracze.id', type: 'INTEGER', desc: 'PRIMARY KEY — ma automatyczny indeks' },
        { name: 'gracze.imie', type: 'VARCHAR', desc: 'Dobra kandydatka na indeks' },
        { name: 'gracze.druzyna_id', type: 'INTEGER', desc: 'FOREIGN KEY — warto dodać indeks' },
        { name: 'uzytkownicy.email', type: 'VARCHAR', desc: 'UNIQUE — powinien mieć indeks UNIQUE' },
      ],
    },
    exercises: [
      { id: 1, task: 'Utwórz widok gracze_napastnicy zawierający tylko napastników z tabeli gracze.', placeholder: '', hint: 'CREATE VIEW gracze_napastnicy AS SELECT * FROM gracze WHERE pozycja = "napastnik"', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Utwórz widok gracze_drodzy z graczami o wartości rynkowej powyżej 50 milionów.', placeholder: '', hint: 'CREATE VIEW gracze_drodzy AS SELECT * FROM gracze WHERE wartosc_rynkowa > 50', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Utwórz indeks na kolumnie druzyna_id w tabeli gracze.', placeholder: '', hint: 'CREATE INDEX idx_druzyna_id ON gracze (druzyna_id)', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Utwórz indeks UNIQUE na kolumnie email w tabeli uzytkownicy.', placeholder: '', hint: 'CREATE UNIQUE INDEX idx_email ON uzytkownicy (email)', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Usuń widok gracze_napastnicy z bazy danych.', placeholder: '', hint: 'DROP VIEW gracze_napastnicy', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 12,
    title: 'Transakcje i współbieżność',
    subtitle: 'ACID, BEGIN, COMMIT, ROLLBACK, blokowanie',
    level: 'advanced',
    theory: {
      keywords: ['TRANSACTION', 'BEGIN', 'COMMIT', 'ROLLBACK', 'ACID', 'AUTOCOMMIT', 'LOCK'],
      sections: [
        { type: 'heading', content: 'Czym jest transakcja?' },
        { type: 'text', content: 'Transakcja to grupa zapytań SQL, które są wykonywane jako jedna jednostka — albo wszystkie się powiodą (COMMIT), albo żadne (ROLLBACK). Chroni dane przed uszkodzeniem w przypadku błędu pośrodku.' },
        { type: 'code', label: 'Struktura transakcji:', content: 'BEGIN TRANSACTION;\n-- zapytania 1, 2, 3...\nIF wszystko_ok THEN\n    COMMIT;\nELSE\n    ROLLBACK;\nEND IF;' },

        { type: 'heading', content: 'Właściwości ACID' },
        { type: 'text', content: 'ACID to cztery właściwości, które gwarantują, że transakcje są bezpieczne i przewidywalne.' },
        { type: 'table', label: 'Właściwości ACID:', columns: ['Właściwość', 'Znaczenie'], rows: [['A - Atomicity', 'Atomowość — wszystko albo nic'], ['C - Consistency', 'Spójność — dane zawsze poprawne'], ['I - Isolation', 'Izolacja — transakcje nie wpływają na siebie'], ['D - Durability', 'Trwałość — potwierdzone zmiany są trwałe']] },

        { type: 'heading', content: 'BEGIN, COMMIT, ROLLBACK' },
        { type: 'text', content: 'BEGIN TRANSACTION rozpoczyna transakcję. COMMIT zatwierdza wszystkie zmiany. ROLLBACK cofa wszystkie zmiany od momentu BEGIN.' },
        { type: 'code', label: 'Przykład transakcji:', content: '-- Przelew pieniędzy między kontami:\nBEGIN TRANSACTION;\n\nUPDATE konta SET saldo = saldo - 100 WHERE id = 1;\nUPDATE konta SET saldo = saldo + 100 WHERE id = 2;\n\nIF bledy = 0 THEN\n    COMMIT;   -- przelew zakończony\nELSE\n    ROLLBACK; -- cofnij zmiany\nEND IF;' },

        { type: 'heading', content: 'TRY-CATCH w transakcjach' },
        { type: 'text', content: 'W T-SQL możesz używać TRY-CATCH do obsługi błędów. Jeśli wystąpi błąd, CATCH automatycznie wykona ROLLBACK.' },
        { type: 'code', label: 'TRY-CATCH:', content: 'BEGIN TRY\n    BEGIN TRANSACTION;\n    UPDATE gracze SET pozycja = "napastnik" WHERE id = 1;\n    COMMIT;\nEND TRY\nBEGIN CATCH\n    IF @@TRANCOUNT > 0\n        ROLLBACK;\n    PRINT "Wystąpił błąd: " + ERROR_MESSAGE();\nEND CATCH;' },

        { type: 'heading', content: 'AUTOCOMMIT' },
        { type: 'text', content: 'AUTOCOMMIT oznacza, że każde zapytanie jest automatycznie transakcją i zatwierdza się natychmiast. Gdy AUTOCOMMIT jest wyłączony, musisz ręcznie używać COMMIT.' },
        { type: 'code', label: 'Kontrola AUTOCOMMIT:', content: '-- Wyłącz autocommit:\nSET AUTOCOMMIT = 0;\n\n-- Teraz musisz ręcznie zatwierdzać:\nINSERT INTO gracze (...) VALUES (...);\nCOMMIT;' },

        { type: 'heading', content: 'Poziomy izolacji' },
        { type: 'text', content: 'Poziomy izolacji określają, jak transakcje widzą zmiany dokonywane przez inne transakcje.' },
        { type: 'table', label: 'Poziomy izolacji:', columns: ['Poziom', 'Opis'], rows: [['READ UNCOMMITTED', 'Może czytać niezatwierdzone dane (dirty read)'], ['READ COMMITTED', 'Domyślny — nie czyta dirty reads'], ['REPEATABLE READ', 'Gwarantuje te same wyniki w transakcji'], ['SERIALIZABLE', 'Najbardziej restrykcyjny — blokuje wszystko']] },
        { type: 'code', label: 'Ustawienie poziomu izolacji:', content: 'SET TRANSACTION ISOLATION LEVEL READ COMMITTED;' },

        { type: 'hint', content: 'Zawsze używaj transakcji przy operacjach finansowych lub wielokrotnych UPDATE — chroni przed utratą spójności danych.' },
      ],
      schema: [
        { name: 'konta.id', type: 'INTEGER', desc: 'ID konta' },
        { name: 'konta.saldo', type: 'DECIMAL', desc: 'Saldo konta' },
        { name: 'gracze.id', type: 'INTEGER', desc: 'ID gracza' },
        { name: 'gracze.pozycja', type: 'VARCHAR', desc: 'Pozycja gracza' },
      ],
    },
    exercises: [
      { id: 1, task: 'Rozpocznij transakję używając BEGIN TRANSACTION.', placeholder: '', hint: 'BEGIN TRANSACTION;', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Zatwierdź transakcję używając COMMIT.', placeholder: '', hint: 'COMMIT;', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Cofnij transakcję używając ROLLBACK.', placeholder: '', hint: 'ROLLBACK;', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Ustaw poziom izolacji transakcji na READ COMMITTED.', placeholder: '', hint: 'SET TRANSACTION ISOLATION LEVEL READ COMMITTED;', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Wyłącz AUTOCOMMIT.', placeholder: '', hint: 'SET AUTOCOMMIT = 0;', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 13,
    title: 'Transact-SQL (T-SQL)',
    subtitle: 'Programowanie w SQL: zmienne, IF, CASE, CTE, procedury',
    level: 'advanced',
    theory: {
      keywords: ['T-SQL', 'DECLARE', 'IF', 'CASE', 'CTE', 'WHILE', 'PROCEDURE', 'FUNCTION'],
      sections: [
        { type: 'heading', content: 'Czym jest T-SQL?' },
        { type: 'text', content: 'Transact-SQL (T-SQL) to rozszerzenie SQL od Microsoft, które dodaje możliwości programowania: zmienne, instrukcje warunkowe, pętle, procedury i funkcje składowane.' },

        { type: 'heading', content: 'Zmienne — DECLARE' },
        { type: 'text', content: 'DECLARE tworzy zmienną o określonym typie. SET lub SELECT przypisuje wartość.' },
        { type: 'code', label: 'Deklarowanie zmiennych:', content: '-- Deklaracja:\nDECLARE @imie VARCHAR(50) = "Robert";\nDECLARE @wartosc INT = 50;\n\n-- Zmiana wartości:\nSET @wartosc = @wartosc + 10;\n\n-- Użycie w zapytaniu:\nSELECT * FROM gracze WHERE imie = @imie;' },

        { type: 'heading', content: 'Instrukcja warunkowa IF' },
        { type: 'text', content: 'IF wykonuje kod tylko jeśli warunek jest prawdziwy. ELSE określa kod, który wykona się gdy warunek jest fałszywy.' },
        { type: 'code', label: 'Przykład IF:', content: 'DECLARE @gracz INT = 5;\n\nIF @gracz > 10\n    PRINT "Gracz jest doświadczony";\nELSE\n    PRINT "Gracz jest początkujący";' },

        { type: 'heading', content: 'Wyrażenie CASE' },
        { type: 'text', content: 'CASE zwraca różne wartości w zależności od warunków. Działa jak IF/ELSEIF/ELSE w SELECT.' },
        { type: 'code', label: 'Przykład CASE:', content: 'SELECT imie, wartosc_rynkowa,\n    CASE\n        WHEN wartosc_rynkowa > 50 THEN "Drogi"\n        WHEN wartosc_rynkowa > 20 THEN "Sredni"\n        ELSE "Tani"\n    END AS kategoria\nFROM gracze;' },

        { type: 'heading', content: 'Pętla WHILE' },
        { type: 'text', content: 'WHILE powtarza kod dopóki warunek jest prawdziwy. BREAK przerywa pętlę, CONTINUE przechodzi do następnej iteracji.' },
        { type: 'code', label: 'Przykład WHILE:', content: 'DECLARE @licznik INT = 1;\n\nWHILE @licznik <= 5\nBEGIN\n    PRINT "Iteracja: " + CAST(@licznik AS VARCHAR);\n    SET @licznik = @licznik + 1;\nEND;' },

        { type: 'heading', content: 'CTE — Common Table Expression' },
        { type: 'text', content: 'CTE (WITH) to tymczasowa tabela widoczna tylko w jednym zapytaniu. Upraszcza skomplikowane zapytania.' },
        { type: 'code', label: 'Przykład CTE:', content: 'WITH SredniePozycje AS (\n    SELECT pozycja, AVG(wartosc_rynkowa) AS srednia\n    FROM gracze\n    GROUP BY pozycja\n)\nSELECT * FROM SredniePozycje WHERE srednia > 30;' },

        { type: 'heading', content: 'Procedury składowane' },
        { type: 'text', content: 'Procedura składowana (STORED PROCEDURE) to zestaw zapytań zapisany pod nazwą. Możesz ją wielokrotnie wywoływać z parametrami.' },
        { type: 'code', label: 'Tworzenie procedury:', content: 'CREATE PROCEDURE PokazGraczyDrogich\n    @min_wartosc INT\nAS\nBEGIN\n    SELECT imie, wartosc_rynkowa\n    FROM gracze\n    WHERE wartosc_rynkowa > @min_wartosc;\nEND;\n\n-- Wywołanie:\nEXEC PokazGraczyDrogich @min_wartosc = 50;' },

        { type: 'hint', content: 'CTE są idealne do rekurencji i wielokrotnego użycia tego samego podzapytania. Procedury składowane encapsulują logikę biznesową.' },
      ],
      schema: [
        { name: 'gracze.id', type: 'INTEGER', desc: 'ID gracza' },
        { name: 'gracze.imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'gracze.pozycja', type: 'VARCHAR', desc: 'Pozycja gracza' },
        { name: 'gracze.wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
      ],
    },
    exercises: [
      { id: 1, task: 'Zadeklaruj zmienną @imie VARCHAR(50) i przypisz jej wartość "Robert".', placeholder: '', hint: 'DECLARE @imie VARCHAR(50) = "Robert";', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Użyj instrukcji IF do sprawdzenia czy @licznik jest większy niż 10.', placeholder: '', hint: 'IF @licznik > 10 ...', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Stwórz zapytanie z CASE, które pokazuje "Drogi" gdy wartosc_rynkowa > 50, "Tani" w przeciwnym raz.', placeholder: '', hint: 'CASE WHEN wartosc_rynkova > 50 THEN "Drogi" ELSE "Tani" END', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Stwórz CTE o nazwie SrednieWartosci, które liczy średnią wartość dla każdej pozycji.', placeholder: '', hint: 'WITH SrednieWartosci AS (SELECT pozycja, AVG(wartosc_rynkova) FROM gracze GROUP BY pozycja)', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Stwórz procedurę składowaną, która przyjmuje @min_wartosc i zwraca graczy droższych niż ta wartość.', placeholder: '', hint: 'CREATE PROCEDURE NazwaProcedury @min_wartosc INT AS ...', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 14,
    title: 'Wyzwalacze (Triggers)',
    subtitle: 'AFTER, INSTEAD OF — automatyczna reakcja na zmiany',
    level: 'advanced',
    theory: {
      keywords: ['TRIGGER', 'CREATE TRIGGER', 'AFTER', 'INSTEAD OF', 'DML', 'DDL'],
      sections: [
        { type: 'heading', content: 'Czym jest wyzwalacz (TRIGGER)?' },
        { type: 'text', content: 'Wyzwalacz (TRIGGER) to procedura, która wykonuje się automatycznie w odpowiedzi na określone zdarzenie w bazie danych — np. INSERT, UPDATE lub DELETE. Może być stosowany do logowania zmian, walidacji lub automatycznych aktualizacji.' },
        { type: 'code', label: 'Ogólna składnia:', content: 'CREATE TRIGGER nazwa_wyzwalacza\nON tabela\nAFTER INSERT, UPDATE, DELETE\nAS\nBEGIN\n    -- kod do wykonania\nEND;' },

        { type: 'heading', content: 'Wyzwalacze AFTER' },
        { type: 'text', content: 'AFTER (również FOR) wykonuje się PO tym, jak operacja zakończyła się pomyślnie. Ma dostęp do tabel inserted i deleted.' },
        { type: 'code', label: 'Przykład AFTER:', content: '-- Logowanie usuniętych graczy:\nCREATE TRIGGER log_usuniecia\nON gracze\nAFTER DELETE\nAS\nBEGIN\n    INSERT INTO gracze_usuniete (imie, data_usuniecia)\n    SELECT imie, GETDATE()\n    FROM deleted;\nEND;' },

        { type: 'heading', content: 'Tabele inserted i deleted' },
        { type: 'text', content: 'Wyzwalacze mają dostęp do specjalnych tabel tymczasowych: inserted (nowe wiersze z INSERT/UPDATE) i deleted (stare wiersze z UPDATE/DELETE).' },
        { type: 'table', label: 'Tabele tymczasowe:', columns: ['Operacja', 'Tabela inserted', 'Tabela deleted'], rows: [['INSERT', 'Nowe wiersze', 'Pusta'], ['UPDATE', 'Nowe wartości', 'Stare wartości'], ['DELETE', 'Pusta', 'Usunięte wiersze']] },

        { type: 'heading', content: 'Wyzwalacze INSTEAD OF' },
        { type: 'text', content: 'INSTEAD OF wykonuje się ZAMIAST operacji — operacja nie jest wykonywana. Wyzwalacz musi sam wykonać żądaną operację. Przydatny dla widoków.' },
        { type: 'code', label: 'Przykład INSTEAD OF:', content: '-- Wyzwalacz na widoku zamiast INSERT:\nCREATE TRIGGER zamiast_insertu\nON widok_graczy\nINSTEAD OF INSERT\nAS\nBEGIN\n    -- Insert do tabeli podstawowej\n    INSERT INTO gracze (imie, pozycja)\n    SELECT imie, pozycja FROM inserted;\nEND;' },

        { type: 'heading', content: 'Wyzwalacze DDL' },
        { type: 'text', content: 'DDL TRIGGER reaguje na zmiany struktury bazy — CREATE, ALTER, DROP tabel, indeksów itp. Może służyć do audytu.' },
        { type: 'code', label: 'Przykład DDL:', content: '-- Logowanie zmian w strukturze:\nCREATE TRIGGER logowanie_ddl\nON DATABASE\nFOR CREATE_TABLE, ALTER_TABLE, DROP_TABLE\nAS\nBEGIN\n    PRINT "Zmieniono strukturę bazy!";\nEND;' },

        { type: 'heading', content: 'Usuwanie wyzwalaczy' },
        { type: 'code', label: 'Usunięcie:', content: '-- Usunięcie wyzwalacza:\nDROP TRIGGER nazwa_wyzwalacza ON tabela;\n\n-- Wyłączenie (bez usuwania):\nDISABLE TRIGGER nazwa_wyzwalacza ON tabela;' },

        { type: 'hint', content: 'Wyzwalacze są potężne, ale trudne w debugowaniu. Używaj ich ostrożnie — zawiłe wyzwalacze mogą spowolnić bazę.' },
      ],
      schema: [
        { name: 'gracze.id', type: 'INTEGER', desc: 'ID gracza' },
        { name: 'gracze.imie', type: 'VARCHAR', desc: 'Imię gracza' },
        { name: 'gracze.pozycja', type: 'VARCHAR', desc: 'Pozycja gracza' },
        { name: 'gracze_usuniete.imie', type: 'VARCHAR', desc: 'Imię usuniętego gracza (log)' },
        { name: 'gracze_usuniete.data_usuniecia', type: 'DATETIME', desc: 'Data usunięcia (log)' },
      ],
    },
    exercises: [
      { id: 1, task: 'Utwórz wyzwalacz AFTER INSERT na tabeli gracze, który loguje nowe wpisy.', placeholder: '', hint: 'CREATE TRIGGER nazwa ON gracze AFTER INSERT AS ...', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Utwórz wyzwalacz AFTER UPDATE, który zapisuje stare wartości do tabeli log.', placeholder: '', hint: 'Użyj tabeli deleted do pobrania starych wartości.', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Utwórz wyzwalacz INSTEAD OF INSERT na widoku.', placeholder: '', hint: 'CREATE TRIGGER nazwa ON widok INSTEAD OF INSERT AS ...', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Wyłącz wyzwalacz o nazwie log_usuniecia.', placeholder: '', hint: 'DISABLE TRIGGER log_usuniecia ON tabela;', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Usuń wyzwalacz z tabeli gracze.', placeholder: '', hint: 'DROP TRIGGER nazwa ON gracze;', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 15,
    title: 'Administrowanie MS SQL Server',
    subtitle: 'Tworzenie loginów, użytkowników, zarządzanie bazami systemowymi',
    level: 'advanced',
    theory: {
      keywords: ['CREATE LOGIN', 'CREATE USER', 'GRANT', 'REVOKE', 'DENY', 'master', 'model', 'tempdb', 'msdb'],
      sections: [
        { type: 'heading', content: 'Tryby uwierzytelniania' },
        { type: 'text', content: 'SQL Server obsługuje dwa tryby uwierzytelniania: Windows Authentication (korzysta z kont Windows) i SQL Server Authentication (login zdefiniowany w SQL).' },
        { type: 'table', label: 'Tryby uwierzytelniania:', columns: ['Tryb', 'Opis'], rows: [['Windows Authentication', 'Integracja z AD/kontami Windows'], ['SQL Server Authentication', 'Loginy stworzone w SQL Server'], ['Mixed Mode', 'Obydwa tryby dostępne']] },

        { type: 'heading', content: 'Tworzenie loginów — CREATE LOGIN' },
        { type: 'text', content: 'CREATE LOGIN tworzy login na poziomie serwera. Po utworzeniu loginu, musisz jeszcze utworzyć użytkownika (USER) w konkretnej bazie.' },
        { type: 'code', label: 'Tworzenie loginu:', content: '-- Tworzenie loginu SQL:\nCREATE LOGIN nazwa_loginu\nWITH PASSWORD = "TajneHaslo123!",\n     DEFAULT_DATABASE = liga_pilkarska;\n\n-- Tworzenie użytkownika w bazie:\nCREATE USER nazwa_uzytkownika\nFOR LOGIN nazwa_loginu;' },

        { type: 'heading', content: 'Role i uprawnienia' },
        { type: 'text', content: 'Role grupują uprawnienia. Możesz przypisać użytkownika do roli lub nadać konkretne uprawnienia GRANT, REVOKE lub DENY.' },
        { type: 'table', label: 'Role serwerowe:', columns: ['Rola', 'Uprawnienia'], rows: [['sysadmin', 'Pełna kontrola nad serwerem'], ['dbcreator', 'Może tworzyć i modyfikować bazy'], ['securityadmin', 'Zarządza loginami i uprawnieniami'], ['bulkadmin', 'Może wykonywać BULK INSERT']] },
        { type: 'code', label: 'Nadawanie uprawnień:', content: '-- Przypisanie do roli:\nALTER ROLE db_owner ADD MEMBER nazwa_uzytkownika;\n\n-- Nadanie konkretnego uprawnienia:\nGRANT SELECT, INSERT ON gracze TO nazwa_uzytkownika;\n\n-- Odbieranie uprawnienia:\nREVOKE SELECT ON gracze FROM nazwa_uzytkownika;' },

        { type: 'heading', content: 'GRANT, REVOKE, DENY' },
        { type: 'text', content: 'GRANT nadaje uprawnienie. REVOKE usuwa nadane uprawnienie. DENY blokuje uprawnienie (silniejsze niż GRANT).' },
        { type: 'table', label: 'Rodzaje uprawnień:', columns: ['Polecenie', 'Działanie'], rows: [['GRANT', 'Nadaje uprawnienie'], ['REVOKE', 'Usuwa uprawnienie (przywraca stan domyślny)'], ['DENY', 'Jawnie blokuje uprawnienie (priorytet)']] },
        { type: 'code', label: 'Przykłady:', content: '-- Nadanie uprawnień do tabeli:\nGRANT SELECT, UPDATE ON gracze TO uzytkownik1;\n\n-- Odbieranie uprawnienia:\nREVOKE INSERT ON gracze FROM uzytkownik1;\n\n-- Zablokowanie uprawnienia:\nDENY DELETE ON gracze TO uzytkownik1;' },

        { type: 'heading', content: 'Bazy systemowe' },
        { type: 'text', content: 'SQL Server ma 4 bazy systemowe, które są kluczowe do jego działania.' },
        { type: 'table', label: 'Bazy systemowe:', columns: ['Baza', 'Opis'], rows: [['master', 'Konfiguracja serwera, wszystkie loginy'], ['model', 'Szablon dla nowych baz danych'], ['tempdb', 'Tymczasowe obiekty, czyszczona przy restarcie'], ['msdb', 'SQL Agent, plany zadań, kopie zapasowe']] },

        { type: 'hint', content: 'Zawsze używaj roli z najmniejszymi uprawnieniami potrzebnymi do zadania (principle of least privilege). Nigdy nie nadawaj sysadmin jeśli nie jest konieczne.' },
      ],
      schema: [
        { name: 'logins.name', type: 'VARCHAR', desc: 'Nazwa loginu serwera' },
        { name: 'logins.type', type: 'VARCHAR', desc: 'Typ: S (SQL) lub U (Windows)' },
        { name: 'users.name', type: 'VARCHAR', desc: 'Nazwa użytkownika w bazie' },
        { name: 'roles.name', type: 'VARCHAR', desc: 'Nazwa roli' },
      ],
    },
    exercises: [
      { id: 1, task: 'Utwórz login "test_user" z hasłem "Test123!".', placeholder: '', hint: 'CREATE LOGIN test_user WITH PASSWORD = "Test123!";', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Utwórz użytkownika "test_user" w bazie danych.', placeholder: '', hint: 'CREATE USER test_user FOR LOGIN test_user;', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Nadaj uprawnienie SELECT na tabeli gracze użytkownikowi test_user.', placeholder: '', hint: 'GRANT SELECT ON gracze TO test_user;', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Odbierz uprawnienie INSERT na tabeli gracze od użytkownika test_user.', placeholder: '', hint: 'REVOKE INSERT ON gracze FROM test_user;', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Dodaj użytkownika test_user do roli db_owner.', placeholder: '', hint: 'ALTER ROLE db_owner ADD MEMBER test_user;', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 16,
    title: 'Role i uprawnienia',
    subtitle: 'Role serwerowe i bazodanowe, GRANT, REVOKE, DENY',
    level: 'advanced',
    theory: {
      keywords: ['ROLE', 'GRANT', 'REVOKE', 'DENY', 'sysadmin', 'db_owner', 'db_datareader'],
      sections: [
        { type: 'heading', content: 'Role serwerowe' },
        { type: 'text', content: 'Role serwerowe przyznają uprawnienia na poziomie całego serwera SQL. Przypisuje się je do loginów.' },
        { type: 'table', label: 'Role serwerowe:', columns: ['Rola', 'Uprawnienia'], rows: [['sysadmin', 'Pełna kontrola nad serwerem — wszystko'], ['serveradmin', 'Konfiguracja serwera, zatrzymywanie'], ['securityadmin', 'Zarządzanie loginami i uprawnieniami'], ['dbcreator', 'Tworzenie i modyfikowanie baz danych'], ['bulkadmin', 'Wykonywanie BULK INSERT'], ['diskadmin', 'Zarządzanie plikami dysku']] },
        { type: 'code', label: 'Przypisanie roli serwerowej:', content: '-- Dodaj login do roli sysadmin:\nALTER SERVER ROLE sysadmin ADD MEMBER login_nazwa;' },

        { type: 'heading', content: 'Role bazodanowe' },
        { type: 'text', content: 'Role bazodanowe działają w obrębie konkretnej bazy danych. Przypisuje się je do użytkowników (USER), nie loginów.' },
        { type: 'table', label: 'Role bazodanowe:', columns: ['Rola', 'Uprawnienia'], rows: [['db_owner', 'Pełna kontrola nad bazą danych'], ['db_accessadmin', 'Zarządzanie dostępem do bazy'], ['db_datareader', 'Czytanie wszystkich danych (SELECT)'], ['db_datawriter', 'Modyfikacja wszystkich danych (INSERT, UPDATE, DELETE)'], ['db_ddladmin', 'Uruchamianie DDL w bazie']] },
        { type: 'code', label: 'Przypisanie roli bazodanowej:', content: '-- Dodaj użytkownika do roli db_owner:\nALTER ROLE db_owner ADD MEMBER user_nazwa;\n\n-- Dodaj użytkownika do roli db_datareader:\nALTER ROLE db_datareader ADD MEMBER user_nazwa;' },

        { type: 'heading', content: 'Uprawnienia — GRANT' },
        { type: 'text', content: 'GRANT nadaje konkretne uprawnienie do obiektu (tabela, widok, procedura).' },
        { type: 'code', label: 'Nadawanie uprawnień:', content: '-- Nadanie uprawnień SELECT i INSERT:\nGRANT SELECT, INSERT ON gracze TO user_nazwa;\n\n-- Nadanie uprawnień z opcją GRANT OPTION:\nGRANT SELECT ON gracze TO user_nazwa WITH GRANT OPTION;' },

        { type: 'heading', content: 'Odbieranie uprawnień — REVOKE' },
        { type: 'text', content: 'REVOKE usuwa uprawnienie przyznane poleceniem GRANT. Przywraca stan domyślny.' },
        { type: 'code', label: 'Odbieranie uprawnień:', content: '-- Odbierz uprawnienie INSERT:\nREVOKE INSERT ON gracze FROM user_nazwa;\n\n-- Odbierz GRANT OPTION:\nREVOKE GRANT OPTION FOR SELECT ON gracze FROM user_nazwa;' },

        { type: 'heading', content: 'Blokowanie uprawnień — DENY' },
        { type: 'text', content: 'DENY jawnie blokuje uprawnienie. DENY ma wyższy priorytet niż GRANT — jeśli użytkownik ma GRANT w jednej roli i DENY w drugiej, DENY wygrywa.' },
        { type: 'code', label: 'Blokowanie uprawnień:', content: '-- Zablokuj DELETE na tabeli:\nDENY DELETE ON gracze TO user_nazwa;\n\n-- Zablokuj wszystkim:\nDENY SELECT, INSERT, UPDATE ON gracze TO public;' },

        { type: 'hint', content: 'Zawsze używaj roli z najmniejszymi uprawnieniami potrzebnymi do zadania. Używaj DENY ostrożnie — może powodować nieoczekiwane problemy.' },
      ],
      schema: [
        { name: 'server_roles.name', type: 'VARCHAR', desc: 'Nazwa roli serwerowej' },
        { name: 'database_roles.name', type: 'VARCHAR', desc: 'Nazwa roli bazodanowej' },
        { name: 'users.name', type: 'VARCHAR', desc: 'Nazwa użytkownika w bazie' },
        { name: 'permissions.permission', type: 'VARCHAR', desc: 'Rodzaj uprawnienia (SELECT, INSERT...)' },
      ],
    },
    exercises: [
      { id: 1, task: 'Przypisz login "admin" do roli serwerowej dbcreator.', placeholder: '', hint: 'ALTER SERVER ROLE dbcreator ADD MEMBER admin;', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Dodaj użytkownika "reader" do roli bazodanowej db_datareader.', placeholder: '', hint: 'ALTER ROLE db_datareader ADD MEMBER reader;', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Nadaj uprawnienie SELECT i INSERT na tabeli gracze użytkownikowi "writer".', placeholder: '', hint: 'GRANT SELECT, INSERT ON gracze TO writer;', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Odbierz uprawnienie DELETE na tabeli gracze od użytkownika "editor".', placeholder: '', hint: 'REVOKE DELETE ON gracze FROM editor;', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Zablokuj uprawnienie UPDATE na tabeli gracze dla użytkownika "guest".', placeholder: '', hint: 'DENY UPDATE ON gracze TO guest;', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 17,
    title: 'Kopie bezpieczeństwa i przywracanie',
    subtitle: 'BACKUP DATABASE, RESTORE DATABASE, DBCC CHECKDB',
    level: 'advanced',
    theory: {
      keywords: ['BACKUP', 'RESTORE', 'DBCC', 'CHECKDB', 'FULL', 'DIFFERENTIAL', 'TRANSACTION LOG'],
      sections: [
        { type: 'heading', content: 'Czym jest backup bazy danych?' },
        { type: 'text', content: 'Backup to kopia zapasowa bazy danych zapisana w pliku. W przypadku awarii możesz przywrócić bazę z kopii. SQL Server wspiera pełne (FULL), przyrostowe (DIFFERENTIAL) i transakcyjne (TRANSACTION LOG) kopie zapasowe.' },

        { type: 'heading', content: 'Pełny backup — FULL' },
        { type: 'text', content: 'FULL BACKUP kopiuje całą bazę danych. Jest to najbezpieczniejszy typ backupu, ale zajmuje najwięcej czasu i przestrzeni.' },
        { type: 'code', label: 'Pełny backup:', content: 'BACKUP DATABASE liga_pilkarska\nTO DISK = "C:\\backups\\liga_full.bak"\nWITH FORMAT,\n     MEDIANAME = "Liga Backup";' },

        { type: 'heading', content: 'Backup przyrostowy — DIFFERENTIAL' },
        { type: 'text', content: 'DIFFERENTIAL kopiuje tylko dane zmienione od ostatniego pełnego backupu. Jest szybszy, ale do przywracania potrzebujesz zarówno pełnego jak i przyrostowego backupu.' },
        { type: 'code', label: 'Backup przyrostowy:', content: 'BACKUP DATABASE liga_pilkarska\nTO DISK = "C:\\backups\\liga_diff.bak"\nWITH DIFFERENTIAL;' },

        { type: 'heading', content: 'Backup logu transakcji' },
        { type: 'text', content: 'LOG BACKUP kopiuje tylko log transakcji. Pozwala przywrócić bazę do konkretnego momentu w czasie (point-in-time recovery).' },
        { type: 'code', label: 'Backup logu:', content: 'BACKUP LOG liga_pilkarska\nTO DISK = "C:\\backups\\liga_log.trn";' },

        { type: 'heading', content: 'Przywracanie bazy — RESTORE' },
        { type: 'text', content: 'RESTORE DATABASE przywraca bazę z pliku backupu. Możesz przywrócić pełną kopię lub kombinację pełnej + przyrostowe.' },
        { type: 'code', label: 'Przywracanie pełnej kopii:', content: 'RESTORE DATABASE liga_pilkarska\nFROM DISK = "C:\\backups\\liga_full.bak"\nWITH REPLACE, MOVE "liga_pilkarska" TO "C:\\data\\liga.mdf";' },

        { type: 'heading', content: 'Point-in-time recovery' },
        { type: 'text', content: 'Możesz przywrócić bazę do konkretnego momentu w czasie, używając logów transakcji.' },
        { type: 'code', label: 'Przywracanie do momentu:', content: 'RESTORE DATABASE liga_pilkarska\nFROM DISK = "C:\\backups\\liga_full.bak"\nWITH NORECOVERY;\n\nRESTORE LOG liga_pilkarska\nFROM DISK = "C:\\backups\\liga_log.trn"\nWITH STOPAT = "2026-04-20 15:30:00";' },

        { type: 'heading', content: 'Sprawdzanie spójności — DBCC' },
        { type: 'text', content: 'DBCC CHECKDB sprawdza spójność bazy danych — wykrywa uszkodzone strony, błędy indeksów i inne problemy.' },
        { type: 'code', label: 'Sprawdzanie spójności:', content: '-- Sprawdź spójność bazy:\nDBCC CHECKDB(liga_pilkarska);\n\n-- Sprawdź tylko jedną tabelę:\nDBCC CHECKTABLE(gracze);' },

        { type: 'hint', content: 'Regularnie wykonuj pełne kopie zapasowe i testuj przywracanie. Nie sprawdzony backup to taki sam jak brak backupu.' },
      ],
      schema: [
        { name: 'backup_files.path', type: 'VARCHAR', desc: 'Ścieżka do pliku backupu' },
        { name: 'backup_files.type', type: 'VARCHAR', desc: 'Typ: FULL, DIFFERENTIAL, LOG' },
        { name: 'backup_files.backup_date', type: 'DATETIME', desc: 'Data utworzenia backupu' },
      ],
    },
    exercises: [
      { id: 1, task: 'Utwórz pełny backup bazy danych liga_pilkarska.', placeholder: '', hint: 'BACKUP DATABASE liga_pilkarska TO DISK = "ścieżka\\plik.bak"', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Utwórz przyrostowy backup bazy danych.', placeholder: '', hint: 'BACKUP DATABASE nazwa TO DISK = "ścieżka\\plik.bak" WITH DIFFERENTIAL', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Utwórz backup logu transakcji.', placeholder: '', hint: 'BACKUP LOG nazwa TO DISK = "ścieżka\\log.trn"', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Przywróć bazę danych z pliku backupu.', placeholder: '', hint: 'RESTORE DATABASE nazwa FROM DISK = "ścieżka\\plik.bak"', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Sprawdź spójność bazy danych używając DBCC CHECKDB.', placeholder: '', hint: 'DBCC CHECKDB(nazwa_bazy);', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 18,
    title: 'Import i eksport danych',
    subtitle: 'BULK INSERT, BCP, SQL Server Import/Export Wizard',
    level: 'advanced',
    theory: {
      keywords: ['BULK INSERT', 'BCP', 'OPENROWSET', 'IMPORT', 'EXPORT', 'CSV'],
      sections: [
        { type: 'heading', content: 'Import danych — BULK INSERT' },
        { type: 'text', content: 'BULK INSERT importuje dane z pliku tekstowego do tabeli. Obsługuje pliki CSV i inne formaty tekstowe.' },
        { type: 'code', label: 'BULK INSERT:', content: 'BULK INSERT gracze\nFROM "C:\\data\\gracze.csv"\nWITH (\n    FIELDTERMINATOR = ",",\n    ROWTERMINATOR = "\\n",\n    FIRSTROW = 2,  -- pomiń nagłówek\n    CODEPAGE = "UTF-8"\n);' },

        { type: 'heading', content: 'Opcje BULK INSERT' },
        { type: 'table', label: 'Opcje BULK INSERT:', columns: ['Opcja', 'Opis'], rows: [['FIELDTERMINATOR', 'Separator pól (np. "," dla CSV)'], ['ROWTERMINATOR', 'Separator wierszy (np. "\\n")'], ['FIRSTROW', 'Pierwszy wiersz do zaimportowania'], ['CODEPAGE', 'Kodowanie znaków'], ['MAXERRORS', 'Maksymalna liczba błędów przed przerwaniem']] },

        { type: 'heading', content: 'Eksport danych — BCP' },
        { type: 'text', content: 'BCP (Bulk Copy Program) to narzędzie wiersza poleceń do szybkiego importu/eksportu dużych ilości danych.' },
        { type: 'code', label: 'Eksport BCP:', content: '-- Eksportuj tabelę do CSV:\nbcp liga_pilkarska.dbo.gracze OUT "C:\\data\\gracze.csv" -c -t, -T\n\n-- Importuj z CSV do tabeli:\nbcp liga_pilkarska.dbo.gracze IN "C:\\data\\gracze.csv" -c -t, -T' },

        { type: 'heading', content: 'OPENROWSET do importu' },
        { type: 'text', content: 'OPENROWSET pozwala importować dane z różnych źródeł (Excel, Access, inne bazy) bezpośrednio w zapytaniu SELECT.' },
        { type: 'code', label: 'OPENROWSET:', content: 'SELECT *\nFROM OPENROWSET(\n    "Microsoft.ACE.OLEDB.12.0",\n    "Excel 12.0;Database=C:\\data\\dane.xlsx;",\n    "SELECT * FROM [Arkusz1$]"\n) AS import;' },

        { type: 'heading', content: 'SQL Server Import/Export Wizard' },
        { type: 'text', content: 'Import/Export Wizard to graficzne narzędzie do przenoszenia danych. Umożliwia łatwy transfer między bazami, plikami Excel, CSV i innymi formatami.' },
        { type: 'code', label: 'Uruchomienie z wiersza poleceń:', content: '-- Uruchom wizard:\nsqlwb.exe -S "serwer" -d "baza_danych"' },

        { type: 'heading', content: 'Eksport do CSV przez SELECT' },
        { type: 'text', content: 'Możesz wyeksportować dane do CSV używając bcp lub kombinacji SQL i wiersza poleceń.' },
        { type: 'code', label: 'Eksport przez SELECT:', content: '-- Użyj bcp aby wyeksportować wynik zapytania:\nbcp "SELECT imie, nazwisko FROM liga_pilkarska.dbo.gracze WHERE pozycja = \"napastnik\"" queryout "C:\\data\\napastnicy.csv" -c -t, -T' },

        { type: 'hint', content: 'BULK INSERT jest najszybszy przy imporcie dużych ilości danych. Dla małych zbiorów możesz użyć SSIS lub Import/Export Wizard.' },
      ],
      schema: [
        { name: 'gracze.csv', type: 'FILE', desc: 'Plik CSV z danymi graczy' },
        { name: 'gracze.id', type: 'INTEGER', desc: 'ID gracza (kolumna docelowa)' },
        { name: 'gracze.imie', type: 'VARCHAR', desc: 'Imię gracza (kolumna docelowa)' },
      ],
    },
    exercises: [
      { id: 1, task: 'Zaimportuj dane z pliku CSV do tabeli gracze używając BULK INSERT.', placeholder: '', hint: 'BULK INSERT gracze FROM "ścieżka\\plik.csv" WITH (FIELDTERMINATOR = ",")', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Wyeksportuj tabelę gracze do pliku CSV używając bcp.', placeholder: '', hint: 'bcp nazwa_bazy.dbo.gracze OUT "ścieżka\\gracze.csv" -c -t, -T', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Zaimportuj dane z pliku CSV z separatorem średnik (;) do tabeli.', placeholder: '', hint: 'FIELDTERMINATOR = ";"', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Zaimportuj dane pomijając pierwszy wiersz (nagłówek).', placeholder: '', hint: 'WITH (FIRSTROW = 2, ...)', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Wyeksportuj wynik zapytania SELECT do pliku CSV.', placeholder: '', hint: 'bcp "SELECT ..." queryout "ścieżka\\plik.csv" -c -t, -T', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 19,
    title: 'MySQL — konfiguracja i zarządzanie',
    subtitle: 'CREATE/ALTER DATABASE, typy tabel InnoDB, MyISAM, MEMORY',
    level: 'advanced',
    theory: {
      keywords: ['CREATE DATABASE', 'ALTER DATABASE', 'DROP DATABASE', 'InnoDB', 'MyISAM', 'MEMORY', 'SHOW DATABASES'],
      sections: [
        { type: 'heading', content: 'Tworzenie bazy danych MySQL' },
        { type: 'text', content: 'CREATE DATABASE tworzy nową bazę danych. Możesz określić zestaw znaków (CHARACTER SET) i porównywanie (COLLATION).' },
        { type: 'code', label: 'Tworzenie bazy:', content: '-- Utwórz bazę z kodowaniem UTF-8:\nCREATE DATABASE liga_pilkarska\nCHARACTER SET utf8mb4\nCOLLATE utf8mb4_polish_ci;\n\n-- Wyświetl wszystkie bazy:\nSHOW DATABASES;' },

        { type: 'heading', content: 'Modyfikowanie bazy — ALTER DATABASE' },
        { type: 'text', content: 'ALTER DATABASE zmienia właściwości istniejącej bazy — kodowanie znaków, porównywanie lub nazwę.' },
        { type: 'code', label: 'Modyfikacja bazy:', content: '-- Zmień kodowanie:\nALTER DATABASE liga_pilkarska\nCHARACTER SET utf8mb4\nCOLLATE utf8mb4_general_ci;' },

        { type: 'heading', content: 'Usuwanie bazy — DROP DATABASE' },
        { type: 'text', content: 'DROP DATABASE usuwa całą bazę wraz z wszystkimi tabelami i danymi. Operacja jest nieodwracalna.' },
        { type: 'code', label: 'Usuwanie bazy:', content: '-- Usuń bazę danych:\nDROP DATABASE IF EXISTS liga_pilkarska;' },

        { type: 'heading', content: 'Typy tabel w MySQL' },
        { type: 'text', content: 'MySQL obsługuje różne silniki tabel (storage engines) z różnymi właściwościami.' },
        { type: 'table', label: 'Silniki tabel:', columns: ['Silnik', 'Opis', 'Transakcje'], rows: [['InnoDB', 'Domyślny, obsługiwuje klucze obce i transakcje', 'TAK'], ['MyISAM', 'Starszy, szybki odczyt, brak transakcji', 'NIE'], ['MEMORY', 'Dane w RAM, bardzo szybki, dane znikają po restarcie', 'NIE'], ['CSV', 'Dane w pliku CSV, łatwy import/eksport', 'NIE']] },
        { type: 'code', label: 'Tworzenie tabeli z silnikiem:', content: 'CREATE TABLE gracze (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    imie VARCHAR(100)\n) ENGINE=InnoDB;' },

        { type: 'heading', content: 'InnoDB — domyślny silnik' },
        { type: 'text', content: 'InnoDB to domyślny silnik w MySQL 5.5+. Obsługuje transakcje ACID, klucze obce i ograniczenia. Dobre dla większości aplikacji.' },
        { type: 'table', label: 'Właściwości InnoDB:', columns: ['Właściwość', 'Opis'], rows: [['Transakcje', 'Pełne wsparcie ACID'], ['Klucze obce', 'Ograniczenia referencyjne'], ['Row-level locking', 'Blokowanie na poziomie wiersza'], ['Crash recovery', 'Automatyczne odzyskiwanie po awarii']] },

        { type: 'heading', content: 'MyISAM — szybki odczyt' },
        { type: 'text', content: 'MyISAM to starszy silnik szybszy przy odczycie, ale nie obsługuje transakcji ani kluczy obcych. Dobre dla danych tylko do odczytu.' },
        { type: 'code', label: 'Tabela MyISAM:', content: 'CREATE TABLE statystyki_readonly (\n    id INT PRIMARY KEY,\n    dane TEXT\n) ENGINE=MyISAM;' },

        { type: 'hint', content: 'Dla nowych aplikacji używaj InnoDB — obsługuje transakcje i jest bezpieczniejszy. MyISAM jest przestarzały i zostanie usunięty.' },
      ],
      schema: [
        { name: 'information_schema.schemata', type: 'TABLE', desc: 'Lista baz danych' },
        { name: 'information_schema.tables', type: 'TABLE', desc: 'Lista tabel i ich silniki' },
        { name: 'gracze.id', type: 'INT', desc: 'PRIMARY KEY AUTO_INCREMENT' },
      ],
    },
    exercises: [
      { id: 1, task: 'Utwórz bazę danych "liga_pilkarska" z kodowaniem utf8mb4.', placeholder: '', hint: 'CREATE DATABASE liga_pilkarska CHARACTER SET utf8mb4;', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Wyświetl wszystkie bazy danych.', placeholder: '', hint: 'SHOW DATABASES;', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Utwórz tabelę gracze z silnikiem InnoDB.', placeholder: '', hint: 'CREATE TABLE gracze (...) ENGINE=InnoDB;', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Zmień silnik tabeli na MyISAM.', placeholder: '', hint: 'ALTER TABLE nazwa ENGINE=MyISAM;', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Usuń bazę danych.', placeholder: '', hint: 'DROP DATABASE nazwa_bazy;', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 20,
    title: 'MySQL — uprawnienia i kopie bezpieczeństwa',
    subtitle: 'GRANT, REVOKE, mysqldump, mysqlbackup',
    level: 'advanced',
    theory: {
      keywords: ['GRANT', 'REVOKE', 'CREATE USER', 'mysqldump', 'BACKUP', 'RESTORE'],
      sections: [
        { type: 'heading', content: 'Tworzenie użytkowników MySQL' },
        { type: 'text', content: 'CREATE USER tworzy użytkownika MySQL. Użytkownik ma nazwę i host (np. "user@localhost" lub "user@%").' },
        { type: 'code', label: 'Tworzenie użytkownika:', content: '-- Utwórz użytkownika z hasłem:\nCREATE USER "app_user"@"localhost" IDENTIFIED BY "TajneHaslo123!";\n\n-- Użytkownik z dostępem z dowolnego hosta:\nCREATE USER "app_user"@"%" IDENTIFIED BY "Haslo123!";' },

        { type: 'heading', content: 'Nadawanie uprawnień — GRANT' },
        { type: 'text', content: 'GRANT nadaje uprawnienia do baz danych, tabel lub procedur. Możesz nadać wszystkie uprawnienia (ALL PRIVILEGES) lub konkretne.' },
        { type: 'code', label: 'Nadawanie uprawnień:', content: '-- Wszystkie uprawnienia do bazy:\nGRANT ALL PRIVILEGES ON liga_pilkarska.* TO "app_user"@"localhost";\n\n-- Konkretne uprawnienia do tabeli:\nGRANT SELECT, INSERT ON liga_pilkarska.gracze TO "app_user"@"localhost";\n\n-- Uprawnienia do tworzenia tabel:\nGRANT CREATE ON liga_pilkarska.* TO "app_user"@"localhost";' },

        { type: 'heading', content: 'Odbieranie uprawnień — REVOKE' },
        { type: 'text', content: 'REVOKE usuwa nadane uprawnienia.' },
        { type: 'code', label: 'Odbieranie uprawnień:', content: '-- Odbierz uprawnienie DELETE:\nREVOKE DELETE ON liga_pilkarska.* FROM "app_user"@"localhost";\n\n-- Odbierz wszystkie uprawnienia:\nREVOKE ALL PRIVILEGES ON liga_pilkarska.* FROM "app_user"@"localhost";' },

        { type: 'heading', content: 'Typy uprawnień MySQL' },
        { type: 'table', label: 'Uprawnienia:', columns: ['Uprawnienie', 'Opis'], rows: [['ALL PRIVILEGES', 'Wszystkie uprawnienia'], ['SELECT', 'Czytanie danych'], ['INSERT', 'Dodawanie danych'], ['UPDATE', 'Modyfikowanie danych'], ['DELETE', 'Usuwanie danych'], ['CREATE', 'Tworzenie tabel/baz'], ['DROP', 'Usuwanie tabel/baz'], ['GRANT OPTION', 'Prawo do nadawania uprawnień innym']] },

        { type: 'heading', content: 'Backup — mysqldump' },
        { type: 'text', content: 'mysqldump tworzy kopię zapasową bazy w formacie SQL. Możesz zrobić pełną kopię lub kopię tylko wybranych tabel.' },
        { type: 'code', label: 'Backup mysqldump:', content: '-- Pełny backup bazy:\nmysqldump -u root -p liga_pilkarska > backup.sql\n\n-- Backup tylko jednej tabeli:\nmysqldump -u root -p liga_pilkarska gracze > gracze.sql\n\n-- Backup struktur bez danych:\nmysqldump -u root -p --no-data liga_pilkarska > schema.sql' },

        { type: 'heading', content: 'Backup przyrostowy — --where' },
        { type: 'text', content: 'Możesz wykonać przyrostowy backup używając klauzuli WHERE aby wyeksportować tylko nowe dane.' },
        { type: 'code', label: 'Backup przyrostowy:', content: '-- Backup tylko nowych wierszy (od ID 1000):\nmysqldump -u root -p --where="id > 1000" liga_pilkarska gracze > now_dane.sql' },

        { type: 'heading', content: 'Przywracanie — mysql' },
        { type: 'text', content: 'Przywracanie danych z pliku SQL wykonuje się przez polecenie mysql.' },
        { type: 'code', label: 'Przywracanie:', content: '-- Przywróć pełną bazę:\nmysql -u root -p liga_pilkarska < backup.sql\n\n-- Przywróć tylko jedną tabelę:\nmysql -u root -p liga_pilkarska < gracze.sql' },

        { type: 'hint', content: 'Zawsze używaj mysqldump z opcją --single-transaction dla InnoDB — zapewnia spójne kopie bez blokowania tabel.' },
      ],
      schema: [
        { name: 'mysql.user', type: 'TABLE', desc: 'Tabela użytkowników MySQL' },
        { name: 'mysql.db', type: 'TABLE', desc: 'Uprawnienia do baz danych' },
        { name: 'mysql.tables_priv', type: 'TABLE', desc: 'Uprawnienia do tabel' },
      ],
    },
    exercises: [
      { id: 1, task: 'Utwórz użytkownika MySQL "admin" z hasłem "Admin123!".', placeholder: '', hint: 'CREATE USER "admin"@"localhost" IDENTIFIED BY "Admin123!";', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Nadaj użytkownikowi wszystkie uprawnienia do bazy liga_pilkarska.', placeholder: '', hint: 'GRANT ALL PRIVILEGES ON liga_pilkarska.* TO "admin"@"localhost";', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Nadaj użytkownikowi uprawnienia SELECT i INSERT do tabeli gracze.', placeholder: '', hint: 'GRANT SELECT, INSERT ON liga_pilkarska.gracze TO "user"@"localhost";', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Utwórz pełny backup bazy danych używając mysqldump.', placeholder: '', hint: 'mysqldump -u root -p nazwa_bazy > backup.sql', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Przywróć bazę danych z pliku backup.sql.', placeholder: '', hint: 'mysql -u root -p nazwa_bazy < backup.sql', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 21,
    title: 'Optymalizacja wydajności SZBD',
    subtitle: 'Optymalizacja zapytań, indeksów i konfiguracji serwera',
    level: 'advanced',
    theory: {
      keywords: ['EXPLAIN', 'INDEX', 'QUERY PLAN', 'PERFORMANCE', 'OPTIMIZER', 'CACHE'],
      sections: [
        { type: 'heading', content: 'Czym jest optymalizacja wydajności?' },
        { type: 'text', content: 'Optymalizacja wydajności polega na przyspieszaniu zapytań i operacji bazodanowych. Obejmuje indeksowanie, optymalizację zapytań, konfigurację serwera i zarządzanie pamięcią cache.' },

        { type: 'heading', content: 'Plan wykonania — EXPLAIN' },
        { type: 'text', content: 'EXPLAIN pokazuje plan wykonania zapytania — jakie indeksy są użyte, jak są skanowane tabele, jak długo potrwa zapytanie.' },
        { type: 'code', label: 'EXPLAIN w SQL Server:', content: '-- Pokaż plan wykonania:\nSET SHOWPLAN_ALL ON;\nGO\nSELECT * FROM gracze WHERE pozycja = "napastnik";\nGO\nSET SHOWPLAN_ALL OFF;' },
        { type: 'code', label: 'EXPLAIN w MySQL:', content: '-- Pokaż plan wykonania:\nEXPLAIN SELECT * FROM gracze WHERE pozycja = "napastnik";\n\n-- Szczegółowy plan:\nEXPLAIN ANALYZE SELECT * FROM gracze WHERE id = 5;' },

        { type: 'heading', content: 'Rodzaje skanów tabel' },
        { type: 'table', label: 'Skanowanie tabel:', columns: ['Typ', 'Opis', 'Wydajność'], rows: [['Table Scan', 'Skanuje całą tabelę (brak indeksu)', 'Najwolniejszy'], ['Index Scan', 'Skanuje indeks (ale nie używa go efektywnie)', 'Wolny'], ['Index Seek', 'Szuka w indeksie (szybkie)', 'Najszybszy'], ['Clustered Index Seek', 'Szuka w indeksie skupionym', 'Najszybszy']] },
        { type: 'hint', content: 'Jeśli EXPLAIN pokazuje Table Scan, brakuje indeksu. Dodaj indeks na kolumnie używanej w WHERE.' },

        { type: 'heading', content: 'Optymalizacja indeksów' },
        { type: 'text', content: 'Indeksy drastycznie przyspieszaja zapytania, ale zuzywaja pamiec i spowalniaja INSERT/UPDATE. Kluczowe zasady: indeksuj kolumny w WHERE, JOIN i ORDER BY.' },
        { type: 'code', label: 'Strategie indeksowania:', content: '-- Indeks na kolumnie w WHERE:\nCREATE INDEX idx_pozycja ON gracze(pozycja);\n\n-- Indeks złożony (wiele kolumn):\nCREATE INDEX idx_pozycja_wartosc ON gracze(pozycja, wartosc_rynkova);\n\n-- Indeks na kolumnie JOIN:\nCREATE INDEX idx_druzyna_id ON gracze(druzyna_id);' },

        { type: 'heading', content: 'Optymalizacja zapytań' },
        { type: 'text', content: 'Dobre praktyki w pisaniu zapytan: unikaj SELECT *, uzywaj WHERE zamiast HAVING gdzie mozna, unikaj funkcji na kolumnach w WHERE.' },
        { type: 'table', label: 'Dobre praktyki:', columns: ['Zamiast', 'Uzyj'], rows: [['SELECT *', 'SELECT kolumna1, kolumna2'], ['WHERE YEAR(data) = 2026', 'WHERE data >= "2026-01-01" AND data < "2027-01-01"'], ['SELECT DISTINCT kolumna', 'unikaj jesli kolumna ma indeks UNIQUE'], ['HAVING kolumna > 10', 'WHERE kolumna > 10 (jesli nie ma agregacji)']] },

        { type: 'heading', content: 'Optymalizacja konfiguracji serwera' },
        { type: 'text', content: 'Konfiguracja serwera ma duzy wplyw na wydajnosc. Kluczowe parametry to: pamiec cache, rozmiar buforow, liczba polaczen.' },
        { type: 'code', label: 'SQL Server:', content: '-- Sprawdź aktualne ustawienia:\nEXEC sp_configure "max server memory (MB)"\nGO\nEXEC sp_configure "max degree of parallelism";\nGO\n-- Zmień ustawienia:\nEXEC sp_configure "show advanced options", 1\nRECONFIGURE\nEXEC sp_configure "max server memory (MB)", 4096\nRECONFIGURE' },
        { type: 'code', label: 'MySQL:', content: '-- Sprawdź zmienne:\nSHOW VARIABLES LIKE "innodb_buffer_pool_size";\nSHOW VARIABLES LIKE "query_cache_size";\n-- Zmień w my.cnf lub tymczasowo:\nSET GLOBAL innodb_buffer_pool_size = 1073741824;' },

        { type: 'hint', content: 'Zanim dodasz indeks, użyj EXPLAIN aby zobaczyć czy pomoże. Nadmiar indeksów spowalnia zapis danych.' },
      ],
      schema: [
        { name: 'gracze.id', type: 'INT', desc: 'PRIMARY KEY — domyślny indeks' },
        { name: 'gracze.pozycja', type: 'VARCHAR', desc: 'Kandydatka na indeks (używana w WHERE)' },
        { name: 'gracze.druzyna_id', type: 'INT', desc: 'FOREIGN KEY — powinna mieć indeks' },
      ],
    },
    exercises: [
      { id: 1, task: 'Uzyj EXPLAIN aby zobaczyc plan wykonania zapytania.', placeholder: '', hint: 'EXPLAIN SELECT * FROM gracze WHERE pozycja = "napastnik"', expectedColumns: [], expectedRows: [] },
      { id: 2, task: 'Dodaj indeks na kolumnie pozycja w tabeli gracze.', placeholder: '', hint: 'CREATE INDEX idx_pozycja ON gracze(pozycja)', expectedColumns: [], expectedRows: [] },
      { id: 3, task: 'Zamien SELECT * na konkretne kolumny w zapytaniu.', placeholder: '', hint: 'SELECT id, imie, nazwisko FROM gracze zamiast SELECT *', expectedColumns: [], expectedRows: [] },
      { id: 4, task: 'Dodac indeks zlozony na kolumnach pozycja i wartosc_rynkowa.', placeholder: '', hint: 'CREATE INDEX idx_pozycja_wartosc ON gracze(pozycja, wartosc_rynkova)', expectedColumns: [], expectedRows: [] },
      { id: 5, task: 'Sprawdz rozmiar pamieci cache w MySQL.', placeholder: '', hint: 'SHOW VARIABLES LIKE "innodb_buffer_pool_size";', expectedColumns: [], expectedRows: [] },
    ],
  },
]

export default LESSONS
