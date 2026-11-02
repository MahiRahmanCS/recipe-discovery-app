// Entry point: loads the config, then starts the server.
const env = require('./config/env');
const app = require('./app');

app.listen(env.port, () => {
  console.log(`GrubHub server running at http://localhost:${env.port}`);
});
