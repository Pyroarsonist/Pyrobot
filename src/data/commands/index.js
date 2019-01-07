import { bot } from 'core/telegram';
import { pyroBotId } from 'constants';
import debugHandler from 'debug';
import {
  findOrCreateUser,
  findOrCreateChat,
  findOrCreateMessage,
} from 'data/models';
import triggers from '../triggers';

const debug = debugHandler('pyrobot:commands');

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
    debug(err);
  });

  bot.on('text', async ctx => {
    const chat = await findOrCreateChat(ctx.chat);
    await findOrCreateUser(ctx.from);
    const message = await findOrCreateMessage(ctx.message);

    // todo refactor reply
    const needReply = ctx.message?.reply_to_message?.from?.id === pyroBotId;

    if (
      message.text.match(/pyro|пбот|pbot/gi) ||
      needReply ||
      chat.type === 'private'
    ) {
      const wasTriggered = await checkOnTriggers(ctx);
      if (!wasTriggered) {
        const error = `Bot was not able to respond\nMessage:${JSON.stringify(
          message,
        )}`;
        debug(error);
      }
    }
  });
};
