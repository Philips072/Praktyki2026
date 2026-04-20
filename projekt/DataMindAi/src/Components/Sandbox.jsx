import './Sandbox.css'
import { useState } from 'react'

function Sandbox() {
  const [expandedDatabase, setExpandedDatabase] = useState('')
  const [selectedTable, setSelectedTable] = useState('')

  const tablesData = {
    users: {
      structure: [
        { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'email', data_type: 'varchar', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'created_at', data_type: 'timestamp', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'role', data_type: 'varchar', is_nullable: 'YES', is_primary_key: false }
      ],
      data: [
        { id: '123e4567-e89b-12d3-a456-426614174000', email: 'user1@example.com', created_at: '2024-01-15', role: 'admin' },
        { id: '223e4567-e89b-12d3-a456-426614174001', email: 'user2@example.com', created_at: '2024-02-20', role: 'user' }
      ]
    },
    courses: {
      structure: [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'title', data_type: 'varchar', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'description', data_type: 'text', is_nullable: 'YES', is_primary_key: false },
        { column_name: 'price', data_type: 'decimal', is_nullable: 'NO', is_primary_key: false }
      ],
      data: [
        { id: 1, title: 'React od podstaw', description: 'Kurs React dla początkujących', price: 99.99 },
        { id: 2, title: 'Zaawansowany JavaScript', description: 'Głębia JS', price: 149.99 }
      ]
    },
    enrollments: {
      structure: [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'user_id', data_type: 'uuid', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'course_id', data_type: 'integer', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'enrolled_at', data_type: 'timestamp', is_nullable: 'NO', is_primary_key: false }
      ],
      data: [
        { id: 1, user_id: '123e4567-e89b-12d3-a456-426614174000', course_id: 1, enrolled_at: '2024-01-16' },
        { id: 2, user_id: '223e4567-e89b-12d3-a456-426614174001', course_id: 2, enrolled_at: '2024-02-21' }
      ]
    },
    lessons: {
      structure: [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'course_id', data_type: 'integer', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'title', data_type: 'varchar', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'duration', data_type: 'integer', is_nullable: 'YES', is_primary_key: false }
      ],
      data: [
        { id: 1, course_id: 1, title: 'Wprowadzenie do React', duration: 1200 },
        { id: 2, course_id: 1, title: 'Komponenty', duration: 1800 }
      ]
    },
    progress: {
      structure: [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'user_id', data_type: 'uuid', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'lesson_id', data_type: 'integer', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'completed', data_type: 'boolean', is_nullable: 'NO', is_primary_key: false }
      ],
      data: [
        { id: 1, user_id: '123e4567-e89b-12d3-a456-426614174000', lesson_id: 1, completed: true },
        { id: 2, user_id: '123e4567-e89b-12d3-a456-426614174000', lesson_id: 2, completed: false }
      ]
    },
    profiles: {
      structure: [
        { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'full_name', data_type: 'varchar', is_nullable: 'YES', is_primary_key: false },
        { column_name: 'avatar_url', data_type: 'varchar', is_nullable: 'YES', is_primary_key: false },
        { column_name: 'bio', data_type: 'text', is_nullable: 'YES', is_primary_key: false }
      ],
      data: [
        { id: '123e4567-e89b-12d3-a456-426614174000', full_name: 'Jan Kowalski', avatar_url: null, bio: 'Programista' }
      ]
    },
    settings: {
      structure: [
        { column_name: 'user_id', data_type: 'uuid', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'theme', data_type: 'varchar', is_nullable: 'YES', is_primary_key: false },
        { column_name: 'notifications', data_type: 'boolean', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'language', data_type: 'varchar', is_nullable: 'YES', is_primary_key: false }
      ],
      data: [
        { user_id: '123e4567-e89b-12d3-a456-426614174000', theme: 'dark', notifications: true, language: 'pl' }
      ]
    },
    notifications: {
      structure: [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'user_id', data_type: 'uuid', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'message', data_type: 'text', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'read', data_type: 'boolean', is_nullable: 'NO', is_primary_key: false }
      ],
      data: [
        { id: 1, user_id: '123e4567-e89b-12d3-a456-426614174000', message: 'Nowy kurs dostępny!', read: false }
      ]
    },
    sessions: {
      structure: [
        { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'user_id', data_type: 'uuid', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'expires_at', data_type: 'timestamp', is_nullable: 'NO', is_primary_key: false }
      ],
      data: [
        { id: 'session-123', user_id: '123e4567-e89b-12d3-a456-426614174000', expires_at: '2024-12-31' }
      ]
    },
    page_views: {
      structure: [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'user_id', data_type: 'uuid', is_nullable: 'YES', is_primary_key: false },
        { column_name: 'page', data_type: 'varchar', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'timestamp', data_type: 'timestamp', is_nullable: 'NO', is_primary_key: false }
      ],
      data: [
        { id: 1, user_id: '123e4567-e89b-12d3-a456-426614174000', page: '/dashboard', timestamp: '2024-04-20 10:00' }
      ]
    },
    events: {
      structure: [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'event_type', data_type: 'varchar', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'properties', data_type: 'jsonb', is_nullable: 'YES', is_primary_key: false },
        { column_name: 'timestamp', data_type: 'timestamp', is_nullable: 'NO', is_primary_key: false }
      ],
      data: [
        { id: 1, event_type: 'button_click', properties: { button: 'submit' }, timestamp: '2024-04-20 10:05' }
      ]
    },
    funnels: {
      structure: [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'name', data_type: 'varchar', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'steps', data_type: 'jsonb', is_nullable: 'YES', is_primary_key: false }
      ],
      data: [
        { id: 1, name: 'Onboarding', steps: ['signup', 'profile', 'first_course'] }
      ]
    },
    reports: {
      structure: [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'title', data_type: 'varchar', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'generated_at', data_type: 'timestamp', is_nullable: 'NO', is_primary_key: false }
      ],
      data: [
        { id: 1, title: 'Miesięczny raport', generated_at: '2024-04-01' }
      ]
    },
    access_logs: {
      structure: [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'user_id', data_type: 'uuid', is_nullable: 'YES', is_primary_key: false },
        { column_name: 'action', data_type: 'varchar', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'ip_address', data_type: 'varchar', is_nullable: 'YES', is_primary_key: false }
      ],
      data: [
        { id: 1, user_id: '123e4567-e89b-12d3-a456-426614174000', action: 'login', ip_address: '192.168.1.1' }
      ]
    },
    error_logs: {
      structure: [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'error_message', data_type: 'text', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'stack_trace', data_type: 'text', is_nullable: 'YES', is_primary_key: false },
        { column_name: 'timestamp', data_type: 'timestamp', is_nullable: 'NO', is_primary_key: false }
      ],
      data: [
        { id: 1, error_message: 'Connection timeout', stack_trace: 'Error at line 42', timestamp: '2024-04-19 15:30' }
      ]
    },
    audit_trail: {
      structure: [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'user_id', data_type: 'uuid', is_nullable: 'YES', is_primary_key: false },
        { column_name: 'action', data_type: 'varchar', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'entity_type', data_type: 'varchar', is_nullable: 'NO', is_primary_key: false }
      ],
      data: [
        { id: 1, user_id: '123e4567-e89b-12d3-a456-426614174000', action: 'update', entity_type: 'course' }
      ]
    },
    sessions: {
      structure: [
        { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'user_id', data_type: 'uuid', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'expires_at', data_type: 'timestamp', is_nullable: 'NO', is_primary_key: false }
      ],
      data: [
        { id: 'cache-session-1', user_id: '123e4567-e89b-12d3-a456-426614174000', expires_at: '2024-12-31' }
      ]
    },
    temp_data: {
      structure: [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'key', data_type: 'varchar', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'value', data_type: 'text', is_nullable: 'YES', is_primary_key: false }
      ],
      data: [
        { id: 1, key: 'temp_cart', value: '[{"id": 1, "qty": 2}]' }
      ]
    },
    rate_limits: {
      structure: [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO', is_primary_key: true },
        { column_name: 'identifier', data_type: 'varchar', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'requests', data_type: 'integer', is_nullable: 'NO', is_primary_key: false },
        { column_name: 'window_start', data_type: 'timestamp', is_nullable: 'NO', is_primary_key: false }
      ],
      data: [
        { id: 1, identifier: '192.168.1.1', requests: 45, window_start: '2024-04-20 10:00' }
      ]
    }
  }

  const databasesData = [
    {
      id: 'main_db',
      name: 'Główna baza danych',
      tables: ['users', 'courses', 'enrollments', 'lessons', 'progress']
    },
    {
      id: 'users_db',
      name: 'Baza użytkowników',
      tables: ['profiles', 'settings', 'notifications', 'sessions']
    },
    {
      id: 'analytics_db',
      name: 'Baza analityczna',
      tables: ['page_views', 'events', 'funnels', 'reports']
    },
    {
      id: 'logs_db',
      name: 'Baza logów',
      tables: ['access_logs', 'error_logs', 'audit_trail']
    },
    {
      id: 'cache_db',
      name: 'Baza cache',
      tables: ['sessions', 'temp_data', 'rate_limits']
    }
  ]

  const handleDatabaseClick = (databaseId) => {
    if (expandedDatabase === databaseId) {
      setExpandedDatabase('')
    } else {
      setExpandedDatabase(databaseId)
    }
  }

  const handleTableClick = (tableName) => {
    setSelectedTable(tableName)
  }

  return (
    <div className="sandbox-container">
      <div className="sandbox-header">
        <h1>Sandbox Bazy Danych</h1>
        <p>Przeglądaj swoje bazy danych, tabele i dane w środowisku Supabase</p>
      </div>

      <div className="sandbox-content">
        <div className="sandbox-sidebar">
          <div className="sandbox-section">
            <h3>Bazy danych</h3>
            {databasesData.map(db => (
              <div key={db.id} className="sandbox-database">
                <button
                  className={`sandbox-item ${expandedDatabase === db.id ? 'active' : ''}`}
                  onClick={() => handleDatabaseClick(db.id)}
                >
                  <span className="sandbox-item-name">{db.name}</span>
                  <span className={`sandbox-arrow ${expandedDatabase === db.id ? 'expanded' : ''}`}>
                    ▶
                  </span>
                </button>
                {expandedDatabase === db.id && (
                  <div className="sandbox-tables-list expanded">
                    <div>
                      {db.tables.map(table => (
                        <button
                          key={table}
                          className={`sandbox-table-item ${selectedTable === table ? 'active' : ''}`}
                          onClick={() => handleTableClick(table)}
                        >
                          {table}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="sandbox-main">
          {selectedTable && tablesData[selectedTable] ? (
            <>
              <div className="sandbox-section-header">
                <h2>{selectedTable}</h2>
              </div>

              <div className="sandbox-structure">
                <h3>Struktura tabeli</h3>
                <table className="sandbox-table">
                  <thead>
                    <tr>
                      <th>Kolumna</th>
                      <th>Typ</th>
                      <th>Nulowalna</th>
                      <th>Klucz główny</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tablesData[selectedTable].structure.map((col, idx) => (
                      <tr key={idx}>
                        <td><strong>{col.column_name}</strong></td>
                        <td><code>{col.data_type}</code></td>
                        <td>{col.is_nullable === 'YES' ? 'Tak' : 'Nie'}</td>
                        <td>{col.is_primary_key ? '✓' : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="sandbox-data">
                <h3>Dane ({tablesData[selectedTable].data.length} wierszy)</h3>
                {tablesData[selectedTable].data.length > 0 ? (
                  <div className="sandbox-table-wrapper">
                    <table className="sandbox-table">
                      <thead>
                        <tr>
                          {Object.keys(tablesData[selectedTable].data[0]).map(key => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tablesData[selectedTable].data.map((row, idx) => (
                          <tr key={idx}>
                            {Object.values(row).map((val, valIdx) => (
                              <td key={valIdx}>
                                {val === null ? (
                                  <span className="null-value">NULL</span>
                                ) : typeof val === 'object' ? (
                                  <code>{JSON.stringify(val)}</code>
                                ) : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="sandbox-empty">Brak danych w tabeli</p>
                )}
              </div>
            </>
          ) : (
            <div className="sandbox-placeholder">
              <div className="sandbox-placeholder-icon">📊</div>
              <h3>Wybierz tabelę</h3>
              <p>Kliknij na tabelę w panelu bocznym, aby wyświetlić jej strukturę i dane.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sandbox
