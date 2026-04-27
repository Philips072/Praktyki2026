import './Sandbox.css'
import { useState, useEffect } from 'react'
import {
  initializeSandboxDatabase,
  getUserSandboxDatabases,
  executeSandboxSQL,
  getSandboxTables,
  getSandboxTableSchema,
  getSandboxTableData,
  sandboxDatabaseExists,
  dropSandboxDatabase
} from '../api.js'

const getUserId = () => {
  const userStr = localStorage.getItem('user')
  if (!userStr) return 'guest'
  try {
    const user = JSON.parse(userStr)
    return user.id || 'guest'
  } catch {
    return 'guest'
  }
}

const DEFAULT_DB_NAME = 'Moja_baza_danych'
const MAX_DATABASES = 5

function Sandbox() {
  const [query, setQuery] = useState('');
  const [resultsView, setResultsView] = useState('structure');
  const [selectedDatabase, setSelectedDatabase] = useState(DEFAULT_DB_NAME);
  const [selectedTable, setSelectedTable] = useState('');
  const [isExampleDropdownOpen, setIsExampleDropdownOpen] = useState(false);
  const [isTableDropdownOpen, setIsTableDropdownOpen] = useState(false);
  const [databases, setDatabases] = useState([]);
  const [tables, setTables] = useState([]);
  const [tableSchema, setTableSchema] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [queryResults, setQueryResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queryMessage, setQueryMessage] = useState('');
  const [messageType, setMessageType] = useState('success'); // success, warning, error
  const [queryCount, setQueryCount] = useState(0);
  const [stats, setStats] = useState([
    { label: 'Tabele', value: '0', description: 'w bazie danych', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>' },
    { label: 'Wiersze', value: '0', description: 'łączna liczba', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>' },
    { label: 'Zapytania', value: '0', description: 'wykonane dziś', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>' },
    { label: 'Bazy danych', value: '1/5', description: 'maksymalnie', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' },
  ]);

  const examples = [
    'CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT);',
    'INSERT INTO users (name, email) VALUES (\'Jan Kowalski\', \'jan@email.com\');',
    'SELECT * FROM users;',
    'CREATE DATABASE moja_baza;',
    'USE moja_baza;',
    'DROP DATABASE moja_baza;'
  ];

  const handleClickOutside = (e) => {
    if (!e.target.closest('.sandbox-custom-select') && !e.target.closest('.sandbox-table-dropdown-container')) {
      setIsExampleDropdownOpen(false);
      setIsTableDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isExampleDropdownOpen || isTableDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isExampleDropdownOpen, isTableDropdownOpen]);

  const getCurrentDbId = () => {
    return selectedDatabase === DEFAULT_DB_NAME ? 'main' : selectedDatabase;
  };

  const initializeDefaultDatabase = async () => {
    const userId = getUserId();
    try {
      const existsResult = await sandboxDatabaseExists(userId, 'main');
      if (!existsResult.exists) {
        await initializeSandboxDatabase(userId, 'main');
      }
    } catch (error) {
      console.error('Error initializing default database:', error);
    }
  };

  const loadDatabases = async () => {
    const userId = getUserId();
    try {
      const result = await getUserSandboxDatabases(userId);
      const dbList = result.databases || [];
      const formattedDbs = dbList.map(dbId => ({
        id: dbId,
        name: dbId === 'main' ? DEFAULT_DB_NAME : dbId
      }));
      if (formattedDbs.length === 0 || !formattedDbs.find(db => db.id === 'main')) {
        if (!formattedDbs.find(db => db.id === 'main')) {
          formattedDbs.unshift({ id: 'main', name: DEFAULT_DB_NAME });
        }
      }
      setDatabases(formattedDbs);
      updateDbCount(formattedDbs.length);
    } catch (error) {
      console.error('Error loading databases:', error);
      setDatabases([{ id: 'main', name: DEFAULT_DB_NAME }]);
      updateDbCount(1);
    }
  };

  const updateDbCount = (count) => {
    setStats(prev => [
      prev[0],
      prev[1],
      prev[2],
      { ...prev[3], value: `${count}/${MAX_DATABASES}` }
    ]);
  };

  const updateQueryCount = (increment = 1) => {
    setQueryCount(prev => {
      const newCount = prev + increment;
      setStats(stats => [
        stats[0],
        stats[1],
        { ...stats[2], value: newCount.toString() },
        stats[3]
      ]);
      return newCount;
    });
  };

  const loadTables = async () => {
    const userId = getUserId();
    const dbId = getCurrentDbId();
    try {
      const result = await getSandboxTables(userId, dbId);
      setTables(result.tables || []);
    } catch (error) {
      console.error('Error loading tables:', error);
      setTables([]);
    }
  };

  const updateStats = async () => {
    const userId = getUserId();
    const dbId = getCurrentDbId();
    try {
      const tablesResult = await getSandboxTables(userId, dbId);
      const tableCount = tablesResult.tables?.length || 0;

      let totalRows = 0;
      for (const table of tablesResult.tables || []) {
        try {
          const dataResult = await getSandboxTableData(userId, dbId, table, 1000);
          totalRows += dataResult.rows?.length || 0;
        } catch {
          continue;
        }
      }

      setStats(prev => [
        { ...prev[0], value: tableCount.toString() },
        { ...prev[1], value: totalRows >= 1000 ? (totalRows / 1000).toFixed(1) + 'K' : totalRows.toString() },
        prev[2],
        prev[3]
      ]);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  useEffect(() => {
    initializeDefaultDatabase();
    loadDatabases();
  }, []);

  useEffect(() => {
    loadTables();
    updateStats();
    setSelectedTable('');
    setTableSchema(null);
    setTableData(null);
  }, [selectedDatabase]);

  const handleCreateDatabase = async (dbName) => {
    const userId = getUserId();

    // Sprawdź czy nazwa zawiera polskie znaki lub inne niedozwolone znaki
    const allowedPattern = /^[a-zA-Z0-9_]+$/;
    if (!allowedPattern.test(dbName)) {
      setMessageType('warning');
      return `Nazwa bazy danych może zawierać tylko litery (a-z, A-Z), cyfry (0-9) i podkreślenia (_). Niedozwolone są polskie znaki i znaki specjalne.`;
    }

    // Pobierz aktualną listę baz przed sprawdzeniem limitu
    try {
      const currentDbResult = await getUserSandboxDatabases(userId);
      const currentDbCount = (currentDbResult.databases || []).length;

      if (currentDbCount >= MAX_DATABASES) {
        setMessageType('error');
        return `Osiągnięto maksymalną liczbę baz danych (${MAX_DATABASES}). Usuń jedną z istniejących baz przed utworzeniem nowej.`;
      }
    } catch (error) {
      console.error('Error checking database count:', error);
    }

    try {
      const existsResult = await sandboxDatabaseExists(userId, dbName);
      if (existsResult.exists) {
        setMessageType('warning');
        return `Baza danych '${dbName}' już istnieje.`;
      }

      await initializeSandboxDatabase(userId, dbName);

      // Dodaj nową bazę do stanu lokalnego natychmiast
      setDatabases(prev => {
        const newDb = { id: dbName, name: dbName };
        // Sprawdź czy już nie ma tej bazy
        if (!prev.find(db => db.id === dbName)) {
          const updated = [...prev, newDb];
          updateDbCount(updated.length);
          return updated;
        }
        return prev;
      });

      setSelectedDatabase(dbName);
      setMessageType('success');
      return `Baza danych '${dbName}' została utworzona pomyślnie.`;
    } catch (error) {
      setMessageType('error');
      return `Błąd podczas tworzenia bazy danych: ${error.message}`;
    }
  };

  const handleUseDatabase = async (dbName) => {
    const userId = getUserId();

    try {
      const existsResult = await sandboxDatabaseExists(userId, dbName);
      if (!existsResult.exists) {
        setMessageType('warning');
        return `Baza danych '${dbName}' nie istnieje.`;
      }

      await loadDatabases();
      setSelectedDatabase(dbName);
      setMessageType('success');
      return `Przełączono na bazę danych '${dbName}'.`;
    } catch (error) {
      setMessageType('error');
      return `Błąd podczas zmiany bazy danych: ${error.message}`;
    }
  };

  const handleDropDatabase = async (dbName) => {
    const userId = getUserId();

    if (dbName === 'main') {
      setMessageType('warning');
      return `Nie można usunąć głównej bazy danych.`;
    }

    try {
      const existsResult = await sandboxDatabaseExists(userId, dbName);
      if (!existsResult.exists) {
        setMessageType('warning');
        return `Baza danych '${dbName}' nie istnieje.`;
      }

      await dropSandboxDatabase(userId, dbName);

      // Usuń bazę ze stanu lokalnego natychmiast
      setDatabases(prev => {
        const updated = prev.filter(db => db.id !== dbName);
        updateDbCount(updated.length);
        return updated;
      });

      // Jeśli usunęliśmy aktualnie wybraną bazę, przełącz na główną
      if (selectedDatabase === dbName) {
        setSelectedDatabase(DEFAULT_DB_NAME);
      }

      setMessageType('success');
      return `Baza danych '${dbName}' została usunięta pomyślnie.`;
    } catch (error) {
      setMessageType('error');
      return `Błąd podczas usuwania bazy danych: ${error.message}`;
    }
  };

  const handleExecuteQuery = async () => {
    if (!query.trim()) return;

    const trimmedQuery = query.trim();
    const normalizedQuery = trimmedQuery.toUpperCase();

    // Obsługa CREATE DATABASE
    const createDbMatch = trimmedQuery.match(/^CREATE\s+DATABASE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)/i);
    if (createDbMatch) {
      const dbName = createDbMatch[1];
      setIsLoading(true);
      setQueryMessage('');
      try {
        const message = await handleCreateDatabase(dbName);
        setQueryMessage(message);
        setQueryResults(null);
        if (messageType === 'success') {
          updateQueryCount();
        }
      } catch (error) {
        setQueryMessage(`Błąd: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Obsługa USE
    const useMatch = trimmedQuery.match(/^USE\s+([a-zA-Z0-9_]+)/i);
    if (useMatch) {
      const dbName = useMatch[1];
      setIsLoading(true);
      setQueryMessage('');
      try {
        const message = await handleUseDatabase(dbName);
        setQueryMessage(message);
        setQueryResults(null);
        updateQueryCount();
      } catch (error) {
        setQueryMessage(`Błąd: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Obsługa DROP DATABASE
    const dropDbMatch = trimmedQuery.match(/^DROP\s+DATABASE\s+(?:IF\s+EXISTS\s+)?([a-zA-Z0-9_]+)/i);
    if (dropDbMatch) {
      const dbName = dropDbMatch[1];
      setIsLoading(true);
      setQueryMessage('');
      try {
        const message = await handleDropDatabase(dbName);
        setQueryMessage(message);
        setQueryResults(null);
        if (messageType === 'success') {
          updateQueryCount();
        }
      } catch (error) {
        setQueryMessage(`Błąd: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Standardowe zapytanie SQL
    const userId = getUserId();
    const dbId = getCurrentDbId();
    setIsLoading(true);
    setQueryMessage('');

    try {
      const result = await executeSandboxSQL(userId, dbId, query);
      setQueryResults(result);
      setQueryMessage(result.message || 'Zapytanie wykonane');
      setMessageType('success');
      setResultsView('results');
      loadTables();
      updateStats();
      updateQueryCount();
    } catch (error) {
      setQueryMessage(`Błąd: ${error.message}`);
      setMessageType('error');
      setQueryResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableSelect = async (tableName) => {
    setSelectedTable(tableName);
    setIsTableDropdownOpen(false);

    const userId = getUserId();
    const dbId = getCurrentDbId();

    try {
      const [schemaResult, dataResult] = await Promise.all([
        getSandboxTableSchema(userId, dbId, tableName),
        getSandboxTableData(userId, dbId, tableName, 100)
      ]);

      setTableSchema(schemaResult.schema || []);
      setTableData(dataResult);
    } catch (error) {
      console.error('Error loading table data:', error);
      setTableSchema(null);
      setTableData(null);
    }
  };

  const handleExampleClick = (example) => {
    setQuery(example);
  };

  const handleClear = () => {
    setQuery('');
    setQueryResults(null);
    setQueryMessage('');
    setMessageType('success');
  };

  const getMessageClass = () => {
    switch (messageType) {
      case 'warning':
        return 'sandbox-query-warning';
      case 'error':
        return 'sandbox-query-error';
      default:
        return 'sandbox-query-success';
    }
  };

  return (
    <div className="sandbox-page">
      <h1>Sandbox Bazy Danych</h1>
      <p className="subtitle">Twój prywatny sandbox SQLite - twórz tabele, bazy danych i wykonuj zapytania SQL</p>

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
            <button className="sandbox-secondary" onClick={() => setQuery(query + examples[0])}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',marginRight:'6px',verticalAlign:'text-bottom'}}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Przykłady zapytań
            </button>
          </div>

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Napisz swoje zapytanie SQL... (np. CREATE TABLE, CREATE DATABASE, USE, DROP DATABASE)"
          />

          {queryMessage && (
            <div className={`sandbox-query-message ${getMessageClass()}`}>
              {queryMessage}
            </div>
          )}

          <div className="sandbox-editor-actions">
            <div className="sandbox-custom-select">
              <button
                className="sandbox-select-button"
                onClick={() => setIsExampleDropdownOpen(!isExampleDropdownOpen)}
              >
                <span>{databases.find(db => db.name === selectedDatabase)?.name || selectedDatabase}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`sandbox-select-arrow ${isExampleDropdownOpen ? 'sandbox-select-arrow-open' : ''}`}><polyline points="8 9 12 15 16 9"/></svg>
              </button>
              {isExampleDropdownOpen && (
                <div className="sandbox-select-dropdown">
                  {databases.map(db => (
                    <button
                      key={db.id}
                      className={`sandbox-select-option ${selectedDatabase === db.name ? 'sandbox-select-option-active' : ''}`}
                      onClick={() => {
                        setSelectedDatabase(db.name);
                        setIsExampleDropdownOpen(false);
                      }}
                    >
                      {db.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <button className="sandbox-ghost" onClick={handleClear}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',marginRight:'6px',verticalAlign:'text-bottom'}}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Wyczyść
              </button>
              <button className="sandbox-primary" onClick={handleExecuteQuery} disabled={isLoading}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',marginRight:'6px',verticalAlign:'text-bottom'}}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                {isLoading ? 'Wykonywanie...' : 'Wykonaj zapytanie'}
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
            <li>Utwórz nową bazę: <code>CREATE DATABASE nazwa;</code></li>
            <li>Przełącz na bazę: <code>USE nazwa;</code></li>
            <li>Utwórz tabelę: <code>CREATE TABLE ...</code></li>
            <li>Usuń bazę: <code>DROP DATABASE nazwa;</code></li>
            <li>Maksymalnie {MAX_DATABASES} baz na użytkownika</li>
          </ol>

          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sandbox-header-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Przykładowe zapytania
          </h3>
          {examples.map((ex, i) => (
            <button className="sandbox-example-btn" key={i} onClick={() => handleExampleClick(ex)}>{ex}</button>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h20"/><path d="M2 9h20"/><path d="M2 15h20"/><path d="M2 21h20"/><path d="M6 3v18"/><path d="M12" y1="3v18"/><path d="M18 3v18"/></svg>
                Wyniki
              </button>
            </div>
          </div>
          {resultsView === 'structure' ? (
            <>
              <div className="sandbox-table-dropdown-container">
                <div className="sandbox-table-selector">
                  <label>Wybierz tabelę:</label>
                  <div className="sandbox-custom-select">
                    <button
                      className="sandbox-select-button"
                      onClick={() => setIsTableDropdownOpen(!isTableDropdownOpen)}
                    >
                      <span>{selectedTable || '-- Wybierz tabelę --'}</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`sandbox-select-arrow ${isTableDropdownOpen ? 'sandbox-select-arrow-open' : ''}`}><polyline points="8 9 12 15 16 9"/></svg>
                    </button>
                    {isTableDropdownOpen && (
                      <div className="sandbox-select-dropdown">
                        {tables.map(table => (
                          <button
                            key={table}
                            className={`sandbox-select-option ${selectedTable === table ? 'sandbox-select-option-active' : ''}`}
                            onClick={() => handleTableSelect(table)}
                          >
                            {table}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {selectedTable && tableSchema && tableData ? (
                <div className="sandbox-table-structure">
                  <h3>{selectedTable}</h3>
                  <table className="sandbox-structure-table">
                    <thead>
                      <tr>
                        <th>Nazwa kolumny</th>
                        <th>Typ</th>
                        <th>Ograniczenia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableSchema.map((col, i) => (
                        <tr key={i} className={col.primaryKey ? 'sandbox-pk-row' : ''}>
                          <td className="sandbox-col-name">
                            {col.primaryKey && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sandbox-pk-icon"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 1 0 0 6zm-1 0V4a2 2 0 0 1 4 0v11"/><circle cx="12" cy="15" r="3"/></svg>
                            )}
                            {col.name}
                          </td>
                          <td>{col.type}</td>
                          <td>
                            {col.primaryKey && 'PRIMARY KEY'}
                            {col.primaryKey && col.notNull && ', '}
                            {col.notNull && 'NOT NULL'}
                            {col.defaultValue && ', '}
                            {col.defaultValue && `DEFAULT ${col.defaultValue}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="sandbox-table-data">
                    <h4>Wartości w tabeli</h4>
                    <table className="sandbox-structure-table">
                      <thead>
                        <tr>
                          {tableSchema.map((col, i) => (
                            <th key={i} className={col.primaryKey ? 'sandbox-pk-header' : ''}>{col.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.rows?.map((row, i) => (
                          <tr key={i}>
                            {tableSchema.map((col, j) => (
                              <td key={j} className={col.primaryKey ? 'sandbox-pk-cell' : ''}>{row[j]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {tableData.rows?.length === 0 && (
                      <p className="sandbox-empty-message">Tabela jest pusta</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="sandbox-empty-state">
                  <h3>Struktura tabeli pojawi się tutaj</h3>
                  <p>Wybierz tabelę aby zobaczyć jej strukturę</p>
                  {tables.length === 0 && (
                    <p className="sandbox-hint">Utwórz tabelę używając CREATE TABLE</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="sandbox-query-results">
              {queryResults?.data?.[0] ? (
                <>
                  <table className="sandbox-structure-table">
                    <thead>
                      <tr>
                        {queryResults.data[0].columns.map((col, i) => (
                          <th key={i}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResults.data[0].rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {queryResults.data[0].rows.length === 0 && (
                    <p className="sandbox-empty-message">Brak wyników</p>
                  )}
                </>
              ) : (
                <div className="sandbox-empty-state">
                  <h3>Wyniki pojawią się tutaj</h3>
                  <p>Wykonaj zapytanie SQL aby zobaczyć dane</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sandbox
