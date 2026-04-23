import express from 'express';
import initSqlJs from 'sql.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import fsSync from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const DB_DIR = path.join(__dirname, '../../databases');
let SQL = null;

const initSQL = async () => {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  return SQL;
};

const ensureDbDir = async () => {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
};

const getDbPath = (userId, lessonId) => path.join(DB_DIR, `${userId}_lesson${lessonId}.db`);

const getDb = async (userId, lessonId) => {
  const sql = await initSQL();
  const dbPath = getDbPath(userId, lessonId);

  try {
    const data = await fs.readFile(dbPath);
    return new sql.Database(data);
  } catch (e) {
    return new sql.Database();
  }
};

const saveDb = async (db, userId, lessonId) => {
  await ensureDbDir();
  const data = db.export();
  const buffer = Buffer.from(data);
  await fs.writeFile(getDbPath(userId, lessonId), buffer);
};

const getSchemas = () => ({
  1: `
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
  `,
  2: `
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      enrollment_date DATE DEFAULT CURRENT_DATE
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      credits INTEGER DEFAULT 1 CHECK (credits > 0),
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      enrollment_date DATE DEFAULT CURRENT_DATE,
      grade TEXT CHECK (grade IN ('A', 'B', 'C', 'D', 'F')),
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
      UNIQUE(student_id, course_id)
    );
  `
});

const getInitialData = () => ({
  1: [
    `INSERT INTO customers (name, email, phone, city, registration_date) VALUES
    ('Jan Kowalski', 'jan.kowalski@email.com', '+48 123 456 789', 'Warszawa', '2024-01-15'),
    ('Anna Nowak', 'anna.nowak@email.com', '+48 987 654 321', 'Krakow', '2024-02-20'),
    ('Piotr Wisniewski', 'piotr.wisniewski@email.com', '+48 555 333 222', 'Poznan', '2024-03-10'),
    ('Maria Wójcik', 'maria.wojcik@email.com', '+48 444 555 666', 'Wroclaw', '2024-04-05'),
    ('Tomasz Lewandowski', 'tomasz.lewandowski@email.com', '+48 777 888 999', 'Gdansk', '2024-05-12');`,
    `INSERT INTO products (name, category, price, stock, description) VALUES
    ('Laptop Gaming', 'Elektronika', 3999.99, 15, 'Wydajny laptop do gier'),
    ('Smartphone Pro', 'Elektronika', 2499.99, 30, 'Najnowszy smartphone'),
    ('Monitor 27"', 'Elektronika', 899.99, 25, 'Monitor IPS 27 cali'),
    ('Klawiatura mechaniczna', 'Akcesoria', 299.99, 50, 'Klawiatura RGB'),
    ('Mysz bezprzewodowa', 'Akcesoria', 149.99, 60, 'Mysz ergonomiczna'),
    ('Sluchawki premium', 'Akcesoria', 599.99, 20, 'Sluchawki z ANC'),
    ('Kamera 4K', 'Elektronika', 1299.99, 10, 'Kamera internetowa'),
    ('Dysk SSD 1TB', 'Elektronika', 399.99, 40, 'Dysk NVMe SSD');`,
    `INSERT INTO departments (name, budget, location) VALUES
    ('Sprzedaż', 50000.00, 'Warszawa'),
    ('IT', 150000.00, 'Warszawa'),
    ('Marketing', 30000.00, 'Krakow'),
    ('HR', 25000.00, 'Warszawa'),
    ('Produkcja', 100000.00, 'Poznan');`,
    `INSERT INTO employees (name, position, department, salary, hire_date, manager_id) VALUES
    ('Adam Zielinski', 'Dyrektor', 'Sprzedaż', 15000.00, '2020-01-10', NULL),
    ('Ewa Kowalczyk', 'Manager Sprzedaży', 'Sprzedaż', 10000.00, '2021-03-15', 1),
    ('Kamil Mazur', 'Sprzedawca', 'Sprzedaż', 5000.00, '2023-06-01', 2),
    ('Joanna Krupa', 'Developer', 'IT', 12000.00, '2020-05-20', NULL),
    ('Marek Sokolowski', 'Senior Developer', 'IT', 10000.00, '2021-08-10', 4),
    ('Karolina Nowicka', 'Junior Developer', 'IT', 4500.00, '2023-09-15', 5),
    ('Pawel Kowal', 'Manager Marketingu', 'Marketing', 8000.00, '2020-11-01', NULL),
    ('Agnieszka Piotrowska', 'Specjalista HR', 'HR', 4500.00, '2022-02-14', NULL),
    ('Robert Grabowski', 'Inzynier Produkcji', 'Produkcja', 7000.00, '2021-07-20', NULL),
    ('Natalia Zajac', 'Pracownik Produkcji', 'Produkcja', 3500.00, '2023-04-10', 9);`,
    `INSERT INTO orders (customer_id, product_name, quantity, price, order_date, status) VALUES
    (1, 'Laptop Gaming', 1, 3999.99, '2024-06-01', 'completed'),
    (1, 'Monitor 27"', 2, 899.99, '2024-06-01', 'completed'),
    (2, 'Smartphone Pro', 1, 2499.99, '2024-06-05', 'completed'),
    (2, 'Sluchawki premium', 1, 599.99, '2024-06-05', 'completed'),
    (3, 'Klawiatura mechaniczna', 2, 299.99, '2024-06-10', 'pending'),
    (4, 'Mysz bezprzewodowa', 1, 149.99, '2024-06-12', 'completed'),
    (5, 'Kamera 4K', 1, 1299.99, '2024-06-15', 'cancelled'),
    (5, 'Dysk SSD 1TB', 3, 399.99, '2024-06-15', 'completed'),
    (1, 'Dysk SSD 1TB', 1, 399.99, '2024-06-18', 'pending'),
    (3, 'Monitor 27"', 1, 899.99, '2024-06-20', 'completed');`
  ],
  2: [
    `INSERT INTO students (first_name, last_name, email, enrollment_date) VALUES
    ('Anna', 'Kowalska', 'anna.kowalska@uni.edu', '2023-09-01'),
    ('Piotr', 'Nowak', 'piotr.nowak@uni.edu', '2023-09-01'),
    ('Maria', 'Wójcik', 'maria.wojcik@uni.edu', '2023-09-01'),
    ('Jan', 'Lewandowski', 'jan.lewandowski@uni.edu', '2023-09-01'),
    ('Ewa', 'Zielińska', 'ewa.zielinska@uni.edu', '2023-09-01');`,
    `INSERT INTO courses (name, code, credits, description) VALUES
    ('Programowanie w Pythonie', 'PY101', 3, 'Podstawy programowania w Pythonie'),
    ('Bazy danych SQL', 'SQL201', 4, 'Zaawansowane zapytania SQL'),
    ('Web Development', 'WD301', 3, 'Tworzenie stron WWW'),
    ('Algorytmy i struktury danych', 'AS401', 4, 'Podstawy algorytmiki'),
    ('Matematyka dyskretna', 'MD501', 3, 'Teoria grafów i kombinatoryka');`,
    `INSERT INTO enrollments (student_id, course_id, enrollment_date, grade) VALUES
    (1, 1, '2023-09-15', 'A'),
    (1, 2, '2023-09-15', 'B'),
    (2, 1, '2023-09-15', 'A'),
    (2, 3, '2023-09-15', 'C'),
    (3, 2, '2023-09-15', 'A'),
    (3, 4, '2023-09-15', 'B'),
    (4, 3, '2023-09-15', 'A'),
    (4, 5, '2023-09-15', 'B'),
    (5, 4, '2023-09-15', 'A');`
  ]
});

