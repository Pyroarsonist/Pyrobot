import Telegraf from 'telegraf';
import fs from 'fs';
import logger from './logger';
import commamds from '../data/commands';
import { server, token, tlsPaths, sslFolder } from '../config';

// eslint-disable-next-line import/no-mutable-exports
let bot = null;
export default async () => {
  if (!token) {
    throw new Error('No telegram bot key supplied');
  }
  try {
    console.info('Initializing telegram bot');
    bot = new Telegraf(token);
    // loading commands

    commamds();

    // setting up connection webhooks or polling
    if (__DEV__ || !sslFolder) {
      bot.startPolling();
      console.info('Started with polling');
      logger.info('Started with polling');
    } else {
      // removing webhooks
      await bot.telegram.deleteWebhook();
      const tlsOptions = {
        key: fs.readFileSync(tlsPaths.key), // Path to file with PEM private key
        cert: fs.readFileSync(tlsPaths.cert), // Path to file with PEM certificate,
        ca: [
          // This is necessary only if the client uses the self-signed certificate.
          fs.readFileSync(tlsPaths.ca),
        ],
      };
      // server side
      bot.telegram.setWebhook(`${server.url}:${server.port}/bot${token}`, {
        source: tlsPaths.ca,
      });
      // telegram side
      bot.startWebhook(`/bot${token}`, tlsOptions, 8443);
      console.info('Started with webhook');
      logger.info('Started with webhook');
    }
  } catch (e) {
    console.error(e);
    logger.error(e.toString());
  }
};

export { bot };
