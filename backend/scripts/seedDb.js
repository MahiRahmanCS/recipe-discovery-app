// Replaces all rows with demo users and saved recipes. Run db:init first.
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.json');
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

const insertUser = db.prepare(`
  INSERT INTO users (username, email, passwordHash, displayName, bio)
  VALUES (@username, @email, @passwordHash, @displayName, @bio)
`);

const insertRecipe = db.prepare(`
  INSERT INTO savedRecipes
    (userId, mealId, title, thumbnail, category, area, status, isFavourite, notes, rating)
  VALUES
    (@userId, @mealId, @title, @thumbnail, @category, @area, @status, @isFavourite, @notes, @rating)
`);

const passwordHash = bcrypt.hashSync(seed.demoPassword, 12);

db.transaction(() => {
  db.exec(`
    DELETE FROM savedRecipes;
    DELETE FROM users;
    DELETE FROM sqlite_sequence WHERE name IN ('users', 'savedRecipes');
  `);

  for (const { savedRecipes, ...user } of seed.users) {
    const userId = insertUser.run({ ...user, passwordHash }).lastInsertRowid;

    for (const recipe of savedRecipes) {
      insertRecipe.run({ ...recipe, userId, isFavourite: recipe.isFavourite ? 1 : 0 });
    }
  }
})();

const count = (table) => db.prepare(`SELECT COUNT(*) FROM ${table}`).pluck().get();
console.log(`Seeded ${count('users')} users and ${count('savedRecipes')} saved recipes`);
console.log(`Demo password for all users: ${seed.demoPassword}`);
db.close();
