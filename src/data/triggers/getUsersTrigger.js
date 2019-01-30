import { User } from 'data/models';

const regex = /юзеры|users/gi;

export default async ctx => {
  if (!ctx.pyroInfo.isAdmin) return false;

  const response = !!ctx.message.text.match(regex);
  if (response) {
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
          await ctx.reply(text, ctx.pyroInfo.replyOptions);
        }),
      );

      await ctx.reply(
        `Current count of users: ${users.length}`,
        ctx.pyroInfo.replyOptions,
      );
    } catch (e) {
      console.error(e);
      await ctx.reply('крит, ныа', ctx.pyroInfo.replyOptions);
    }

    return true;
  }

  return false;
};
