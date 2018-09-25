import TelegramBot from 'node-telegram-bot-api';
import logger from './logger';
import commamds from '../data/commands';
import { server, bot as botConfig, sslFolder } from '../config';

const options = {
  webHook: {
    port: server.port,
    key: `${sslFolder}/key.pem`, // Path to file with PEM private key
    cert: `${sslFolder}/server.crt`, // Path to file with PEM certificate
  },
};

// eslint-disable-next-line import/no-mutable-exports
let bot = null;
export default () =>
  new Promise((res, rej) => {
    try {
      console.info('Initializing telegram bot');
      if (server.publicUrl && server.publicPort && sslFolder) {
        // telegram needs a ssl for webhook
        bot = new TelegramBot(botConfig.token, options);
        bot.setWebHook(
          `${server.publicUrl}:${server.publicPort}/bot${botConfig.token}`,
        );
      } else {
        bot = new TelegramBot(botConfig.token, { polling: true });
      }

      // loading commands
      commamds();
    } catch (e) {
      logger.error(e);
      rej(e);
    }

    res();
  });

export { bot };
