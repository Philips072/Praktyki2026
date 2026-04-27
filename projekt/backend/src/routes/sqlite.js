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
import {
  validate,
  validateParams,
  initializeSchema,
  executeSchema,
  existsSchema,
  resetSchema,
  paramsUserIdLessonId,
  paramsUserIdLessonIdTable
} from '../middleware/validation.js';

const router = express.Router();

router.post('/initialize', validate(initializeSchema), async (req, res) => {
  const { userId, lessonId } = req.body;

  console.log('initialize request:', { userId, lessonId });

  try {
    await initializeDatabase(userId, lessonId);
    res.json({ success: true, message: 'Baza danych utworzona' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/execute', validate(executeSchema), async (req, res) => {
  console.log('=== /execute ===');
  console.log('req.body:', req.body);

  const { userId, lessonId, sql: sqlQuery } = req.body;

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

router.get('/tables/:userId/:lessonId', validateParams(paramsUserIdLessonId), async (req, res) => {
  const { userId, lessonId } = req.params;

  try {
    const tables = await getTables(userId, parseInt(lessonId));
    res.json({ success: true, tables });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/schema/:userId/:lessonId/:tableName', validateParams(paramsUserIdLessonIdTable), async (req, res) => {
  const { userId, lessonId, tableName } = req.params;

  try {
    const schema = await getTableSchema(userId, parseInt(lessonId), tableName);
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
router.get('/full-schema/:userId/:lessonId', validateParams(paramsUserIdLessonId), async (req, res) => {
  const { userId, lessonId } = req.params;

  try {
    const db = await createConnection(userId, parseInt(lessonId));
    const tables = await db.raw("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    await db.destroy();

    const fullSchema = {};

    for (const tableRow of tables) {
      const tableName = tableRow.name;
      const tableDb = await createConnection(userId, parseInt(lessonId));
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

router.post('/reset', validate(resetSchema), async (req, res) => {
  const { userId, lessonId } = req.body;

  try {
    await resetDatabase(userId, parseInt(lessonId));
    res.json({ success: true, message: 'Baza danych zresetowana' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/exists', validate(existsSchema), async (req, res) => {
  const { userId, lessonId } = req.body;

  try {
    const exists = await databaseExists(userId, parseInt(lessonId));
    res.json({ success: true, exists });
  } catch {
    res.json({ success: true, exists: false });
  }
});

export default router;
