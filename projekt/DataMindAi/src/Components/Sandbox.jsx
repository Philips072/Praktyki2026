import './Sandbox.css'
import { useState } from 'react'

function Sandbox() {


const [query, setQuery] = useState('');
  const [resultsView, setResultsView] = useState('structure');

  const stats = [
    { label: 'Tabele', value: '42', description: 'w bazie danych', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>' },
    { label: 'Wiersze', value: '128.8K', description: 'łączna liczba', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>' },
    { label: 'Zapytania', value: '1.2K', description: 'wykonane dziś', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>' },
    { label: 'Ostatnie odświeżenie', value: '2 min temu', description: 'dzisiaj, 14:26', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
  ];

  const examples = [
    'SELECT * FROM users LIMIT 10;',
    'SELECT COUNT(*) FROM orders;',
    'SELECT * FROM products WHERE price > 100;'
  ];

  return (
    <div className="sandbox-page">
      <h1>Sandbox Bazy Danych</h1>
      <p className="subtitle">Przeglądaj swoje bazy danych, tabele i dane w środowisku Supabase</p>

      <div className="sandbox-stats-grid">
        {stats.map((item, i) => (
          <div className="sandbox-card sandbox-stat-card" key={i}>
            <div className="sandbox-stat-icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
            <div>
              <span className="sandbox-stat-label">{item.label}</span>
              <strong>{item.value}</strong>
              <span>{item.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="sandbox-main-grid">
        <div className="sandbox-card">
          <div className="sandbox-card-header">
            <h2>Zapytanie SQL</h2>
            <button className="sandbox-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',marginRight:'6px',verticalAlign:'text-bottom'}}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Przykłady zapytań
            </button>
          </div>

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Napisz swoje zapytanie SQL..."
          />

          <div className="sandbox-editor-actions">
            <select>
              <option>Główna baza danych</option>
            </select>
            <div>
              <button className="sandbox-ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',marginRight:'6px',verticalAlign:'text-bottom'}}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Wyczyść
              </button>
              <button className="sandbox-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',marginRight:'6px',verticalAlign:'text-bottom'}}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Wykonaj zapytanie
              </button>
            </div>
          </div>
        </div>

        <div className="sandbox-card sandbox-sidebar-box">
          <h2>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sandbox-header-icon"><path d="M2 12h20"/><path d="M2 12l5-5"/><path d="M2 12l5 5"/><path d="M22 12l-5-5"/><path d="M22 12l-5 5"/></svg>
            Jak to działa?
          </h2>
          <ol>
            <li>Napisz zapytanie SQL</li>
            <li>Wykonaj zapytanie</li>
            <li>Zobacz wyniki</li>
          </ol>

          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sandbox-header-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Przykładowe zapytania
          </h3>
          {examples.map((ex, i) => (
            <button className="sandbox-example-btn" key={i}>{ex}</button>
          ))}
        </div>

        <div className="sandbox-card sandbox-results-card">
          <div className="sandbox-card-header">
            <div className="sandbox-tabs">
              <button
                className={`sandbox-tab ${resultsView === 'structure' ? 'sandbox-tab-active' : ''}`}
                onClick={() => setResultsView('structure')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
                Struktura
              </button>
              <button
                className={`sandbox-tab ${resultsView === 'results' ? 'sandbox-tab-active' : ''}`}
                onClick={() => setResultsView('results')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h20"/><path d="M2 9h20"/><path d="M2 15h20"/><path d="M2 21h20"/><path d="M6 3v18"/><path d="M12 3v18"/><path d="M18 3v18"/></svg>
                Wyniki
              </button>
            </div>
          </div>
          {resultsView === 'structure' ? (
            <div className="sandbox-empty-state">
              <h3>Struktura tabeli pojawi się tutaj</h3>
              <p>Wybierz tabelę aby zobaczyć jej strukturę</p>
            </div>
          ) : (
            <div className="sandbox-empty-state">
              <h3>Wyniki pojawią się tutaj</h3>
              <p>Wykonaj zapytanie SQL aby zobaczyć dane w tabeli</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sandbox
