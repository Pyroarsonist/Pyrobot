import { pyroBotId } from 'constants';
import logger from 'core/logger';
import { Answer } from 'data/models';
import _ from 'lodash';

// const escapeStringRegexp = require('escape-string-regexp'); todo: add add regex method

// todo: add named regexp
export default async ctx => {
  if (!ctx?.message?.text) return false;
  let responses = null;

  // const m = await new Answer({
  //   regex: escapeStringRegexp('ukr'),
  //   answers: ['kek', 'anime'],
  // }).save(); todo: add add regex method
  const docs = await Answer.find({ regex: { $exists: true } });
  if (!ctx.message) {
    return false;
  }

  docs.map(doc => {
    const str = doc.regex;
    const lastSlash = str.lastIndexOf('/');

    const regex =
      lastSlash === -1
        ? new RegExp(str)
        : new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));

    const ret = ctx.message.text.match(regex);

    if (ret) {
      responses = doc.answers;
    }
    return ret;
  });
  if (responses) {
    const needReply = ctx.message?.reply_to_message?.from?.id === pyroBotId;

    const replyOptions = {
      reply_to_message_id: needReply ? ctx.message.message_id : null,
    };
    await ctx.reply(_.sample(responses), replyOptions);
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
