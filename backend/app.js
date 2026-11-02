// Builds the Express app. Middleware and routes are added here.
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

app.disable('x-powered-by');

// The frontend's production build (run `npm run build` in frontend/ first).
const distPath = path.join(__dirname, '..', 'frontend', 'dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // Page URLs get index.html; /api routes and missing files stay 404.
  app.use((req, res, next) => {
    const isPage = req.method === 'GET'
      && !/^\/api(\/|$)/.test(req.path)
      && !path.extname(req.path);

    if (!isPage) return next();
    res.sendFile('index.html', { root: distPath });
  });
}

module.exports = app;
