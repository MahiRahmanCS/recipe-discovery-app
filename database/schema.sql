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
