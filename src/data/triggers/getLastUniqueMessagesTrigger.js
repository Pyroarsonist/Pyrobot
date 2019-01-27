import { pyroBotId, pyroarsonistId } from 'constants';
import { Chat, Message } from 'data/models';

const regex = /сообщения|messages|msg/gi;

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
      const date7DaysAgo = Date.now() - 7 * 24 * 60 * 60;
      const chats = await Chat.find({
        updatedAt: { $gt: date7DaysAgo },
      });

      await Promise.all(
        chats.map(async chat => {
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
          await ctx.reply(message, replyOptions);
        }),
      );
    } catch (e) {
      console.error(e);
      await ctx.reply('крит, ныа', replyOptions);
    }

    return true;
  }

  return false;
};
