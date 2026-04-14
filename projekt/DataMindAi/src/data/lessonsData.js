// Placeholder — treść do uzupełnienia

const LESSONS = [
  {
    id: 1,
    title: 'Wprowadzenie',
    subtitle: 'Czym jest SQL i jak działa baza danych?',
    level: 'beginner',
    theory: {
      keywords: ['SQL', 'DATABASE', 'TABLE', 'ROW', 'COLUMN'],
      sections: [
        { type: 'heading', content: 'Czym jest SQL?' },
        { type: 'text', content: 'SQL (Structured Query Language) to język służący do komunikacji z relacyjnymi bazami danych. Pozwala na pobieranie, dodawanie, modyfikowanie i usuwanie danych.' },
        { type: 'code', label: 'Przykład prostego zapytania:', content: '-- To jest komentarz\nSELECT * FROM gracze;' },
        { type: 'heading', content: 'Czym jest tabela?' },
        { type: 'text', content: 'Baza danych przechowuje dane w tabelach — podobnie jak arkusz kalkulacyjny. Każda tabela ma kolumny (pola) i wiersze (rekordy).' },
        { type: 'table', label: 'Przykładowa tabela gracze:', columns: ['id', 'imie', 'nazwisko', 'pozycja'], rows: [['1', 'Robert', 'Lewandowski', 'napastnik'], ['2', 'Kevin', 'De Bruyne', 'pomocnik']] },
        { type: 'hint', content: 'Każda tabela musi mieć unikalny identyfikator (klucz główny) — zazwyczaj kolumnę o nazwie id.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator gracza' },
        { name: 'imie', type: 'TEXT', desc: 'Imię gracza' },
        { name: 'nazwisko', type: 'TEXT', desc: 'Nazwisko gracza' },
        { name: 'pozycja', type: 'TEXT', desc: 'Pozycja na boisku' },
      ],
    },
    exercises: [
      { id: 1, task: '[Placeholder] Wyświetl wszystkie dane z tabeli gracze.', placeholder: 'SELECT ...', hint: 'Użyj * żeby wybrać wszystkie kolumny.', expectedColumns: ['id', 'imie', 'nazwisko', 'pozycja'], expectedRows: [['1', 'Robert', 'Lewandowski', 'napastnik'], ['2', 'Kevin', 'De Bruyne', 'pomocnik']] },
      { id: 2, task: '[Placeholder] Wyświetl tylko imię i nazwisko graczy.', placeholder: 'SELECT ...', hint: 'Wypisz nazwy kolumn po przecinku.', expectedColumns: ['imie', 'nazwisko'], expectedRows: [['Robert', 'Lewandowski'], ['Kevin', 'De Bruyne']] },
    ],
  },
  {
    id: 2,
    title: 'CREATE',
    subtitle: 'Tworzenie tabel i baz danych',
    level: 'beginner',
    theory: {
      keywords: ['CREATE', 'TABLE', 'DATABASE', 'INTEGER', 'TEXT', 'NOT NULL'],
      sections: [
        { type: 'heading', content: 'Polecenie CREATE TABLE' },
        { type: 'text', content: '[Placeholder] Opis polecenia CREATE TABLE — jak definiować kolumny i typy danych.' },
        { type: 'code', label: 'Składnia:', content: 'CREATE TABLE nazwa_tabeli (\n    id      INTEGER PRIMARY KEY,\n    kolumna TEXT    NOT NULL\n);' },
        { type: 'hint', content: '[Placeholder] Wskazówka dotycząca tworzenia tabel.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Klucz główny — PRIMARY KEY' },
        { name: 'nazwa', type: 'TEXT', desc: 'Przykładowa kolumna tekstowa' },
      ],
    },
    exercises: [
      { id: 1, task: '[Placeholder] Utwórz tabelę produkty z kolumnami id i nazwa.', placeholder: 'CREATE TABLE ...', hint: '[Placeholder] Wskazówka.', expectedColumns: [], expectedRows: [] },
      { id: 2, task: '[Placeholder] Utwórz tabelę klienci z trzema kolumnami.', placeholder: 'CREATE TABLE ...', hint: '[Placeholder] Wskazówka.', expectedColumns: [], expectedRows: [] },
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
        { type: 'text', content: '[Placeholder] Opis polecenia INSERT INTO — jak dodawać nowe wiersze do tabeli.' },
        { type: 'code', label: 'Składnia:', content: 'INSERT INTO nazwa_tabeli (kolumna1, kolumna2)\nVALUES (\'wartość1\', \'wartość2\');' },
        { type: 'hint', content: '[Placeholder] Wskazówka dotycząca wstawiania danych.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator' },
        { name: 'imie', type: 'TEXT', desc: 'Imię gracza' },
        { name: 'pozycja', type: 'TEXT', desc: 'Pozycja na boisku' },
      ],
    },
    exercises: [
      { id: 1, task: '[Placeholder] Dodaj nowego gracza do tabeli.', placeholder: 'INSERT INTO ...', hint: '[Placeholder] Wskazówka.', expectedColumns: [], expectedRows: [] },
      { id: 2, task: '[Placeholder] Dodaj dwa rekordy jednym zapytaniem.', placeholder: 'INSERT INTO ...', hint: '[Placeholder] Wskazówka.', expectedColumns: [], expectedRows: [] },
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
        { type: 'text', content: '[Placeholder] Opis polecenia UPDATE — jak modyfikować istniejące rekordy.' },
        { type: 'code', label: 'Składnia:', content: 'UPDATE nazwa_tabeli\nSET kolumna = \'nowa_wartość\'\nWHERE warunek;' },
        { type: 'hint', content: '[Placeholder] Zawsze używaj WHERE — bez niego zmienisz wszystkie wiersze!' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator' },
        { name: 'imie', type: 'TEXT', desc: 'Imię gracza' },
        { name: 'wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
      ],
    },
    exercises: [
      { id: 1, task: '[Placeholder] Zaktualizuj wartość rynkową wybranego gracza.', placeholder: 'UPDATE ...', hint: '[Placeholder] Wskazówka.', expectedColumns: [], expectedRows: [] },
      { id: 2, task: '[Placeholder] Zmień pozycję gracza o id = 3.', placeholder: 'UPDATE ...', hint: '[Placeholder] Wskazówka.', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 5,
    title: 'DELETE, DROP',
    subtitle: 'Usuwanie rekordów i tabel',
    level: 'beginner',
    theory: {
      keywords: ['DELETE', 'DROP', 'FROM', 'WHERE', 'TABLE'],
      sections: [
        { type: 'heading', content: 'Polecenie DELETE' },
        { type: 'text', content: '[Placeholder] Opis polecenia DELETE — usuwanie wybranych rekordów z tabeli.' },
        { type: 'code', label: 'Składnia DELETE:', content: 'DELETE FROM nazwa_tabeli\nWHERE warunek;' },
        { type: 'heading', content: 'Polecenie DROP TABLE' },
        { type: 'text', content: '[Placeholder] Opis polecenia DROP TABLE — usuwanie całej tabeli z bazy.' },
        { type: 'code', label: 'Składnia DROP:', content: 'DROP TABLE nazwa_tabeli;' },
        { type: 'hint', content: '[Placeholder] DROP TABLE usuwa tabelę nieodwracalnie — używaj ostrożnie!' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator' },
        { name: 'imie', type: 'TEXT', desc: 'Imię gracza' },
      ],
    },
    exercises: [
      { id: 1, task: '[Placeholder] Usuń gracza o id = 5 z tabeli.', placeholder: 'DELETE FROM ...', hint: '[Placeholder] Wskazówka.', expectedColumns: [], expectedRows: [] },
      { id: 2, task: '[Placeholder] Usuń wszystkich graczy z pozycją bramkarz.', placeholder: 'DELETE FROM ...', hint: '[Placeholder] Wskazówka.', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 6,
    title: 'ALTER TABLE',
    subtitle: 'Zmiana struktury istniejących tabel',
    level: 'intermediate',
    theory: {
      keywords: ['ALTER', 'TABLE', 'ADD', 'DROP', 'COLUMN', 'MODIFY'],
      sections: [
        { type: 'heading', content: 'Polecenie ALTER TABLE' },
        { type: 'text', content: '[Placeholder] Opis polecenia ALTER TABLE — modyfikowanie struktury tabeli po jej utworzeniu.' },
        { type: 'code', label: 'Dodanie kolumny:', content: 'ALTER TABLE gracze\nADD COLUMN wiek INTEGER;' },
        { type: 'code', label: 'Usunięcie kolumny:', content: 'ALTER TABLE gracze\nDROP COLUMN wiek;' },
        { type: 'hint', content: '[Placeholder] Wskazówka dotycząca ALTER TABLE.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator' },
        { name: 'imie', type: 'TEXT', desc: 'Imię gracza' },
        { name: 'wiek', type: 'INTEGER', desc: 'Wiek gracza (nowa kolumna)' },
      ],
    },
    exercises: [
      { id: 1, task: '[Placeholder] Dodaj kolumnę email do tabeli gracze.', placeholder: 'ALTER TABLE ...', hint: '[Placeholder] Wskazówka.', expectedColumns: [], expectedRows: [] },
      { id: 2, task: '[Placeholder] Usuń kolumnę pozycja z tabeli.', placeholder: 'ALTER TABLE ...', hint: '[Placeholder] Wskazówka.', expectedColumns: [], expectedRows: [] },
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
        { type: 'text', content: 'SELECT to podstawowe polecenie SQL służące do pobierania danych z bazy. To jak zadanie pytania bazie: "Pokaż mi te informacje".' },
        { type: 'code', label: 'Podstawowa składnia:', content: 'SELECT kolumna1, kolumna2\nFROM nazwa_tabeli;' },
        { type: 'heading', content: 'Przykład z piłką nożną:' },
        { type: 'text', content: 'Wyobraź sobie tabelę gracze z informacjami o piłkarzach:' },
        { type: 'table', label: '', columns: ['imie', 'nazwisko', 'pozycja', 'wartosc_rynkowa'], rows: [['Robert', 'Lewandowski', 'napastnik', '45'], ['Kevin', 'De Bruyne', 'pomocnik', '80']] },
        { type: 'hint', content: 'Używaj SELECT * żeby pobrać wszystkie kolumny, lub wypisz konkretne nazwy kolumn po przecinku żeby pobrać tylko wybrane dane.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator gracza' },
        { name: 'imie', type: 'TEXT', desc: 'Imię gracza' },
        { name: 'nazwisko', type: 'TEXT', desc: 'Nazwisko gracza' },
        { name: 'data_urodzenia', type: 'DATE', desc: 'Data urodzenia' },
        { name: 'narodowosc', type: 'TEXT', desc: 'Narodowość gracza' },
        { name: 'pozycja', type: 'TEXT', desc: 'Pozycja na boisku (napastnik, pomocnik, obrońca, bramkarz)' },
        { name: 'druzyna_id', type: 'INTEGER', desc: 'ID drużyny gracza' },
        { name: 'wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
      ],
    },
    exercises: [
      { id: 1, task: 'Wyświetl imiona i nazwiska wszystkich graczy.', placeholder: 'SELECT ...', hint: 'Wypisz nazwy kolumn: imie, nazwisko po słowie SELECT.', expectedColumns: ['imie', 'nazwisko'], expectedRows: [['Robert', 'Lewandowski'], ['Kevin', 'De Bruyne']] },
      { id: 2, task: 'Wyświetl wszystkich graczy, których pozycja to "napastnik".', placeholder: 'SELECT ...', hint: 'Użyj klauzuli WHERE pozycja = \'napastnik\'', expectedColumns: ['imie', 'nazwisko', 'pozycja'], expectedRows: [['Robert', 'Lewandowski', 'napastnik']] },
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
        { type: 'heading', content: 'Funkcje agregujące' },
        { type: 'text', content: '[Placeholder] Opis funkcji agregujących — obliczanie statystyk na zbiorach danych.' },
        { type: 'code', label: 'Przykłady:', content: 'SELECT COUNT(*) FROM gracze;\nSELECT AVG(wartosc_rynkowa) FROM gracze;\nSELECT MAX(wartosc_rynkowa) FROM gracze;\nSELECT MIN(wartosc_rynkowa) FROM gracze;\nSELECT SUM(wartosc_rynkowa) FROM gracze;' },
        { type: 'hint', content: '[Placeholder] Wskazówka dotycząca funkcji agregujących.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator' },
        { name: 'imie', type: 'TEXT', desc: 'Imię gracza' },
        { name: 'wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
        { name: 'bramki', type: 'INTEGER', desc: 'Liczba strzelonych bramek' },
      ],
    },
    exercises: [
      { id: 1, task: '[Placeholder] Oblicz średnią wartość rynkową graczy.', placeholder: 'SELECT AVG(...)', hint: '[Placeholder] Wskazówka.', expectedColumns: ['avg'], expectedRows: [['62.5']] },
      { id: 2, task: '[Placeholder] Znajdź gracza z najwyższą wartością rynkową.', placeholder: 'SELECT MAX(...)', hint: '[Placeholder] Wskazówka.', expectedColumns: ['max'], expectedRows: [['80']] },
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
        { type: 'heading', content: 'Sortowanie — ORDER BY' },
        { type: 'text', content: '[Placeholder] Opis ORDER BY — sortowanie wyników rosnąco (ASC) i malejąco (DESC).' },
        { type: 'code', label: 'Składnia:', content: 'SELECT imie, wartosc_rynkowa\nFROM gracze\nORDER BY wartosc_rynkowa DESC;' },
        { type: 'heading', content: 'Grupowanie — GROUP BY i HAVING' },
        { type: 'text', content: '[Placeholder] Opis GROUP BY i HAVING — grupowanie wyników i filtrowanie grup.' },
        { type: 'code', label: 'Składnia:', content: 'SELECT pozycja, COUNT(*) AS liczba\nFROM gracze\nGROUP BY pozycja\nHAVING COUNT(*) > 2;' },
        { type: 'hint', content: '[Placeholder] HAVING działa jak WHERE, ale dla grup.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator' },
        { name: 'pozycja', type: 'TEXT', desc: 'Pozycja na boisku' },
        { name: 'wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
      ],
    },
    exercises: [
      { id: 1, task: '[Placeholder] Wyświetl graczy posortowanych malejąco według wartości rynkowej.', placeholder: 'SELECT ...', hint: '[Placeholder] Wskazówka.', expectedColumns: ['imie', 'wartosc_rynkowa'], expectedRows: [] },
      { id: 2, task: '[Placeholder] Policz graczy na każdej pozycji.', placeholder: 'SELECT ...', hint: '[Placeholder] Wskazówka.', expectedColumns: ['pozycja', 'liczba'], expectedRows: [] },
    ],
  },
  {
    id: 10,
    title: 'BETWEEN, DISTINCT, EXISTS, IN, NOT, LIKE, AND, OR',
    subtitle: 'Operatory i warunki filtrowania',
    level: 'intermediate',
    theory: {
      keywords: ['BETWEEN', 'DISTINCT', 'EXISTS', 'IN', 'NOT', 'LIKE', 'AND', 'OR'],
      sections: [
        { type: 'heading', content: 'Operator BETWEEN' },
        { type: 'text', content: '[Placeholder] Opis BETWEEN — filtrowanie wartości w podanym zakresie.' },
        { type: 'code', label: 'Przykład:', content: 'SELECT * FROM gracze\nWHERE wartosc_rynkowa BETWEEN 20 AND 60;' },
        { type: 'heading', content: 'Operator LIKE' },
        { type: 'text', content: '[Placeholder] Opis LIKE — wyszukiwanie tekstowe z użyciem wzorców.' },
        { type: 'code', label: 'Przykład:', content: "SELECT * FROM gracze\nWHERE nazwisko LIKE 'L%';" },
        { type: 'hint', content: '[Placeholder] % zastępuje dowolny ciąg znaków, _ zastępuje jeden znak.' },
      ],
      schema: [
        { name: 'id', type: 'INTEGER', desc: 'Unikalny identyfikator' },
        { name: 'imie', type: 'TEXT', desc: 'Imię gracza' },
        { name: 'nazwisko', type: 'TEXT', desc: 'Nazwisko gracza' },
        { name: 'wartosc_rynkowa', type: 'INTEGER', desc: 'Wartość w milionach EUR' },
      ],
    },
    exercises: [
      { id: 1, task: '[Placeholder] Wyświetl graczy z wartością rynkową między 30 a 70 milionów.', placeholder: 'SELECT ...', hint: '[Placeholder] Wskazówka.', expectedColumns: [], expectedRows: [] },
      { id: 2, task: "[Placeholder] Znajdź graczy, których nazwisko zaczyna się na literę 'L'.", placeholder: 'SELECT ...', hint: '[Placeholder] Wskazówka.', expectedColumns: [], expectedRows: [] },
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
        { type: 'text', content: '[Placeholder] Opis JOIN — łączenie danych z dwóch lub więcej tabel na podstawie wspólnej kolumny.' },
        { type: 'code', label: 'INNER JOIN:', content: 'SELECT g.imie, d.nazwa\nFROM gracze g\nINNER JOIN druzyny d ON g.druzyna_id = d.id;' },
        { type: 'code', label: 'LEFT JOIN:', content: 'SELECT g.imie, d.nazwa\nFROM gracze g\nLEFT JOIN druzyny d ON g.druzyna_id = d.id;' },
        { type: 'hint', content: '[Placeholder] INNER JOIN zwraca tylko pasujące wiersze, LEFT JOIN zwraca wszystkie wiersze z lewej tabeli.' },
      ],
      schema: [
        { name: 'gracze.id', type: 'INTEGER', desc: 'ID gracza' },
        { name: 'gracze.druzyna_id', type: 'INTEGER', desc: 'Klucz obcy do tabeli druzyny' },
        { name: 'druzyny.id', type: 'INTEGER', desc: 'ID drużyny (klucz główny)' },
        { name: 'druzyny.nazwa', type: 'TEXT', desc: 'Nazwa drużyny' },
      ],
    },
    exercises: [
      { id: 1, task: '[Placeholder] Wyświetl imiona graczy wraz z nazwami ich drużyn.', placeholder: 'SELECT ...', hint: '[Placeholder] Wskazówka.', expectedColumns: ['imie', 'nazwa_druzyny'], expectedRows: [] },
      { id: 2, task: '[Placeholder] Wyświetl wszystkich graczy, nawet tych bez przypisanej drużyny.', placeholder: 'SELECT ...', hint: '[Placeholder] Wskazówka.', expectedColumns: [], expectedRows: [] },
    ],
  },
  {
    id: 12,
    title: 'Zapytania zagnieżdżone',
    subtitle: 'SELECT wewnątrz SELECT — zaawansowana analiza danych',
    level: 'advanced',
    theory: {
      keywords: ['SELECT', 'WHERE', 'IN', 'EXISTS', 'SUBQUERY'],
      sections: [
        { type: 'heading', content: 'Czym są podzapytania?' },
        { type: 'text', content: '[Placeholder] Opis podzapytań — zapytania SELECT zagnieżdżone wewnątrz innych zapytań.' },
        { type: 'code', label: 'Przykład z IN:', content: 'SELECT imie, nazwisko\nFROM gracze\nWHERE druzyna_id IN (\n    SELECT id FROM druzyny\n    WHERE kraj = \'Polska\'\n);' },
        { type: 'code', label: 'Przykład z EXISTS:', content: 'SELECT imie\nFROM gracze g\nWHERE EXISTS (\n    SELECT 1 FROM statystyki s\n    WHERE s.gracz_id = g.id\n    AND s.bramki > 10\n);' },
        { type: 'hint', content: '[Placeholder] Podzapytania mogą być używane w SELECT, FROM i WHERE.' },
      ],
      schema: [
        { name: 'gracze.id', type: 'INTEGER', desc: 'ID gracza' },
        { name: 'gracze.druzyna_id', type: 'INTEGER', desc: 'Klucz obcy do druzyny' },
        { name: 'statystyki.gracz_id', type: 'INTEGER', desc: 'Klucz obcy do gracze' },
        { name: 'statystyki.bramki', type: 'INTEGER', desc: 'Liczba bramek w sezonie' },
      ],
    },
    exercises: [
      { id: 1, task: '[Placeholder] Wyświetl graczy z drużyn z Polski używając podzapytania.', placeholder: 'SELECT ...', hint: '[Placeholder] Wskazówka.', expectedColumns: [], expectedRows: [] },
      { id: 2, task: '[Placeholder] Znajdź graczy, którzy strzelili więcej goli niż średnia.', placeholder: 'SELECT ...', hint: '[Placeholder] Wskazówka.', expectedColumns: [], expectedRows: [] },
    ],
  },
]

export default LESSONS
