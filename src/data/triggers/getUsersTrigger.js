import { pyroBotId, pyroarsonistId } from 'constants';
import { User } from 'data/models';

const regex = /юзеры|users/gi;

export default async ctx => {
  if (!ctx || !ctx.message || !ctx.message.text || !ctx.from) return false;

  if (ctx.from.id !== pyroarsonistId) return false;

  const response = !!ctx.message.text.match(regex);
  if (response) {
    const needReply = ctx.message?.reply_to_message?.from?.id === pyroBotId;

    const replyOptions = {
      reply_to_message_id: needReply ? ctx.message.message_id : null,
    };

    try {
      const users = await User.find();
      const initStr = JSON.stringify(
        users.map(user => user.formatted),
        null,
        2,
      );
      const strings = initStr.match(/(.|[\r\n]){1,4096}/g);

      await Promise.all(
        strings.map(async text => {
          await ctx.reply(text, replyOptions);
        }),
      );

      await ctx.reply(`Current count of users: ${users.length}`, replyOptions);
    } catch (e) {
      console.error(e);
      await ctx.reply('крит, ныа', replyOptions);
    }

    return true;
  }

  return false;
};
