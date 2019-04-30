import { Chat } from 'data/models';
import Bluebird from 'bluebird';

const regex = /чаты|chats/gi;

export default async ctx => {
  if (!ctx.pyroInfo.isAdmin) return false;

  const response = !!ctx.message.text.match(regex);
  if (response) {
    try {
      const chats = await Chat.find();
      const initStr = JSON.stringify(
        chats.map(chat => chat.formatted),
        null,
        2,
      );
      const strings = initStr.match(/(.|[\r\n]){1,4096}/g);

      await Bluebird.each(
        strings,
        async text => {
          await ctx.reply(text, ctx.pyroInfo.replyOptions);
        },
        { concurrency: 1 },
      );

      await ctx.reply(
        `Current count of chats: ${chats.length}`,
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
