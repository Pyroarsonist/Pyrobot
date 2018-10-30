import 'isomorphic-fetch';

import logger from './core/logger';
import telegram from './core/telegram';

process
  .on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    console.error(err.stack);
    process.exit(1);
  });

const promise = telegram().catch(err => console.error(err.stack));

promise.then(() => {
  // init server
  logger.info('Starting logger');
});
