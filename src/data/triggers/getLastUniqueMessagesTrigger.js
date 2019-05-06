import { Chat, Message } from 'data/models';
import Bluebird from 'bluebird';
import moment from 'moment';

const regex = /сообщения|messages|msg(?<hours> \d*)/gi;

export default async ctx => {
  if (!ctx.pyroInfo.isAdmin) return false;

  const response = !!ctx.message.text.match(regex);
  if (response) {
    try {
      const hours = Number.parseInt(regex.exec(ctx.message.text).groups.hours);
      if (Number.isNaN(hours)) {
        await ctx.reply(
          `Кол-во часов неправильное значение:\n${hours}`,
          ctx.pyroInfo.replyOptions,
        );
      } else {
        const chats = await Chat.find({
          updatedAt: {
            $gte: moment()
              .subtract({ hours })
              .toISOString(),
          },
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
      }
    } catch (e) {
      console.error(e);
      await ctx.reply('крит, ныа', ctx.pyroInfo.replyOptions);
    }

    return true;
  }

  return false;
};
