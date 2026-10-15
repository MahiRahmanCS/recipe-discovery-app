// Shared SQLite connection for the backend.
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, '..', '..', 'database', 'grubhub.db');

const db = new Database(dbPath);

db.pragma('foreign_keys = ON'); // off by default in SQLite
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 5000');

module.exports = db;
