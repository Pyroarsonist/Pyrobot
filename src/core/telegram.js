import Telegraf from 'telegraf';
import fs from 'fs';
import logger from './logger';
import commamds from '../data/commands';
import { server, bot as botConfig, tlsPaths, sslFolder } from '../config';

// eslint-disable-next-line import/no-mutable-exports
let bot = null;
export default async () => {
  if (!botConfig.token) {
    throw new Error('No telegram bot key supplied');
  }
  try {
    console.info('Initializing telegram bot');
    bot = new Telegraf(botConfig.token);
    // loading commands

    commamds();

    // removing webhooks
    await bot.telegram.deleteWebhook();

    // setting up connection webhooks or polling
    if (sslFolder) {
      const tlsOptions = {
        key: fs.readFileSync(tlsPaths.key), // Path to file with PEM private key
        cert: fs.readFileSync(tlsPaths.cert), // Path to file with PEM certificate,
        ca: [
          // This is necessary only if the client uses the self-signed certificate.
          fs.readFileSync(tlsPaths.ca),
        ],
      };
      // server side
      bot.telegram.setWebhook(
        `${server.url}:${server.port}/bot${botConfig.token}`,
        {
          source: tlsPaths.ca,
        },
      );
      // telegram side
      bot.startWebhook(`/bot${botConfig.token}`, tlsOptions, 8443);
    } else bot.startPolling();
  } catch (e) {
    console.error(e);
    logger.error(e);
  }
};

export { bot };
