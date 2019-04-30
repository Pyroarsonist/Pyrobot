import { Chat, Message } from 'data/models';
import Bluebird from 'bluebird';

const regex = /сообщения|messages|msg/gi;

export default async ctx => {
  if (!ctx.pyroInfo.isAdmin) return false;

  const response = !!ctx.message.text.match(regex);
  if (response) {
    try {
      const date7DaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const chats = await Chat.find({
        updatedAt: { $gt: date7DaysAgo },
      });

      await Bluebird.each(
        chats,
        async chat => {
          const relatedMessages = await Message.find({
            // eslint-disable-next-line
            chat: chat._id,
          })
            .sort({ date: -1 })
            .limit(10)
            .populate('user');
          const message = `${JSON.stringify(
            chat.formatted,
            null,
            2,
          )}\n${relatedMessages
            .reverse()
            .map(x => JSON.stringify(x.formatted, null, 2))
            .join('\n')}`;
          await ctx.reply(message, ctx.pyroInfo.replyOptions);
        },
        { concurrency: 1 },
      );
    } catch (e) {
      console.error(e);
      await ctx.reply('крит, ныа', ctx.pyroInfo.replyOptions);
    }

    return true;
  }

  return false;
};
