import { regexes, pyroBotId } from 'constants';
import logger from 'core/logger';

export default async ctx => {
  if (!ctx?.message?.text) return false;
  let response = null;

  regexes.map(r => {
    const ret = ctx.message.text.match(r.regex);
    if (ret) {
      response = r.answer;
    }
    return ret;
  });
  if (response) {
    const needReply = ctx.message?.reply_to_message?.from?.id === pyroBotId;

    const replyOptions = {
      reply_to_message_id: needReply ? ctx.message.message_id : null,
    };
    await ctx.reply(response, replyOptions);
    logger.info(
      `Sent "${ctx.message.text}" to ${ctx.message.from.id}${
        ctx.message.from.username ? `(@${ctx.message.from.username})` : ''
      } into ${ctx.message.chat.id}${
        ctx.message.chat
          ? `${`(${ctx.message.chat.title} - @${ctx.message.chat.username})`}`
          : ''
      }${needReply ? ` via reply: ${ctx.message.message_id}` : ''}`,
    );
    return true;
  }

  return false;
};
