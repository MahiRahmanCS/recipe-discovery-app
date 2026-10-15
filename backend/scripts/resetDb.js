// Drops all tables so db:init and db:seed can rebuild them from scratch.
const db = require('../config/db');

db.exec(`
  DROP TABLE IF EXISTS savedRecipes;
  DROP TABLE IF EXISTS users;
`);

console.log('Dropped all tables');
db.close();
