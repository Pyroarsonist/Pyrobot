import { bot } from '../../core/telegram';
import logger from '../../core/logger';
import triggers from '../triggers/index';
import { botId } from '../../constants';

export default () => {
  bot.on('polling_error', e => {
    logger.error(e);
    console.error(e); // => 'EFATAL'
  });

  bot.on('webhook_error', e => {
    logger.error(e);
    console.error(e); // => 'EPARSE'
  });

  bot.on('message', async msg => {
    logger.info(JSON.stringify(msg));
    const chatId = msg.chat.id;

    // todo: logs
    const text = triggers(msg.text);
    if (msg.chat.type === 'private') {
      await bot.sendMessage(chatId, text);
      logger.info(`Sent "${text}" to ${chatId}`);
    }

    const needReply =
      msg.reply_to_message && msg.reply_to_message.from.id === botId;
    if (msg.text.match(/pyro|пбот|pbot/gi) || needReply) {
      await bot.sendMessage(chatId, text, {
        reply_to_message_id: needReply ? msg.message_id : null,
      });
      // todo: logger standard
      logger.info(
        `Sent "${text}" to ${msg.from.id}${
          msg.from.username ? `(@${msg.from.username})` : ''
        } into ${msg.chat.id}${
          msg.chat ? `${`(${msg.chat.title} - @${msg.chat.username})`}` : ''
        }${needReply ? ` via reply: ${msg.message_id}` : ''}`,
      );
    }
  });
};
