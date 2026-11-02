// Builds the Express app. Middleware and routes are added here.
const express = require('express');

const app = express();

app.disable('x-powered-by');

module.exports = app;
