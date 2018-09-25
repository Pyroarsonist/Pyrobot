import _ from 'lodash';

const handlers = [];

const shutdown = async () => {
  await Promise.all(handlers.map(x => x()));
  process.exit();
};

export default function registerShutdownHandler(func) {
  if (!_.isFunction(func))
    return console.info('Handler is not a function %o', func);
  handlers.push(func);
  return handlers;
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('exit', shutdown);
process.on('SIGUSR1', shutdown);
process.on('SIGUSR2', shutdown);
process.on('uncaughtException', shutdown);
