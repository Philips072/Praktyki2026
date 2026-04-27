import knex from 'knex';
import path from 'path';
import fs from 'fs/promises';

const DB_DIR = path.join(process.cwd(), 'databases');
const SANDBOX_DIR = path.join(process.cwd(), 'sandbox');

const ensureDbDir = async () => {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
};

const ensureSandboxDir = async () => {
  try {
    await fs.mkdir(SANDBOX_DIR, { recursive: true });
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
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

const getDbPath = (userId, lessonId) => path.join(DB_DIR, `${userId}_lesson${lessonId}.db`);

const createConnection = async (userId, lessonId) => {
  await ensureDbDir();
  const dbPath = getDbPath(userId, lessonId);

  return knex({
    client: 'sqlite3',
    connection: {
      filename: dbPath
    },
    useNullAsDefault: true
  });
};

const initializeDatabase = async (userId, lessonId) => {
  const db = await createConnection(userId, lessonId);

  const schemas = getSchemas();
  const initialData = getInitialData();

  if (!schemas[lessonId]) {
    throw new Error(`Lekcja ${lessonId} nie istnieje`);
  }

  await db.raw(schemas[lessonId]);

  initialData[lessonId]?.forEach(async (stmt) => {
    try {
      await db.raw(stmt);
    } catch (e) {
      console.warn('Błąd podczas wstawiania danych:', e.message);
    }
  });

  await db.destroy();
};

const resetDatabase = async (userId, lessonId) => {
  const dbPath = getDbPath(userId, lessonId);

  try {
    await fs.unlink(dbPath);
  } catch (e) {
    // File doesn't exist, that's ok
  }

  await initializeDatabase(userId, lessonId);
};

const databaseExists = async (userId, lessonId) => {
  try {
    const dbPath = getDbPath(userId, lessonId);
    await fs.access(dbPath);
    return true;
  } catch {
    return false;
  }
};

const getTables = async (userId, lessonId) => {
  const db = await createConnection(userId, lessonId);
  const result = await db.raw("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
  await db.destroy();
  return result.map(row => row.name);
};

const getTableSchema = async (userId, lessonId, tableName) => {
  const db = await createConnection(userId, lessonId);
  const result = await db.raw(`PRAGMA table_info(${tableName})`);
  await db.destroy();
  return result.map(row => ({
    cid: row.cid,
    name: row.name,
    type: row.type,
    notNull: row.notnull === 1,
    defaultValue: row.dflt_value,
    primaryKey: row.pk === 1
  }));
};

const executeSQL = async (userId, lessonId, sqlQuery) => {
  const db = await createConnection(userId, lessonId);

  let processedSql = sqlQuery.trim();
  const normalizedSql = processedSql.toUpperCase();

  // MySQL commands that don't work in SQLite - return success but ignore
  if (normalizedSql.startsWith('CREATE DATABASE') || normalizedSql.startsWith('USE') || normalizedSql.startsWith('DROP DATABASE')) {
    await db.destroy();
    return {
      success: true,
      message: 'Polecenie DDL ignorowane (CREATE DATABASE, USE, DROP DATABASE nie są obsługiwane w tej wersji)',
      affectedRows: 0,
      data: null
    };
  }

  // Handle SHOW TABLES - return list of tables
  if (normalizedSql === 'SHOW TABLES' || normalizedSql.startsWith('SHOW TABLES')) {
    try {
      const result = await db.raw("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
      await db.destroy();

      const tableNames = result.map(row => ({ name: row.name }));

      return {
        success: true,
        message: `Znaleziono ${tableNames.length} tabel`,
        affectedRows: 0,
        data: [{ columns: ['name'], rows: tableNames.map(t => [t.name]) }]
      };
    } catch (e) {
      await db.destroy();
      return {
        success: true,
        message: 'Polecenie SHOW TABLES ignorowane',
        affectedRows: 0,
        data: [{ columns: ['name'], rows: [] }]
      };
    }
  }

  // Handle DESCRIBE - return table schema
  const describeMatch = normalizedSql.match(/^DESCRIBE\s+(\w+)|^DESC\s+(\w+)/);
  if (describeMatch) {
    const tableName = describeMatch[1] || describeMatch[2];

    try {
      const pragmaResult = await db.raw(`PRAGMA table_info(${tableName})`);
      await db.destroy();

      const rows = pragmaResult.map(row => [
        row.name,           // Field
        row.type,           // Type
        row.notnull ? 'NO' : 'YES',  // Null
        row.pk === 1 ? 'PRI' : '',    // Key
        row.dflt_value || ''             // Default
      ]);

      return {
        success: true,
        message: `Struktura tabeli ${tableName}`,
        affectedRows: 0,
        data: [{
          columns: ['Field', 'Type', 'Null', 'Key', 'Default'],
          rows
        }]
      };
    } catch (e) {
      await db.destroy();
      throw new Error(`Tabela '${tableName}' nie istnieje`);
    }
  }

  // Extract table name from CREATE TABLE and drop if exists before creating
  const createTableMatch = normalizedSql.match(/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z_][a-zA-Z0-9_]*)/i);
  let tableNameToDrop = null;

  if (createTableMatch) {
    tableNameToDrop = createTableMatch[1];

    try {
      // Drop table if it exists BEFORE creating
      await db.raw(`DROP TABLE IF EXISTS [${tableNameToDrop}]`);
    } catch (e) {
      console.warn('Error dropping table:', e.message);
    }
  }

  // Handle DROP TABLE - add IF NOT EXISTS for safety
  const dropTableMatch = normalizedSql.match(/DROP\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
  if (dropTableMatch) {
    const tableName = dropTableMatch[1];
    processedSql = processedSql.replace(/DROP\s+TABLE\s+/i, `DROP TABLE IF EXISTS `);
  }

  // Convert AUTO_INCREMENT to AUTOINCREMENT for SQLite
  processedSql = processedSql.replace(/\bAUTO_INCREMENT\b/gi, 'AUTOINCREMENT');

  try {
    const isSelect = normalizedSql.startsWith('SELECT');

    if (isSelect) {
      const result = await db.raw(processedSql);
      await db.destroy();

      const rows = Array.isArray(result) ? result : [];
      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

      return {
        success: true,
        message: `Znaleziono ${rows.length} wyników`,
        affectedRows: 0,
        data: [{ columns, rows: rows.map(row => Object.values(row)) }]
      };
    } else {
      const result = await db.raw(processedSql);
      await db.destroy();

      return {
        success: true,
        message: 'Zapytanie wykonane pomyślnie',
        affectedRows: result?.changes || 0,
        data: null
      };
    }
  } catch (error) {
    await db.destroy();
    throw error;
  }
};

const getSandboxDbPath = (userId, dbId) => path.join(SANDBOX_DIR, `${userId}_${dbId}.db`);

const createSandboxConnection = async (userId, dbId) => {
  await ensureSandboxDir();
  const dbPath = getSandboxDbPath(userId, dbId);

  return knex({
    client: 'sqlite3',
    connection: {
      filename: dbPath
    },
    useNullAsDefault: true
  });
};

const getUserSandboxDatabases = async (userId) => {
  await ensureSandboxDir();
  try {
    const files = await fs.readdir(SANDBOX_DIR);
    const sandboxDbs = files
      .filter(file => file.startsWith(`${userId}_`) && file.endsWith('.db'))
      .map(file => {
        const dbId = file.substring(userId.length + 1, file.length - 3);
        return dbId;
      });
    return sandboxDbs;
  } catch {
    return [];
  }
};

const initializeSandboxDatabase = async (userId, dbId) => {
  const db = await createSandboxConnection(userId, dbId);

  await db.destroy();
};

const executeSandboxSQL = async (userId, dbId, sqlQuery) => {
  const db = await createSandboxConnection(userId, dbId);

  let processedSql = sqlQuery.trim();
  const normalizedSql = processedSql.toUpperCase();

  if (normalizedSql.startsWith('CREATE DATABASE') || normalizedSql.startsWith('USE') || normalizedSql.startsWith('DROP DATABASE')) {
    await db.destroy();
    return {
      success: true,
      message: 'Polecenie DDL ignorowane (CREATE DATABASE, USE, DROP DATABASE nie są obsługiwane w tej wersji)',
      affectedRows: 0,
      data: null
    };
  }

  if (normalizedSql === 'SHOW TABLES' || normalizedSql.startsWith('SHOW TABLES')) {
    try {
      const result = await db.raw("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
      await db.destroy();
      return {
        success: true,
        message: `Znaleziono ${result.length} tabel`,
        affectedRows: 0,
        data: [{ columns: ['name'], rows: result.map(r => [r.name]) }]
      };
    } catch (e) {
      await db.destroy();
      return {
        success: true,
        message: 'Polecenie SHOW TABLES ignorowane',
        affectedRows: 0,
        data: [{ columns: ['name'], rows: [] }]
      };
    }
  }

  const describeMatch = normalizedSql.match(/^DESCRIBE\s+(\w+)|^DESC\s+(\w+)/);
  if (describeMatch) {
    const tableName = describeMatch[1] || describeMatch[2];
    try {
      const pragmaResult = await db.raw(`PRAGMA table_info(${tableName})`);
      await db.destroy();
      const rows = pragmaResult.map(row => [
        row.name, row.type, row.notnull ? 'NO' : 'YES', row.pk === 1 ? 'PRI' : '', row.dflt_value || ''
      ]);
      return {
        success: true,
        message: `Struktura tabeli ${tableName}`,
        affectedRows: 0,
        data: [{ columns: ['Field', 'Type', 'Null', 'Key', 'Default'], rows }]
      };
    } catch (e) {
      await db.destroy();
      throw new Error(`Tabela '${tableName}' nie istnieje`);
    }
  }

  const createTableMatch = normalizedSql.match(/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z_][a-zA-Z0-9_]*)/i);
  if (createTableMatch) {
    const tableNameToDrop = createTableMatch[1];
    try {
      await db.raw(`DROP TABLE IF EXISTS [${tableNameToDrop}]`);
    } catch (e) {
      console.warn('Error dropping table:', e.message);
    }
  }

  const dropTableMatch = normalizedSql.match(/DROP\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
  if (dropTableMatch) {
    processedSql = processedSql.replace(/DROP\s+TABLE\s+/i, `DROP TABLE IF EXISTS `);
  }

  processedSql = processedSql.replace(/\bAUTO_INCREMENT\b/gi, 'AUTOINCREMENT');

  try {
    const isSelect = normalizedSql.startsWith('SELECT');
    if (isSelect) {
      const result = await db.raw(processedSql);
      await db.destroy();
      const rows = Array.isArray(result) ? result : [];
      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
      return {
        success: true,
        message: `Znaleziono ${rows.length} wyników`,
        affectedRows: 0,
        data: [{ columns, rows: rows.map(row => Object.values(row)) }]
      };
    } else {
      const result = await db.raw(processedSql);
      await db.destroy();
      return {
        success: true,
        message: 'Zapytanie wykonane pomyślnie',
        affectedRows: result?.changes || 0,
        data: null
      };
    }
  } catch (error) {
    await db.destroy();
    throw error;
  }
};

const getSandboxTables = async (userId, dbId) => {
  const db = await createSandboxConnection(userId, dbId);
  const result = await db.raw("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
  await db.destroy();
  return result.map(row => row.name);
};

const getSandboxTableSchema = async (userId, dbId, tableName) => {
  const db = await createSandboxConnection(userId, dbId);
  const result = await db.raw(`PRAGMA table_info(${tableName})`);
  await db.destroy();
  return result.map(row => ({
    cid: row.cid,
    name: row.name,
    type: row.type,
    notNull: row.notnull === 1,
    defaultValue: row.dflt_value,
    primaryKey: row.pk === 1
  }));
};

const getSandboxTableData = async (userId, dbId, tableName, limit = 100) => {
  const db = await createSandboxConnection(userId, dbId);
  const result = await db.raw(`SELECT * FROM ${tableName} LIMIT ${limit}`);
  await db.destroy();
  const rows = Array.isArray(result) ? result : [];
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  return { columns, rows: rows.map(row => Object.values(row)) };
};

const sandboxDatabaseExists = async (userId, dbId) => {
  try {
    const dbPath = getSandboxDbPath(userId, dbId);
    await fs.access(dbPath);
    return true;
  } catch {
    return false;
  }
};

const dropSandboxDatabase = async (userId, dbId) => {
  const dbPath = getSandboxDbPath(userId, dbId);

  // Nie pozwól usunąć głównej bazy danych
  if (dbId === 'main') {
    throw new Error('Nie można usunąć głównej bazy danych');
  }

  try {
    await fs.unlink(dbPath);
    return true;
  } catch (e) {
    throw new Error(`Nie można usunąć bazy danych: ${e.message}`);
  }
};

export {
  ensureDbDir,
  getSchemas,
  getInitialData,
  getDbPath,
  createConnection,
  initializeDatabase,
  resetDatabase,
  databaseExists,
  getTables,
  getTableSchema,
  executeSQL,
  ensureSandboxDir,
  getSandboxDbPath,
  createSandboxConnection,
  getUserSandboxDatabases,
  initializeSandboxDatabase,
  executeSandboxSQL,
  getSandboxTables,
  getSandboxTableSchema,
  getSandboxTableData,
  sandboxDatabaseExists,
  dropSandboxDatabase
};
