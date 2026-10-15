-- GrubHub schema (SQLite). Dates are ISO 8601 UTC text.

CREATE TABLE IF NOT EXISTS users (
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

CREATE TABLE IF NOT EXISTS savedRecipes (
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

-- Speeds up listing a user's saves, newest first.
CREATE INDEX IF NOT EXISTS idx_savedRecipes_user_created
  ON savedRecipes (userId, createdAt, id);

CREATE TRIGGER IF NOT EXISTS trg_savedRecipes_updatedAt
AFTER UPDATE ON savedRecipes
FOR EACH ROW WHEN NEW.updatedAt = OLD.updatedAt
BEGIN
  UPDATE savedRecipes
  SET updatedAt = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  WHERE id = NEW.id;
END;
