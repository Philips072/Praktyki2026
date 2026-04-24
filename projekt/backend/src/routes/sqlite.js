import express from 'express';
import {
  initializeDatabase,
  executeSQL,
  resetDatabase,
  databaseExists,
  getTables,
  getTableSchema,
  createConnection
} from '../db/knexConfig.js';

const router = express.Router();

router.post('/initialize', async (req, res) => {
  const { userId, lessonId } = req.body;

  console.log('initialize request:', { userId, lessonId });

  if (!userId || !lessonId) {
    return res.status(400).json({ error: 'userId i lessonId są wymagane' });
  }

  try {
    await initializeDatabase(userId, lessonId);
    res.json({ success: true, message: 'Baza danych utworzona' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/execute', async (req, res) => {
  console.log('=== /execute ===');
  console.log('req.body:', req.body);
  console.log('req.body type:', typeof req.body);

  const { userId, lessonId, sql: sqlQuery } = req.body;

  console.log('Extracted params:', { userId, lessonId, sql: sqlQuery });

  if (!userId || !lessonId || !sqlQuery) {
    console.log('Validation failed - missing params:', { userId: !!userId, lessonId: !!lessonId, sql: !!sqlQuery });
    return res.status(400).json({ error: 'userId, lessonId i sql są wymagane' });
  }

  try {
    const result = await executeSQL(userId, lessonId, sqlQuery);
    res.json(result);
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
    const tables = await getTables(userId, lessonId);
    res.json({ success: true, tables });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/schema/:userId/:lessonId/:tableName', async (req, res) => {
  const { userId, lessonId, tableName } = req.params;

  try {
    const schema = await getTableSchema(userId, lessonId, tableName);
    if (schema.length === 0) {
      return res.status(404).json({ error: 'Tabela nie istnieje' });
    }
    res.json({ success: true, schema });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sqlite/full-schema/:userId/:lessonId
// Returns the complete schema of all tables in the database
router.get('/full-schema/:userId/:lessonId', async (req, res) => {
  const { userId, lessonId } = req.params;

  try {
    const db = await createConnection(userId, lessonId);
    const tables = await db.raw("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    await db.destroy();

    const fullSchema = {};

    for (const tableRow of tables) {
      const tableName = tableRow.name;
      const tableDb = await createConnection(userId, lessonId);
      const pragmaResult = await tableDb.raw(`PRAGMA table_info(${tableName})`);

      const columns = pragmaResult.map(row => ({
        name: row.name,
        type: row.type,
        notNull: row.notnull === 1,
        defaultValue: row.dflt_value,
        primaryKey: row.pk === 1
      }));

      // Get foreign keys
      const fkResult = await tableDb.raw(`PRAGMA foreign_key_list(${tableName})`);
      await tableDb.destroy();

      fullSchema[tableName] = {
        columns,
        foreignKeys: fkResult
      };
    }

    res.json({ success: true, schema: fullSchema });
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
    await resetDatabase(userId, lessonId);
    res.json({ success: true, message: 'Baza danych zresetowana' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/exists', async (req, res) => {
  const { userId, lessonId } = req.body;

  if (!userId || !lessonId) {
    return res.status(400).json({ error: 'userId i lessonId są wymagane' });
  }

  try {
    const exists = await databaseExists(userId, lessonId);
    res.json({ success: true, exists });
  } catch {
    res.json({ success: true, exists: false });
  }
});

export default router;
