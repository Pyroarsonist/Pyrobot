import debugHandler from 'debug';
import telegram from './core/telegram';
import scheduler from './core/scheduler';
import neuro from './core/neuro';

const debug = debugHandler('pyrobot:startup');

process
  .on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    console.error(err.stack);
    process.exit(1);
  });

(async () => {
  await neuro();
  await telegram();
  await scheduler();
  debug('Pyrobot started successfully');
})();
