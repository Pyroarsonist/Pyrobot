import { bot } from 'core/telegram';
import logger from 'core/logger';
import { pyroBotId } from 'constants';
import { find } from 'lodash';
import triggers from '../triggers';

const checkOnTriggers = async ctx => {
  let wasTriggered = false;
  const generator = triggers();

  let genFunc = null;

  while (!wasTriggered) {
    genFunc = generator.next().value;
    // eslint-disable-next-line no-await-in-loop
    wasTriggered = await genFunc(ctx);
  }

  return wasTriggered;
};

export default () => {
  bot.catch(err => {
    console.error(err);
    logger.error(err.toString());
  });

  bot.on('text', async ctx => {
    const { message } = ctx;
    const chat = { id: ctx.chat.id, type: ctx.chat.type };
    if (!find(bot.chats, { id: chat.id })) {
      bot.chats.push(chat);
      logger.info(`Added to bot chats${JSON.stringify(chat)}`);
    }

    // todo: logs
    // todo: logger standard

    logger.info(JSON.stringify(message));

    // todo refactor reply
    const needReply = message?.reply_to_message?.from?.id === pyroBotId;

    if (
      message.text.match(/pyro|пбот|pbot/gi) ||
      needReply ||
      message.chat.type === 'private'
    ) {
      const wasTriggered = await checkOnTriggers(ctx);
      if (!wasTriggered) {
        const error = `Bot was not able to respond\nMessage:${JSON.stringify(
          message,
        )}`;
        logger.error(error.toString());
        console.error(error);
      }
    }
  });
};
