import { useNavigate } from 'react-router-dom';
import './Lectures.css';

const lessons = [
  { id: 1, title: 'Podstawy SELECT', description: 'Pobieranie danych z tabel gracze i drużyny' },
  { id: 2, title: 'Filtrowanie WHERE', description: 'Wyszukiwanie zawodników według pozycji i narodowości' },
  { id: 3, title: 'Sortowanie ORDER BY', description: 'Ranking strzelców w sezonie 2025/2026' },
  { id: 4, title: 'Łączenie tabel JOIN', description: 'Połącz dane graczy z ich statystykami' },
  { id: 5, title: 'Grupowanie GROUP BY', description: 'Agregacja danych - bramki według drużyn' },
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
              <button className="lecture-button" onClick={() => navigate(`/lesson/${lesson.id}`)}>
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L11 7L1 13V1Z" fill="#fcf6f3" stroke="#fcf6f3" strokeWidth="1.5" strokeLinejoin="round"/>
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