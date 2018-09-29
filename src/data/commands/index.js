import { bot } from '../../core/telegram';
import logger from '../../core/logger';
import triggers, { plotTrigger } from '../triggers/index';
import { botId, plotUrl } from '../../constants';

export default () => {
  bot.catch(err => {
    console.error(err);
    logger.error(err);
  });

  bot.on('text', async ctx => {
    const { message } = ctx;
    logger.info(JSON.stringify(message));
    const chatId = message.chat.id;

    let text = null;

    // todo: logs

    if (message.chat.type === 'private') {
      if (plotTrigger(message.text)) {
        await ctx.replyWithPhoto(plotUrl);
        return logger.info(`Sent plot to ${chatId}`);
      }

      text = triggers(message.text);
      await ctx.reply(text);
      return logger.info(`Sent "${text}" to ${chatId}`);
    }

    const needReply =
      message.reply_to_message && message.reply_to_message.from.id === botId;

    if (message.text.match(/pyro|пбот|pbot/gi) || needReply) {
      const replyOptions = {
        reply_to_message_id: needReply ? message.message_id : null,
      };

      if (plotTrigger(message.text)) {
        await ctx.replyWithPhoto(plotUrl, replyOptions);
        return logger.info(`Sent plot to ${chatId}`);
      }

      text = triggers(message.text);

      await ctx.reply(text, replyOptions);
      // todo: logger standard
      return logger.info(
        `Sent "${text}" to ${message.from.id}${
          message.from.username ? `(@${message.from.username})` : ''
        } into ${message.chat.id}${
          message.chat
            ? `${`(${message.chat.title} - @${message.chat.username})`}`
            : ''
        }${needReply ? ` via reply: ${message.message_id}` : ''}`,
      );
    }
    return null;
  });
};
