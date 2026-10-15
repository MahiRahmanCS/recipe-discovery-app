// Writes database/dump.sql: the full schema plus every row.
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const outPath = path.join(__dirname, '..', '..', 'database', 'dump.sql');

const quote = (value) => {
  if (value === null) return 'NULL';
  if (typeof value === 'number' || typeof value === 'bigint') return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
};

const insertRows = (table) =>
  db.prepare(`SELECT * FROM "${table}"`).all().map((row) => {
    const columns = Object.keys(row).map((c) => `"${c}"`).join(', ');
    const values = Object.values(row).map(quote).join(', ');
    return `INSERT INTO "${table}" (${columns}) VALUES (${values});`;
  });

const schema = db
  .prepare("SELECT type, name, sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY rowid")
  .all();

const lines = ['-- GrubHub database dump', 'PRAGMA foreign_keys = OFF;', 'BEGIN TRANSACTION;'];

for (const { name, sql } of schema.filter((o) => o.type === 'table')) {
  lines.push('', `${sql};`, ...insertRows(name));
}

lines.push('', 'DELETE FROM sqlite_sequence;', ...insertRows('sqlite_sequence'));

for (const { sql } of schema.filter((o) => o.type !== 'table')) {
  lines.push('', `${sql};`);
}

lines.push('', 'COMMIT;', 'PRAGMA foreign_keys = ON;', '');

fs.writeFileSync(outPath, lines.join('\n'));
console.log(`Dump written to ${outPath}`);
db.close();
