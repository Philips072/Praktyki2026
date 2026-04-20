import { useNavigate } from 'react-router-dom';
import './Lectures.css';
import LESSONS from '../data/lessonsData';
import { useAuth } from '../AuthContext';

// Funkcja do pobierania postępu lekcji z localStorage
const getLessonProgress = (lessonId, userId) => {
  const progressKey = `lesson_progress_${userId}`;
  const data = JSON.parse(localStorage.getItem(progressKey) || '{}');
  const completedExerciseIds = data[lessonId] || [];
  const lesson = LESSONS.find(l => l.id === lessonId);
  const totalExercises = lesson?.exercises?.length || 0;
  const completedExercises = completedExerciseIds.length;

  return { completed: completedExercises, total: totalExercises };
};

// Sprawdza czy lekcja jest ukończona (wszystkie zadania)
const isLessonCompleted = (progress) => {
  return progress.total > 0 && progress.completed === progress.total;
};

function Lectures() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="lectures-page">
      <div className="lectures-header">
        <h1 className="lectures-title">Lekcje SQL</h1>
        <p className="lectures-subtitle">Ucz się baz danych na personalizowanych przykładach</p>
      </div>

      <div className="lectures-list">
        {LESSONS.map((lesson) => {
          const progress = getLessonProgress(lesson.id, user?.id);
          const isDone = isLessonCompleted(progress);
          const progressPercent = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

          return (
            <div key={lesson.id} className={`lecture-card ${isDone ? 'lecture-card--done' : ''}`}>
              <div className="lecture-card-inner">
                <div className={`lecture-badge ${isDone ? 'lecture-badge--done' : ''}`}>
                  <span className="lecture-badge-num">{lesson.id}</span>
                </div>
                <div className="lecture-content">
                  <div className="lecture-top-row">
                    <h2 className="lecture-title">{lesson.title}</h2>
                    <span className="lecture-progress-text">
                      {progress.total > 0 ? `${progress.completed}/${progress.total}` : '0/0'}
                    </span>
                  </div>

                  <p className="lecture-desc">{lesson.subtitle}</p>

                  <div className="lecture-progress-bar">
                    <div
                      className="lecture-progress-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <button
                    className={`lecture-button ${isDone ? 'lecture-button--done' : ''}`}
                    onClick={() => navigate(`/lekcja/${lesson.id}`)}
                  >
                    {isDone ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.25 2.5L4.75 10L1.75 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Zakończono
                      </>
                    ) : (
                      <>
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L11 7L1 13V1Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        </svg>
                        Rozpocznij
                      </>
                    )}
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