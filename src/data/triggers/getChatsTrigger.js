import { pyroBotId, pyroarsonistId } from 'constants';
import logger from 'core/logger';
import { Chat } from 'data/models';

const regex = /чаты|chats/gi;

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
      const chats = await Chat.find();
      await ctx.reply(
        JSON.stringify(chats.map(chat => chat.validated)),
        replyOptions,
      );
      logger.info(
        `Sent bot chats ${JSON.stringify(chats)} to ${pyroarsonistId}`,
      );
    } catch (e) {
      console.error(e);
      logger.error(e.toString());
      await ctx.reply('крит, ныа', replyOptions);
    }

    return true;
  }

  return false;
};