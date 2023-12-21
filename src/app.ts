import express, { Application } from 'express';
import config from './config';
import loadApp from './loaders'; 


async function startServer() {
  const app: Application = express();

  await loadApp({ expressApp: app });
  app.listen(config.port, () => {
   
  });
}

startServer();