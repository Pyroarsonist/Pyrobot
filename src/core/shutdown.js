import _ from 'lodash';
import debugHandler from 'debug';

const debug = debugHandler('pyrobot:shutdown');

const handlers = [];

const shutdown = async () => {
  await Promise.all(handlers.map((x) => x()));
  process.exit(1);
};

export default function onShutdown(func) {
  if (!_.isFunction(func)) {
    return debug('Handler is not a function %o', func);
  }
  handlers.push(func);
  return handlers;
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('exit', shutdown);
process.on('SIGUSR1', shutdown);
process.on('SIGUSR2', shutdown);
process.on('uncaughtException', shutdown);
