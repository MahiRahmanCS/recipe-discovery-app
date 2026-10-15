# GrubHub

A recipe discovery project built by Aayan (frontend) and Mahi (backend).

## Run the frontend

Install **Node.js 24 LTS** from https://nodejs.org/en/download, including npm. After installation, close and reopen your VS Code terminal.

From the project folder in PowerShell:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open **http://localhost:5173**. Keep the terminal running; press **Ctrl+C** to stop it. You only need to install dependencies the first time, or after dependency changes. On later visits, run `npm.cmd run dev` from `frontend`.

`npm.cmd` also works when PowerShell blocks the `npm.ps1` launcher. In other shells, use `npm`.

The frontend loads recipe inspiration automatically, searches recipes by name, and browses TheMealDB's food categories. Use **All categories** to expand the category list and **Show inspiration** to reset the results. It needs an internet connection for recipes, food photographs, and optional web fonts. Fonts fall back to local fonts if unavailable.

This stage calls TheMealDB directly, so running it does **not** require a backend server or local database. The `/api` development proxy is prepared for a future backend on port 3000.

## Build and preview

From `frontend`:

```powershell
npm.cmd run build
npm.cmd run preview
```

Open the preview URL printed in the terminal (normally http://localhost:4173).

## Optional database setup

The database foundation is separate from the Stage 2 frontend. To initialise it, from the project folder:

```powershell
cd backend
npm.cmd install
npm.cmd run db:init
npm.cmd run db:seed
```

`db:seed` replaces existing users and saved recipes with two demo users and five saved recipes. `db:reset` drops and rebuilds both tables with demo data. Use these commands only when you intend to replace local database data. `db:dump` exports the database to `database/dump.sql`.

## Current scope

- Frontend: responsive homepage, navigation, category browsing, initial recipe inspiration, and recipe name search with loading, retry, and empty states.
- Backend: SQLite schema, connection, and database management scripts.
- Future stages: recipe details, registration/login, profiles, saved recipes, and API integration.

Recipe data and food photography are provided by [TheMealDB](https://www.themealdb.com/api.php), using its educational development API.
