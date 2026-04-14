import { useNavigate } from 'react-router-dom';
import './Lectures.css';

const lessons = [
  { id: 1,  title: 'Wprowadzenie',                                          description: 'Czym jest SQL i baza danych? Poznaj strukturę tabel, wierszy i kolumn.' },
  { id: 2,  title: 'CREATE',                                                description: 'Tworzenie tabel i baz danych — definiowanie kolumn i typów danych.' },
  { id: 3,  title: 'INSERT',                                                description: 'Dodawanie nowych rekordów do tabel.' },
  { id: 4,  title: 'UPDATE',                                                description: 'Modyfikowanie istniejących danych w tabelach.' },
  { id: 5,  title: 'DELETE, DROP',                                          description: 'Usuwanie rekordów z tabeli oraz całych tabel z bazy danych.' },
  { id: 6,  title: 'ALTER TABLE',                                           description: 'Zmiana struktury istniejącej tabeli — dodawanie, usuwanie i modyfikacja kolumn.' },
  { id: 7,  title: 'SELECT',                                                description: 'Pobieranie danych z tabel — filtrowanie za pomocą WHERE.' },
  { id: 8,  title: 'AVG, MIN, MAX, SUM, COUNT',                            description: 'Funkcje agregujące do obliczania statystyk na zbiorach danych.' },
  { id: 9,  title: 'ORDER BY, GROUP BY, HAVING, AS',                       description: 'Sortowanie, grupowanie i filtrowanie grup wyników oraz aliasy.' },
  { id: 10, title: 'BETWEEN, DISTINCT, EXISTS, IN, NOT, LIKE, AND, OR',    description: 'Operatory i warunki do precyzyjnego filtrowania zapytań.' },
  { id: 11, title: 'Łączenie tabel',                                        description: 'INNER JOIN, LEFT JOIN, RIGHT JOIN i FULL JOIN — łączenie danych z wielu tabel.' },
  { id: 12, title: 'Zapytania zagnieżdżone',                               description: 'Podzapytania — SELECT wewnątrz SELECT do zaawansowanej analizy danych.' },
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