import { pyroBotId, godId } from 'data/constants';
import debugHandler from 'debug';
import { Message, User, Chat } from 'data/models';
import triggers from '../triggers';

const debug = debugHandler('pyrobot:commands');

const checkOnTriggers = async (ctx) => {
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

export default (bot) => {
  bot.catch((err) => debug(err));

  bot.use(async (ctx, next) => {
    ctx.pyroInfo = {};
    ctx.pyroInfo.user = await User.assert(ctx.from);
    ctx.pyroInfo.chat = await Chat.assert(ctx.chat);
    ctx.pyroInfo.message = await Message.assert(ctx.message);
    ctx.pyroInfo.replyOptions = {
      reply_to_message_id:
        +ctx.message.reply_to_message?.from?.id === +pyroBotId
          ? ctx.message.message_id
          : null,
    };
    ctx.pyroInfo.isAdmin = +ctx.from.id === +godId;
    return next(ctx);
  });

  bot.on(
    [
      'audio',
      'document',
      'photo',
      'sticker',
      'video',
      'voice',
      'contact',
      'location',
      'venue',
    ],
    async (ctx) => {
      if (
        ctx.pyroInfo.replyOptions.reply_to_message_id ||
        ctx.pyroInfo.chat.type === 'private'
      ) {
        await ctx.reply(
          'Пока что на такое не умею отвечать',
          ctx.pyroInfo.replyOptions,
        );
      }
    },
  );

  bot.on('left_chat_member', async (ctx) => {
    const leftUser = await User.assert(ctx.message.left_chat_participant);
    await ctx.replyWithMarkdown(`О. петух ${leftUser.getMention()} вышел))0`);
  });

  bot.on('new_chat_members', async (ctx) => {
    const newUser = await User.assert(ctx.message.new_chat_participant);
    await ctx.replyWithMarkdown(
      `Вечер в хату, ${newUser.getMention()}, часик в радость`,
    );
  });

  bot.on('text', async (ctx) => {
    if (
      ctx.pyroInfo.message.text.match(/pyro|пбот|pbot/gi) ||
      ctx.pyroInfo.replyOptions.reply_to_message_id ||
      ctx.pyroInfo.chat.type === 'private'
    ) {
      const wasTriggered = await checkOnTriggers(ctx);
      if (!wasTriggered) {
        const error = `Bot was not able to respond\nMessage:${JSON.stringify(
          ctx.pyroInfo.message,
        )}`;
        debug(error);
      }
    }
  });
};
