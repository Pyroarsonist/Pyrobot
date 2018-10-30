import { pyroBotId, plotUrl } from 'constants';
import logger from 'core/logger';

export default async ctx => {
  if (!ctx?.message?.text) return false;

  const response = !!ctx.message.text.match(/график|plot/gi);
  if (response) {
    const needReply = ctx.message.reply_to_message?.from?.id === pyroBotId;

    const replyOptions = {
      reply_to_message_id: needReply ? ctx.message.message_id : null,
    };
    await ctx.replyWithPhoto(plotUrl, replyOptions);
    logger.info(`Sent plot to ${JSON.stringify(ctx.chat)}`);
    return true;
  }

  return false;
};
