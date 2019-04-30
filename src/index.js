import 'isomorphic-fetch';

import debugHandler from 'debug';
import telegram from './core/telegram';
import scheduler from './core/scheduler';

const debug = debugHandler('pyrobot:index');

process
  .on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    console.error(err.stack);
    process.exit(1);
  });

const promise = telegram()
  .then(scheduler)
  .catch(err => debug(err.stack));

promise.then(() => {
  debug('Pyrobot started successfully');
});
