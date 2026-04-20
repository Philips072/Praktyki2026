import { useNavigate } from 'react-router-dom';
import './Lectures.css';

const lessons = [
  { id: 1,  title: 'Język DDL — tworzenie i usuwanie tabel',              description: 'Poznaj instrukcje CREATE DATABASE i CREATE TABLE. Naucz się definiować kolumny z typami danych: INT, TEXT, VARCHAR i innymi.' },
  { id: 2,  title: 'ALTER TABLE — zmiana struktury tabeli',                description: 'Dowiedz się jak modyfikować istniejące tabele: dodawać i usuwać kolumny oraz zmieniać ich typ i właściwości.' },
  { id: 3,  title: 'Atrybuty kolumn',                                      description: 'Poznaj kluczowe atrybuty kolumn: PRIMARY KEY, NOT NULL, AUTO_INCREMENT, UNIQUE oraz CHECK — jak i kiedy ich używać.' },
  { id: 4,  title: 'Język DML — INSERT, UPDATE, DELETE',                  description: 'Naucz się manipulować danymi: wstawiać nowe rekordy (INSERT), aktualizować istniejące (UPDATE) i usuwać (DELETE).' },
  { id: 5,  title: 'SELECT — podstawy pobierania danych',                  description: 'Pobieraj dane z tabel za pomocą SELECT. Filtruj wyniki klauzulą WHERE i poznaj podstawową składnię zapytań.' },
  { id: 6,  title: 'GROUP BY, HAVING, ORDER BY, DISTINCT, TOP',           description: 'Sortuj wyniki ORDER BY, grupuj GROUP BY, filtruj grupy HAVING oraz eliminuj duplikaty DISTINCT i ogranicz wyniki TOP.' },
  { id: 7,  title: 'Łączenie tabel — JOIN',                               description: 'Łącz dane z wielu tabel: INNER JOIN, LEFT/RIGHT/FULL OUTER JOIN oraz złączenie tabeli z samą sobą (self join).' },
  { id: 8,  title: 'Więzy integralności — klucz obcy',                    description: 'Definiuj relacje między tabelami kluczem obcym. Poznaj kaskadowe usuwanie i aktualizowanie: CASCADE, SET NULL, SET DEFAULT.' },
  { id: 9,  title: 'Łączenie wyników — UNION, INTERSECT, EXCEPT',         description: 'Łącz wyniki wielu zapytań instrukcją UNION, znajdź część wspólną INTERSECT i wyodrębnij różnicę EXCEPT.' },
  { id: 10, title: 'Podzapytania',                                         description: 'Zagnieżdżaj zapytania SELECT wewnątrz innych zapytań. Używaj operatorów EXISTS, IN, ANY, ALL oraz podzapytań w klauzulach WHERE i FROM.' },
  { id: 11, title: 'Widoki i indeksy',                                     description: 'Twórz i modyfikuj widoki (CREATE VIEW) jako wirtualne tabele oraz indeksy (CREATE INDEX) dla szybszego wyszukiwania danych.' },
  { id: 12, title: 'Transakcje i współbieżność',                          description: 'Poznaj właściwości ACID transakcji, tryby EXPLICIT i AUTOCOMMIT oraz mechanizmy blokowania danych i poziomy izolacji.' },
  { id: 13, title: 'Transact-SQL (T-SQL)',                                 description: 'Programowanie w T-SQL: zmienne systemowe, instrukcje warunkowe IF, wyrażenia CASE, CTE, procedury i funkcje składowane.' },
  { id: 14, title: 'Wyzwalacze (Triggers)',                                description: 'Twórz wyzwalacze DML (AFTER, INSTEAD OF) i DDL reagujące na zmiany w bazie danych oraz zarządzaj uprawnieniami.' },
  { id: 15, title: 'Administrowanie MS SQL Server',                        description: 'Tryby uwierzytelniania, tworzenie loginów (CREATE LOGIN), zarządzanie bazami systemowymi: master, model, tempdb, msdb.' },
  { id: 16, title: 'Role i uprawnienia',                                   description: 'Zarządzaj dostępem do serwera: role serwerowe (sysadmin, dbcreator), bazodanowe (db_owner) oraz uprawnienia GRANT, REVOKE, DENY.' },
  { id: 17, title: 'Kopie bezpieczeństwa i przywracanie',                 description: 'Twórz kopie bezpieczeństwa bazy danych, sprawdzaj spójność oraz przywracaj dane z kopii zapasowej.' },
  { id: 18, title: 'Import i eksport danych',                              description: 'Przenoś dane między systemami — eksportuj dane z bazy i importuj zewnętrzne zbiory danych do tabel.' },
  { id: 19, title: 'MySQL — konfiguracja i zarządzanie',                  description: 'Konfiguruj serwer MySQL, zarządzaj bazami CREATE/ALTER DATABASE i poznaj typy tabel: InnoDB, MyISAM, MEMORY i inne.' },
  { id: 20, title: 'MySQL — uprawnienia i kopie bezpieczeństwa',          description: 'Nadawaj i odbieraj prawa dostępu w MySQL, twórz pełne i przyrostowe kopie danych (mysqldump) oraz odzyskuj dane.' },
  { id: 21, title: 'Optymalizacja wydajności SZBD',                       description: 'Poprawiaj wydajność systemu bazodanowego: optymalizacja zapytań, indeksów, konfiguracji serwera SQL i MySQL.' },
];

function Lectures() {
  const navigate = useNavigate();

  return (
    <div className="lectures-page">
      <div className="lectures-header">
        <h1 className="lectures-title">Lekcje SQL</h1>
        <p className="lectures-subtitle">Ucz się baz danych na personalizowanych przykładach</p>
      </div>

      <div className="lectures-list">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="lecture-card">
            <div className="lecture-card-inner">
              <div className="lecture-badge">{lesson.id}</div>
              <div className="lecture-content">
                <h2 className="lecture-title">{lesson.title}</h2>
                <p className="lecture-desc">{lesson.description}</p>
                <button className="lecture-button" onClick={() => navigate(`/lekcja/${lesson.id}`)}>
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L11 7L1 13V1Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                  Rozpocznij
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lectures;