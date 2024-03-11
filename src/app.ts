import express, { Application } from "express";
import config from "./config";
import loadApp from "./loaders";
import webSocket from "./api/routes/socket";
async function startServer() {
  const app: Application = express();

  await loadApp({ expressApp: app });
  const server = app.listen(config.port, () => {});
  webSocket(server, app);
}

startServer();
