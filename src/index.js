import 'babel-polyfill';
import 'isomorphic-fetch';
import express from 'express';
import { createServer } from 'http';
import bodyParser from 'body-parser';

import logger from './core/logger';
import telegram from './core/telegram';
import { server as serverConfig } from './config';

process
  .on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    console.error(err.stack);
    process.exit(1);
  });

const app = express();
const server = createServer(app);

const promise = telegram().catch(err => console.error(err.stack));

app.use(bodyParser.json());

promise.then(() => {
  // init server
  logger.info('Starting logger');
  server.listen(serverConfig.port, () => {
    console.info(`Pyrobot server starts at port: ${serverConfig.port}`);
  });
});
