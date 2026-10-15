-- GrubHub database schema (SQLite)
--
-- Run this file against an empty database to create every table.
-- Dates are stored as ISO 8601 text in UTC, e.g. 2026-10-07T11:00:00.000Z

-- Registered accounts.
-- The password is never stored, only its bcrypt hash.
CREATE TABLE IF NOT EXISTS users (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  username     TEXT    NOT NULL,
  email        TEXT    NOT NULL,
  passwordHash TEXT    NOT NULL,
  displayName  TEXT    NOT NULL DEFAULT '',
  bio          TEXT    NOT NULL DEFAULT '',
  createdAt    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
