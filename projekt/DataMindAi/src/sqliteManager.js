import initSqlJs from 'sql.js'

const SQL_WASM_PATH = '/sql-wasm.wasm'
let dbInstance = null

export const loadSQL = async () => {
  if (dbInstance) return dbInstance
  const SQL = await initSqlJs({ locateFile: () => SQL_WASM_PATH })
  dbInstance = SQL
  return dbInstance
}

export const createLessonDatabase = async (lessonId) => {
  const SQL = await loadSQL()
  const db = new SQL.Database()

  let schema = ''
  let initialData = []

  switch (lessonId) {
    case 1:
      schema = `
        CREATE TABLE IF NOT EXISTS customers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE,
          phone TEXT,
          city TEXT,
          registration_date DATE DEFAULT CURRENT_DATE
        );

        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_id INTEGER,
          product_name TEXT NOT NULL,
          quantity INTEGER NOT NULL CHECK (quantity > 0),
          price REAL NOT NULL CHECK (price >= 0),
          order_date DATE DEFAULT CURRENT_DATE,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
          FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          category TEXT NOT NULL,
          price REAL NOT NULL CHECK (price >= 0),
          stock INTEGER DEFAULT 0 CHECK (stock >= 0),
          description TEXT
        );

        CREATE TABLE IF NOT EXISTS employees (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          position TEXT NOT NULL,
          department TEXT NOT NULL,
          salary REAL CHECK (salary >= 0),
          hire_date DATE DEFAULT CURRENT_DATE,
          manager_id INTEGER,
          FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS departments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          budget REAL DEFAULT 0 CHECK (budget >= 0),
          location TEXT
        );
      `
      initialData = `
        INSERT INTO customers (name, email, phone, city, registration_date) VALUES
        ('Jan Kowalski', 'jan.kowalski@email.com', '+48 123 456 789', 'Warszawa', '2024-01-15'),
        ('Anna Nowak', 'anna.nowak@email.com', '+48 987 654 321', 'Krakow', '2024-02-20'),
        ('Piotr Wisniewski', 'piotr.wisniewski@email.com', '+48 555 333 222', 'Poznan', '2024-03-10'),
        ('Maria Wójcik', 'maria.wojcik@email.com', '+48 444 555 666', 'Wroclaw', '2024-04-05'),
        ('Tomasz Lewandowski', 'tomasz.lewandowski@email.com', '+48 777 888 999', 'Gdansk', '2024-05-12');

        INSERT INTO products (name, category, price, stock, description) VALUES
        ('Laptop Gaming', 'Elektronika', 3999.99, 15, 'Wydajny laptop do gier'),
        ('Smartphone Pro', 'Elektronika', 2499.99, 30, 'Najnowszy smartphone'),
        ('Monitor 27"', 'Elektronika', 899.99, 25, 'Monitor IPS 27 cali'),
        ('Klawiatura mechaniczna', 'Akcesoria', 299.99, 50, 'Klawiatura RGB'),
        ('Mysz bezprzewodowa', 'Akcesoria', 149.99, 60, 'Mysz ergonomiczna'),
        ('Sluchawki premium', 'Akcesoria', 599.99, 20, 'Sluchawki z ANC'),
        ('Kamera 4K', 'Elektronika', 1299.99, 10, 'Kamera internetowa'),
        ('Dysk SSD 1TB', 'Elektronika', 399.99, 40, 'Dysk NVMe SSD');

        INSERT INTO departments (name, budget, location) VALUES
        ('Sprzedaż', 50000.00, 'Warszawa'),
        ('IT', 150000.00, 'Warszawa'),
        ('Marketing', 30000.00, 'Krakow'),
        ('HR', 25000.00, 'Warszawa'),
        ('Produkcja', 100000.00, 'Poznan');

        INSERT INTO employees (name, position, department, salary, hire_date, manager_id) VALUES
        ('Adam Zielinski', 'Dyrektor', 'Sprzedaż', 15000.00, '2020-01-10', NULL),
        ('Ewa Kowalczyk', 'Manager Sprzedaży', 'Sprzedaż', 10000.00, '2021-03-15', 1),
        ('Kamil Mazur', 'Sprzedawca', 'Sprzedaż', 5000.00, '2023-06-01', 2),
        ('Joanna Krupa', 'Developer', 'IT', 12000.00, '2020-05-20', NULL),
        ('Marek Sokolowski', 'Senior Developer', 'IT', 10000.00, '2021-08-10', 4),
        ('Karolina Nowicka', 'Junior Developer', 'IT', 4500.00, '2023-09-15', 5),
        ('Pawel Kowal', 'Manager Marketingu', 'Marketing', 8000.00, '2020-11-01', NULL),
        ('Agnieszka Piotrowska', 'Specjalista HR', 'HR', 4500.00, '2022-02-14', NULL),
        ('Robert Grabowski', 'Inzynier Produkcji', 'Produkcja', 7000.00, '2021-07-20', NULL),
        ('Natalia Zajac', 'Pracownik Produkcji', 'Produkcja', 3500.00, '2023-04-10', 9);

        INSERT INTO orders (customer_id, product_name, quantity, price, order_date, status) VALUES
        (1, 'Laptop Gaming', 1, 3999.99, '2024-06-01', 'completed'),
        (1, 'Monitor 27"', 2, 899.99, '2024-06-01', 'completed'),
        (2, 'Smartphone Pro', 1, 2499.99, '2024-06-05', 'completed'),
        (2, 'Sluchawki premium', 1, 599.99, '2024-06-05', 'completed'),
        (3, 'Klawiatura mechaniczna', 2, 299.99, '2024-06-10', 'pending'),
        (4, 'Mysz bezprzewodowa', 1, 149.99, '2024-06-12', 'completed'),
        (5, 'Kamera 4K', 1, 1299.99, '2024-06-15', 'cancelled'),
        (5, 'Dysk SSD 1TB', 3, 399.99, '2024-06-15', 'completed'),
        (1, 'Dysk SSD 1TB', 1, 399.99, '2024-06-18', 'pending'),
        (3, 'Monitor 27"', 1, 899.99, '2024-06-20', 'completed');
      `
      break

    default:
      throw new Error(`Lesson ${lessonId} schema not defined`)
  }

  db.run(schema)

  const statements = initialData
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  statements.forEach(stmt => {
    try {
      db.run(stmt)
    } catch (e) {
      console.warn('Failed to execute statement:', stmt, e)
    }
  })

  const data = db.export()
  const buffer = Buffer.from(data)

  return buffer
}

