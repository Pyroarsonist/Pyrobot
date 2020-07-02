import debugHandler from 'debug';
import telegram from './core/telegram';
import scheduler from './core/scheduler';
import models from './data/models';

const debug = debugHandler('pyrobot:startup');

process
  .on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
    console.error(err.stack);
    process.exit(1);
  });

(async () => {
  await models.sync();
  await telegram();
  await scheduler();
  debug('Pyrobot started successfully');
})();
