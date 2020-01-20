import debugHandler from 'debug';
import brain from 'brain.js';
import moment from 'moment';
import registerShutdownHandler from 'core/shutdown';
import _ from 'lodash';
import { neuro as config } from 'config';
import { Message } from 'data/models';

const debug = debugHandler('pyrobot:neuro');

// eslint-disable-next-line import/no-mutable-exports
let networkManager = null;

const encode = arg => arg.split('').map(x => x.charCodeAt(0) / 255);

class NetworkManager {
  constructor() {
    this.net = null;
    this.trainingSet = [];
  }

  extract() {
    if (this.net) return this.net(encode(_.sample(this.trainingSet).output));
    return 'Пайросеть еще обучается';
  }
}

const trainWithMoreData = async net => {
  const before = moment();
  debug('Training neural network');
  const messages = await Message.find({
    text: { $exists: true },
  })
    .sort({ date: -1 })
    .limit(+config.messagesLimit);
  networkManager.trainingSet.push(
    ...messages.map(m => ({
      input: encode(m.text),
      output: m.text,
    })),
  );
  net.train(networkManager.trainingSet, {
    iterations: +config.iteration,
    errorThresh: +config.errorThresh,
    log: x => debug(x),
    learningRate: +config.learningRate,
  });
  networkManager.net = net.toFunction();
  const after = moment();
  const duration = moment.duration(after.diff(before));
  const seconds = duration.asSeconds();
  debug(
    'Network trained with %s messages in %s seconds',
    messages.length,
    seconds,
  );
};

export default async () => {
  if (!config.enabled) {
    debug('Neuro disabled');
    return;
  }
  const net = new brain.recurrent.LSTM();
  networkManager = new NetworkManager();
  try {
    await trainWithMoreData(net);
    const interval = setInterval(async () => {
      await trainWithMoreData(net);
    }, +config.trainInterval);

    registerShutdownHandler(() => {
      debug('Shutting down neural network training');
      clearInterval(interval);
    });
  } catch (e) {
    console.error(e);
  }
};

export { networkManager };
