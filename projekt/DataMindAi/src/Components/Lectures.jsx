import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Lectures.css';
import LESSONS from '../data/lessonsData';
import { useAuth } from '../AuthContext';

const descriptions = {
  1:  'Czym jest SQL i baza danych? Poznaj strukturę tabel, wierszy i kolumn.',
  2:  'Tworzenie tabel i baz danych — definiowanie kolumn i typów danych.',
  3:  'Dodawanie nowych rekordów do tabel.',
  4:  'Modyfikowanie istniejących danych w tabelach.',
  5:  'Usuwanie rekordów z tabeli oraz całych tabel z bazy danych.',
  6:  'Zmiana struktury istniejącej tabeli — dodawanie, usuwanie i modyfikacja kolumn.',
  7:  'Pobieranie danych z tabel — filtrowanie za pomocą WHERE.',
  8:  'Funkcje agregujące do obliczania statystyk na zbiorach danych.',
  9:  'Sortowanie, grupowanie i filtrowanie grup wyników oraz aliasy.',
  10: 'Operatory i warunki do precyzyjnego filtrowania zapytań.',
  11: 'INNER JOIN, LEFT JOIN, RIGHT JOIN i FULL JOIN — łączenie danych z wielu tabel.',
  12: 'Podzapytania — SELECT wewnątrz SELECT do zaawansowanej analizy danych.',
};

function getProgress(lessonId, userId) {
  const data = JSON.parse(localStorage.getItem(`lesson_progress_${userId}`) || '{}');
  return (data[lessonId] || []).length;
}

function Lectures() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const onStorage = () => forceUpdate(n => n + 1);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="lectures-page">
      <div className="lectures-header">
        <h1 className="lectures-title">Lekcje SQL</h1>
        <p className="lectures-subtitle">Ucz się baz danych na personalizowanych przykładach</p>
      </div>

      <div className="lectures-list">
        {LESSONS.map((lesson) => {
          const total = lesson.exercises.length;
          const done = getProgress(lesson.id, user?.id);
          const percent = total > 0 ? Math.round((done / total) * 100) : 0;
          const finished = total > 0 && done === total;

          return (
            <div key={lesson.id} className={`lecture-card${finished ? ' lecture-card--done' : ''}`}>
              <div className="lecture-card-inner">
                <div className="lecture-badge">
                  <span className="lecture-badge-num">{lesson.id}</span>
                </div>
                <div className="lecture-content">
                  <div className="lecture-top-row">
                    <h2 className="lecture-title">{lesson.title}</h2>
                    {total > 0 && (
                      <span className="lecture-progress-text">{done}/{total} zadań</span>
                    )}
                  </div>
                  <p className="lecture-desc">{descriptions[lesson.id]}</p>
                  {total > 0 && (
                    <div className="lecture-progress-bar">
                      <div className="lecture-progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                  )}
                  <button className="lecture-button" onClick={() => navigate(`/lekcja/${lesson.id}`)}>
                    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                      <path d="M1 1L11 7L1 13V1Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                    {finished ? 'Powtórz' : done > 0 ? 'Kontynuuj' : 'Rozpocznij'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Lectures;