export const loadDatabaseFromBuffer = async (buffer) => {
  const SQL = await loadSQL()
  const uint8Array = new Uint8Array(buffer)
  return new SQL.Database(uint8Array)
}

export const saveDatabaseToLocalStorage = (userId, lessonId, buffer) => {
  const key = `sqlite_${userId}_lesson${lessonId}`
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
  localStorage.setItem(key, base64)
}

export const loadDatabaseFromLocalStorage = (userId, lessonId) => {
  const key = `sqlite_${userId}_lesson${lessonId}`
  const base64 = localStorage.getItem(key)
  if (!base64) return null

  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

export const getDatabaseTables = (db) => {
  const result = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
  return result[0] ? result[0].values.map(row => row[0]) : []
}

export const getTableSchema = (db, tableName) => {
  const result = db.exec(`PRAGMA table_info(${tableName})`)
  if (!result[0]) return []

  return result[0].values.map(row => ({
    cid: row[0],
    name: row[1],
    type: row[2],
    notNull: row[3],
    defaultValue: row[4],
    primaryKey: row[5]
  }))
}

export const getTableData = (db, tableName, limit = 100) => {
  const result = db.exec(`SELECT * FROM ${tableName} LIMIT ${limit}`)
  if (!result[0]) return []

  return {
    columns: result[0].columns,
    rows: result[0].values
  }
}

export const executeSQL = (db, sql) => {
  try {
    const results = db.exec(sql)

    if (results.length === 0) {
      return {
        success: true,
        message: 'Zapytanie wykonane pomyślnie',
        affectedRows: db.getRowsModified(),
        data: null
      }
    }

    return {
      success: true,
      message: `Znaleziono ${results[0].values.length} wyników`,
      affectedRows: db.getRowsModified(),
      data: results.map(result => ({
        columns: result.columns,
        rows: result.values
      }))
    }
  } catch (error) {
    return {
      success: false,
      message: `Błąd: ${error.message}`,
      affectedRows: 0,
      data: null
    }
  }
}

export const downloadDatabase = (buffer, filename = 'database.sqlite') => {
  const blob = new Blob([buffer], { type: 'application/x-sqlite3' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const uploadDatabase = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const buffer = e.target.result
      resolve(buffer)
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export const resetLessonDatabase = async (userId, lessonId) => {
  const buffer = await createLessonDatabase(lessonId)
  saveDatabaseToLocalStorage(userId, lessonId, buffer)
  return buffer
}