router.post('/initialize', async (req, res) => {
  const { userId, lessonId } = req.body;

  console.log('initialize request:', { userId, lessonId });

  if (!userId || !lessonId) {
    return res.status(400).json({ error: 'userId i lessonId są wymagane' });
  }

  const schemas = getSchemas();
  const initialData = getInitialData();

  if (!schemas[lessonId]) {
    return res.status(400).json({ error: `Lekcja ${lessonId} nie istnieje` });
  }

  try {
    const sql = await initSQL();
    const db = new sql.Database();
    db.run(schemas[lessonId]);

    initialData[lessonId]?.forEach(stmt => {
      try {
        db.run(stmt);
      } catch (e) {
        console.warn('Błąd podczas wstawiania danych:', e.message);
      }
    });

    await saveDb(db, userId, lessonId);
    db.close();
    res.json({ success: true, message: 'Baza danych utworzona' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/execute', async (req, res) => {
  console.log('=== /execute ===')
  console.log('req.body:', req.body)
  console.log('req.body type:', typeof req.body)

  const { userId, lessonId, sql: sqlQuery } = req.body;

  console.log('Extracted params:', { userId, lessonId, sql: sqlQuery });

  if (!userId || !lessonId || !sqlQuery) {
    console.log('Validation failed - missing params:', { userId: !!userId, lessonId: !!lessonId, sql: !!sqlQuery });
    return res.status(400).json({ error: 'userId, lessonId i sql są wymagane' });
  }

  const normalizedSql = sqlQuery.trim().toUpperCase();

  if (normalizedSql.startsWith('CREATE DATABASE') || normalizedSql.startsWith('USE')) {
    console.log('Ignorowano polecenie DDL:', normalizedSql);
    return res.json({
      success: true,
      message: 'Polecenie DDL ignorowane (CREATE DATABASE, USE nie są obsługiwane w tej wersji)',
      affectedRows: 0,
      data: null
    });
  }

  try {
    const db = await getDb(userId, lessonId);

    const result = db.exec(sqlQuery);

    const isSelect = result.length > 0;

    db.close();

    if (isSelect) {
      res.json({
        success: true,
        message: `Znaleziono ${result[0].values.length} wyników`,
        affectedRows: 0,
        data: result.map(r => ({
          columns: r.columns,
          rows: r.values
        }))
      });
    } else {
      res.json({
        success: true,
        message: 'Zapytanie wykonane pomyślnie',
        affectedRows: db.getRowsModified(),
        data: null
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Błąd: ${error.message}`,
      affectedRows: 0,
      data: null
    });
  }
});

router.get('/tables/:userId/:lessonId', async (req, res) => {
  const { userId, lessonId } = req.params;

  try {
    const db = await getDb(userId, lessonId);
    const result = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    db.close();

    const tables = result[0] ? result[0].values.map(row => row[0]) : [];
    res.json({ success: true, tables });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/schema/:userId/:lessonId/:tableName', async (req, res) => {
  const { userId, lessonId, tableName } = req.params;

  try {
    const db = await getDb(userId, lessonId);
    const result = db.exec(`PRAGMA table_info(${tableName})`);
    db.close();

    if (!result[0]) {
      return res.status(404).json({ error: 'Tabela nie istnieje' });
    }

    const schema = result[0].values.map(row => ({
      cid: row[0],
      name: row[1],
      type: row[2],
      notNull: row[3],
      defaultValue: row[4],
      primaryKey: row[5]
    }));

    res.json({ success: true, schema });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/data/:userId/:lessonId/:tableName', async (req, res) => {
  const { userId, lessonId, tableName } = req.params;
  const limit = parseInt(req.query.limit) || 100;

  try {
    const db = await getDb(userId, lessonId);
    const result = db.exec(`SELECT * FROM ${tableName} LIMIT ${limit}`);
    db.close();

    if (!result[0]) {
      return res.json({ success: true, columns: [], rows: [] });
    }

    res.json({
      success: true,
      columns: result[0].columns,
      rows: result[0].values
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reset', async (req, res) => {
  const { userId, lessonId } = req.body;

  if (!userId || !lessonId) {
    return res.status(400).json({ error: 'userId i lessonId są wymagane' });
  }

  try {
    const dbPath = getDbPath(userId, lessonId);
    try {
      await fs.unlink(dbPath);
    } catch (e) {
      // File doesn't exist, that's ok
    }

    const schemas = getSchemas();
    const initialData = getInitialData();

    if (!schemas[lessonId]) {
      return res.status(400).json({ error: `Lekcja ${lessonId} nie istnieje` });
    }

    const sql = await initSQL();
    const db = new sql.Database();
    db.run(schemas[lessonId]);

    initialData[lessonId]?.forEach(stmt => {
      try {
        db.run(stmt);
      } catch (e) {
        console.warn('Błąd podczas wstawiania danych:', e.message);
      }
    });

    await saveDb(db, userId, lessonId);
    db.close();
    res.json({ success: true, message: 'Baza danych zresetowana' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/download', async (req, res) => {
  const { userId, lessonId } = req.body;

  if (!userId || !lessonId) {
    return res.status(400).json({ error: 'userId i lessonId są wymagane' });
  }

  const dbPath = getDbPath(userId, lessonId);

  try {
    await fs.access(dbPath);
    const data = await fs.readFile(dbPath);
    const base64 = data.toString('base64');
    res.json({ success: true, data: base64 });
  } catch (error) {
    res.status(404).json({ error: 'Baza danych nie istnieje' });
  }
});

router.post('/upload', async (req, res) => {
  const { userId, lessonId, data } = req.body;

  if (!userId || !lessonId || !data) {
    return res.status(400).json({ error: 'userId, lessonId i data są wymagane' });
  }

  try {
    await ensureDbDir();
    const dbPath = getDbPath(userId, lessonId);
    const buffer = Buffer.from(data, 'base64');
    await fs.writeFile(dbPath, buffer);

    res.json({ success: true, message: 'Baza danych wgrana' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/exists', async (req, res) => {
  const { userId, lessonId } = req.body;

  if (!userId || !lessonId) {
    return res.status(400).json({ error: 'userId i lessonId są wymagane' });
  }

  const dbPath = getDbPath(userId, lessonId);

  try {
    await fs.access(dbPath);
    res.json({ success: true, exists: true });
  } catch {
    res.json({ success: true, exists: false });
  }
});

export default router;
