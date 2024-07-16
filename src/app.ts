import express, { Application } from 'express';
import config from './common/config';
import loadApp from './common/loaders';
import webSocket from './api/routes/socket';
async function startServer() {
  const app: Application = express();

  await loadApp({ expressApp: app });
  const server = app.listen(config.port, () => {});
  webSocket(server, app);
}

startServer();
