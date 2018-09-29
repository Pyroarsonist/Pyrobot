import Telegraf from 'telegraf';
import logger from './logger';
import commamds from '../data/commands';
import { server, bot as botConfig, sslFolder } from '../config';

// const options = {
//   webHook: {
//     port: server.port,
//     key: `${sslFolder}/key.pem`, // Path to file with PEM private key
//     cert: `${sslFolder}/server.crt`, // Path to file with PEM certificate
//   },
// };

// eslint-disable-next-line import/no-mutable-exports
let bot = null;
export default () =>
  new Promise((res, rej) => {
    if (!botConfig.token) {
      throw new Error('No telegram bot key supplied');
    }
    try {
      console.info('Initializing telegram bot');
      // todo: add webhooks
      if (server.publicUrl && server.publicPort && sslFolder) {
        // telegram needs a ssl for webhook
        // bot = new Telegraf(botConfig.token, options);
        // bot.setWebHook(
        //   `${server.publicUrl}:${server.publicPort}/bot${botConfig.token}`,
        // );
      } else {
        bot = new Telegraf(botConfig.token);
      }

      // loading commands
      commamds();

      // starting polling
      bot.startPolling();
    } catch (e) {
      logger.error(e);
      rej(e);
    }

    res();
  });

export { bot };
