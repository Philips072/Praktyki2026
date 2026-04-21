import './Sandbox.css'
import { useState, useEffect } from 'react'

function Sandbox() {
  const [query, setQuery] = useState('');
  const [resultsView, setResultsView] = useState('structure');
  const [selectedDatabase, setSelectedDatabase] = useState('main');
  const [selectedTable, setSelectedTable] = useState('');
  const [isExampleDropdownOpen, setIsExampleDropdownOpen] = useState(false);
  const [isTableDropdownOpen, setIsTableDropdownOpen] = useState(false);

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

  const databases = [
    { id: 'main', name: 'Główna baza danych' },
    { id: 'analytics', name: 'Analytics DB' },
    { id: 'users', name: 'Users DB' },
    { id: 'products', name: 'Products DB' },
    { id: 'logs', name: 'Logs DB' },
  ];

  const tables = {
    main: [
      { name: 'users', columns: [{ name: 'id', type: 'int', constraints: 'PRIMARY KEY' }, { name: 'email', type: 'varchar', constraints: 'NOT NULL, UNIQUE' }, { name: 'username', type: 'varchar', constraints: 'NOT NULL' }, { name: 'created_at', type: 'timestamp', constraints: 'DEFAULT NOW()' }, { name: 'updated_at', type: 'timestamp', constraints: 'DEFAULT NOW()' }], data: [{ id: 1, email: 'jan@kowalski.pl', username: 'jkowalski', created_at: '2024-01-15', updated_at: '2024-01-20' }, { id: 2, email: 'anna@nowak.pl', username: 'anowak', created_at: '2024-02-10', updated_at: '2024-02-15' }, { id: 3, email: 'pawel@wiśniewski.pl', username: 'pwisniewski', created_at: '2024-03-05', updated_at: '2024-03-10' }] },
      { name: 'orders', columns: [{ name: 'id', type: 'int', constraints: 'PRIMARY KEY' }, { name: 'user_id', type: 'int', constraints: 'NOT NULL, FOREIGN KEY' }, { name: 'total', type: 'decimal', constraints: 'NOT NULL' }, { name: 'status', type: 'varchar', constraints: 'NOT NULL' }, { name: 'created_at', type: 'timestamp', constraints: 'DEFAULT NOW()' }], data: [{ id: 1, user_id: 1, total: '129.99', status: 'completed', created_at: '2024-01-20' }, { id: 2, user_id: 1, total: '59.50', status: 'completed', created_at: '2024-02-05' }, { id: 3, user_id: 2, total: '199.00', status: 'pending', created_at: '2024-03-01' }] },
      { name: 'products', columns: [{ name: 'id', type: 'int', constraints: 'PRIMARY KEY' }, { name: 'name', type: 'varchar', constraints: 'NOT NULL' }, { name: 'price', type: 'decimal', constraints: 'NOT NULL' }, { name: 'category', type: 'varchar', constraints: 'NOT NULL' }, { name: 'stock', type: 'int', constraints: 'DEFAULT 0' }], data: [{ id: 1, name: 'Laptop HP', price: '3499.00', category: 'Elektronika', stock: 15 }, { id: 2, name: 'Monitor Dell', price: '1299.00', category: 'Elektronika', stock: 42 }, { id: 3, name: 'Klawiatura Logitech', price: '249.99', category: 'Akcesoria', stock: 128 }] },
      { name: 'categories', columns: [{ name: 'id', type: 'int', constraints: 'PRIMARY KEY' }, { name: 'name', type: 'varchar', constraints: 'NOT NULL' }, { name: 'parent_id', type: 'int', constraints: 'NULL' }], data: [{ id: 1, name: 'Elektronika', parent_id: null }, { id: 2, name: 'Akcesoria', parent_id: null }, { id: 3, name: 'Laptopy', parent_id: 1 }] },
    ],
    analytics: [
      { name: 'page_views', columns: [{ name: 'id', type: 'int', constraints: 'PRIMARY KEY' }, { name: 'page_url', type: 'varchar', constraints: 'NOT NULL' }, { name: 'user_id', type: 'int', constraints: 'NULL' }, { name: 'timestamp', type: 'timestamp', constraints: 'DEFAULT NOW()' }], data: [{ id: 1, page_url: '/home', user_id: 1, timestamp: '2024-03-20 10:30:00' }, { id: 2, page_url: '/products', user_id: 1, timestamp: '2024-03-20 10:35:00' }, { id: 3, page_url: '/cart', user_id: 2, timestamp: '2024-03-20 10:40:00' }] },
      { name: 'events', columns: [{ name: 'id', type: 'int', constraints: 'PRIMARY KEY' }, { name: 'event_type', type: 'varchar', constraints: 'NOT NULL' }, { name: 'metadata', type: 'json', constraints: 'NULL' }, { name: 'timestamp', type: 'timestamp', constraints: 'DEFAULT NOW()' }], data: [{ id: 1, event_type: 'purchase', metadata: '{"product_id": 1}', timestamp: '2024-03-20' }, { id: 2, event_type: 'login', metadata: '{"ip": "192.168.1.1"}', timestamp: '2024-03-20' }, { id: 3, event_type: 'view', metadata: '{"page": "/home"}', timestamp: '2024-03-20' }] },
    ],
    users: [
      { name: 'profiles', columns: [{ name: 'id', type: 'int', constraints: 'PRIMARY KEY' }, { name: 'user_id', type: 'int', constraints: 'NOT NULL, UNIQUE' }, { name: 'avatar_url', type: 'varchar', constraints: 'NULL' }, { name: 'bio', type: 'text', constraints: 'NULL' }], data: [{ id: 1, user_id: 1, avatar_url: '/avatars/user1.jpg', bio: 'Software developer' }, { id: 2, user_id: 2, avatar_url: '/avatars/user2.jpg', bio: 'Designer' }, { id: 3, user_id: 3, avatar_url: null, bio: null }] },
      { name: 'sessions', columns: [{ name: 'id', type: 'int', constraints: 'PRIMARY KEY' }, { name: 'user_id', type: 'int', constraints: 'NOT NULL, FOREIGN KEY' }, { name: 'login_time', type: 'timestamp', constraints: 'NOT NULL' }, { name: 'logout_time', type: 'timestamp', constraints: 'NULL' }], data: [{ id: 1, user_id: 1, login_time: '2024-03-20 09:00:00', logout_time: '2024-03-20 17:30:00' }, { id: 2, user_id: 2, login_time: '2024-03-20 08:45:00', logout_time: '2024-03-20 12:30:00' }] },
    ],
    products: [
      { name: 'inventory', columns: [{ name: 'id', type: 'int', constraints: 'PRIMARY KEY' }, { name: 'product_id', type: 'int', constraints: 'NOT NULL, FOREIGN KEY' }, { name: 'quantity', type: 'int', constraints: 'NOT NULL' }, { name: 'location', type: 'varchar', constraints: 'NOT NULL' }], data: [{ id: 1, product_id: 1, quantity: 15, location: 'Magazyn A' }, { id: 2, product_id: 2, quantity: 42, location: 'Magazyn B' }, { id: 3, product_id: 3, quantity: 128, location: 'Magazyn A' }] },
      { name: 'suppliers', columns: [{ name: 'id', type: 'int', constraints: 'PRIMARY KEY' }, { name: 'name', type: 'varchar', constraints: 'NOT NULL, UNIQUE' }, { name: 'contact', type: 'varchar', constraints: 'NULL' }, { name: 'address', type: 'text', constraints: 'NULL' }], data: [{ id: 1, name: 'Dostawca XYZ', contact: 'kontakt@dostawca.pl', address: 'ul. Przykładowa 1, Warszawa' }, { id: 2, name: 'Firma ABC', contact: 'biuro@abc.com', address: 'ul. Kolejowa 5, Kraków' }] },
    ],
    logs: [
      { name: 'system_logs', columns: [{ name: 'id', type: 'int', constraints: 'PRIMARY KEY' }, { name: 'level', type: 'varchar', constraints: 'NOT NULL' }, { name: 'message', type: 'text', constraints: 'NOT NULL' }, { name: 'timestamp', type: 'timestamp', constraints: 'DEFAULT NOW()' }], data: [{ id: 1, level: 'INFO', message: 'User login successful', timestamp: '2024-03-20 10:00:00' }, { id: 2, level: 'WARNING', message: 'High memory usage', timestamp: '2024-03-20 10:15:00' }, { id: 3, level: 'ERROR', message: 'Database connection failed', timestamp: '2024-03-20 10:20:00' }] },
      { name: 'error_logs', columns: [{ name: 'id', type: 'int', constraints: 'PRIMARY KEY' }, { name: 'error_code', type: 'varchar', constraints: 'NOT NULL' }, { name: 'stack_trace', type: 'text', constraints: 'NULL' }, { name: 'timestamp', type: 'timestamp', constraints: 'DEFAULT NOW()' }], data: [{ id: 1, error_code: 'ERR-001', stack_trace: 'Stack trace here...', timestamp: '2024-03-20' }, { id: 2, error_code: 'ERR-002', stack_trace: null, timestamp: '2024-03-20' }] },
    ],
  };

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
            <div className="sandbox-custom-select">
              <button
                className="sandbox-select-button"
                onClick={() => setIsExampleDropdownOpen(!isExampleDropdownOpen)}
              >
                <span>{databases.find(db => db.id === selectedDatabase)?.name}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`sandbox-select-arrow ${isExampleDropdownOpen ? 'sandbox-select-arrow-open' : ''}`}><polyline points="8 9 12 15 16 9"/></svg>
              </button>
              {isExampleDropdownOpen && (
                <div className="sandbox-select-dropdown">
                  {databases.map(db => (
                    <button
                      key={db.id}
                      className={`sandbox-select-option ${selectedDatabase === db.id ? 'sandbox-select-option-active' : ''}`}
                      onClick={() => {
                        setSelectedDatabase(db.id);
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
                        {(tables[selectedDatabase] || []).map(table => (
                          <button
                            key={table.name}
                            className={`sandbox-select-option ${selectedTable === table.name ? 'sandbox-select-option-active' : ''}`}
                            onClick={() => {
                              setSelectedTable(table.name);
                              setIsTableDropdownOpen(false);
                            }}
                          >
                            {table.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {selectedTable ? (
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
                      {tables[selectedDatabase]?.find(t => t.name === selectedTable)?.columns.map((col, i) => (
                        <tr key={i} className={col.constraints.includes('PRIMARY KEY') ? 'sandbox-pk-row' : ''}>
                          <td className="sandbox-col-name">
                            {col.constraints.includes('PRIMARY KEY') && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sandbox-pk-icon"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 1 0 0 6zm-1 0V4a2 2 0 0 1 4 0v11"/><circle cx="12" cy="15" r="3"/></svg>
                            )}
                            {col.name}
                          </td>
                          <td>{col.type}</td>
                          <td>{col.constraints}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="sandbox-table-data">
                    <h4>Wartości w tabeli</h4>
                    <table className="sandbox-structure-table">
                      <thead>
                        <tr>
                          {tables[selectedDatabase]?.find(t => t.name === selectedTable)?.columns.map((col, i) => (
                            <th key={i} className={col.constraints.includes('PRIMARY KEY') ? 'sandbox-pk-header' : ''}>{col.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tables[selectedDatabase]?.find(t => t.name === selectedTable)?.data?.map((row, i) => (
                          <tr key={i}>
                            {tables[selectedDatabase]?.find(t => t.name === selectedTable)?.columns.map((col, j) => (
                              <td key={j} className={col.constraints.includes('PRIMARY KEY') ? 'sandbox-pk-cell' : ''}>{row[col.name]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="sandbox-empty-state">
                  <h3>Struktura tabeli pojawi się tutaj</h3>
                  <p>Wybierz tabelę aby zobaczyć jej strukturę</p>
                </div>
              )}
            </>
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
