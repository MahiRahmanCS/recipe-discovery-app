// Loads backend/.env and checks the settings once at startup.
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

const nodeEnv = process.env.NODE_ENV || 'development';

const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a whole number between 1 and 65535');
}

const sessionSecret = process.env.SESSION_SECRET || '';
if (sessionSecret.length < 32) {
  throw new Error('SESSION_SECRET must be at least 32 characters (see .env.example)');
}

const appOrigins = (process.env.APP_ORIGINS || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

module.exports = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port,
  sessionSecret,
  appOrigins,
};
