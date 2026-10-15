// Creates the tables from database/schema.sql. Safe to run more than once.
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');

db.exec(fs.readFileSync(schemaPath, 'utf8'));

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")
  .pluck()
  .all();

console.log(`Database ready at ${db.name}`);
console.log(`Tables: ${tables.join(', ')}`);
db.close();
