import express, { Application } from 'express';
import config from './common/config';
import loadApp from './common/loaders';
import webSocket from './chat/chat.socket';
async function startServer() {
  const app: Application = express();

  await loadApp({ expressApp: app });
  const server = app.listen(config.port, () => {});
  webSocket(server, app);
}

startServer();
