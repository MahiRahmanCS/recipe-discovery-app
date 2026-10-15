-- GrubHub database dump
PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

CREATE TABLE users (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  username     TEXT    NOT NULL UNIQUE COLLATE NOCASE
               CHECK (length(username) BETWEEN 3 AND 30
                      AND username NOT GLOB '*[^A-Za-z0-9_]*'),
  email        TEXT    NOT NULL UNIQUE
               CHECK (length(email) BETWEEN 3 AND 254
                      AND email = lower(email)
                      AND email LIKE '%_@_%'),
  passwordHash TEXT    NOT NULL CHECK (length(passwordHash) > 0), -- bcrypt hash only
  displayName  TEXT    NOT NULL DEFAULT '' CHECK (length(displayName) <= 50),
  bio          TEXT    NOT NULL DEFAULT '' CHECK (length(bio) <= 300),
  createdAt    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
INSERT INTO "users" ("id", "username", "email", "passwordHash", "displayName", "bio", "createdAt") VALUES (1, 'sam_cooks', 'sam@example.com', '$2b$12$Xq0bCsO437Qvg6mvOl75.uq9NuiGKFX.HMP/oaG.5rx9FCXM1vH1K', 'Sam', 'Weeknight cook, pasta fan', '2026-10-15T13:40:27.938Z');
INSERT INTO "users" ("id", "username", "email", "passwordHash", "displayName", "bio", "createdAt") VALUES (2, 'alex_bakes', 'alex@example.com', '$2b$12$Xq0bCsO437Qvg6mvOl75.uq9NuiGKFX.HMP/oaG.5rx9FCXM1vH1K', 'Alex', '', '2026-10-15T13:40:27.938Z');

CREATE TABLE savedRecipes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  userId      INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  mealId      TEXT    NOT NULL -- TheMealDB idMeal
              CHECK (length(mealId) BETWEEN 1 AND 20
                     AND mealId GLOB '[1-9]*'
                     AND mealId NOT GLOB '*[^0-9]*'),
  title       TEXT    NOT NULL CHECK (length(trim(title)) > 0 AND length(title) <= 200),
  thumbnail   TEXT    NOT NULL DEFAULT ''
              CHECK (length(thumbnail) <= 2048 AND (thumbnail = '' OR thumbnail LIKE 'https://%')),
  category    TEXT    NOT NULL DEFAULT '' CHECK (length(category) <= 100),
  area        TEXT    NOT NULL DEFAULT '' CHECK (length(area) <= 100),
  status      TEXT    NOT NULL DEFAULT 'want_to_cook' CHECK (status IN ('want_to_cook', 'cooked')),
  isFavourite INTEGER NOT NULL DEFAULT 0 CHECK (isFavourite IN (0, 1)),
  notes       TEXT    NOT NULL DEFAULT '' CHECK (length(notes) <= 1000),
  rating      INTEGER CHECK (rating IS NULL OR (typeof(rating) = 'integer' AND rating BETWEEN 1 AND 5)),
  createdAt   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updatedAt   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (userId, mealId) -- one save per recipe per user
);
INSERT INTO "savedRecipes" ("id", "userId", "mealId", "title", "thumbnail", "category", "area", "status", "isFavourite", "notes", "rating", "createdAt", "updatedAt") VALUES (1, 1, '52772', 'Teriyaki Chicken Casserole', 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg', 'Chicken', 'Japanese', 'cooked', 1, 'Halve the soy sauce next time', 4, '2026-10-15T13:40:27.938Z', '2026-10-15T13:40:27.938Z');
INSERT INTO "savedRecipes" ("id", "userId", "mealId", "title", "thumbnail", "category", "area", "status", "isFavourite", "notes", "rating", "createdAt", "updatedAt") VALUES (2, 1, '52771', 'Spicy Arrabiata Penne', 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg', 'Vegetarian', 'Italian', 'want_to_cook', 0, '', NULL, '2026-10-15T13:40:27.938Z', '2026-10-15T13:40:27.938Z');
INSERT INTO "savedRecipes" ("id", "userId", "mealId", "title", "thumbnail", "category", "area", "status", "isFavourite", "notes", "rating", "createdAt", "updatedAt") VALUES (3, 1, '52959', 'Baked salmon with fennel & tomatoes', 'https://www.themealdb.com/images/media/meals/1548772327.jpg', 'Seafood', 'British', 'cooked', 0, 'Good with rice', 3, '2026-10-15T13:40:27.938Z', '2026-10-15T13:40:27.938Z');
INSERT INTO "savedRecipes" ("id", "userId", "mealId", "title", "thumbnail", "category", "area", "status", "isFavourite", "notes", "rating", "createdAt", "updatedAt") VALUES (4, 2, '52874', 'Beef and Mustard Pie', 'https://www.themealdb.com/images/media/meals/sytuqu1511553755.jpg', 'Beef', 'British', 'want_to_cook', 1, '', NULL, '2026-10-15T13:40:27.938Z', '2026-10-15T13:40:27.938Z');
INSERT INTO "savedRecipes" ("id", "userId", "mealId", "title", "thumbnail", "category", "area", "status", "isFavourite", "notes", "rating", "createdAt", "updatedAt") VALUES (5, 2, '52772', 'Teriyaki Chicken Casserole', 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg', 'Chicken', 'Japanese', 'want_to_cook', 0, '', NULL, '2026-10-15T13:40:27.938Z', '2026-10-15T13:40:27.938Z');

DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name", "seq") VALUES ('users', 2);
INSERT INTO "sqlite_sequence" ("name", "seq") VALUES ('savedRecipes', 5);

CREATE INDEX idx_savedRecipes_user_created
  ON savedRecipes (userId, createdAt, id);

CREATE TRIGGER trg_savedRecipes_updatedAt
AFTER UPDATE ON savedRecipes
FOR EACH ROW WHEN NEW.updatedAt = OLD.updatedAt
BEGIN
  UPDATE savedRecipes
  SET updatedAt = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  WHERE id = NEW.id;
END;

COMMIT;
PRAGMA foreign_keys = ON;
