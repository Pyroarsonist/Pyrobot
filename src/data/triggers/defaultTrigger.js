import _ from 'lodash';
import logger from 'core/logger';
import { pyroBotId, answers } from 'constants';

export default async ctx => {
  // cannot be
  if (!ctx) {
    console.error('No ctx in default trigger');
    logger.error('No ctx in default trigger');
    return false;
  }
  if (!ctx.message) return ctx.reply(_.sample(answers));
  const { message } = ctx;

  // eslint-disable-next-line camelcase
  const needReply = message?.reply_to_message?.from?.id === pyroBotId;

  const replyOptions = {
    reply_to_message_id: needReply ? message.message_id : null,
  };
  await ctx.reply(_.sample(answers), replyOptions);
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
};
