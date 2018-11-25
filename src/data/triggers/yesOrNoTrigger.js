import { pyroBotId } from 'constants';
import logger from 'core/logger';
import md5 from 'md5';
import { findIndex } from 'lodash';

const regex = /подскажи|tell me/gi;

const yesUrl = 'https://i.ytimg.com/vi/sq_Fm7qfRQk/maxresdefault.jpg';
const noUrl = 'https://i.ytimg.com/vi/VQgyv1XLp28/maxresdefault.jpg';

const getArg = text => {
  if (text) {
    const split = text.split(' ');
    const index = findIndex(split, word => !!word.match(regex));
    if (split.length <= index + 1) return null;
    return split.slice(index + 1).join(' ');
  }
  return null;
};

const getBoolOfString = text => {
  const str = md5(text);
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i) + i;
  }
  return sum % 2;
};

export default async ctx => {
  if (!ctx?.message?.text) return false;

  const response = !!ctx.message.text.match(regex);
  if (response) {
    const needReply = ctx.message?.reply_to_message?.from?.id === pyroBotId;

    const replyOptions = {
      reply_to_message_id: needReply ? ctx.message.message_id : null,
    };

    const arg = getArg(ctx.message.text);
    const bool = getBoolOfString(arg || '');

    try {
      if (bool) {
        await ctx.replyWithPhoto(yesUrl, replyOptions);
        logger.info(`Sent yes image to ${JSON.stringify(ctx.chat)}`);
      } else {
        await ctx.replyWithPhoto(noUrl, replyOptions);
        logger.info(`Sent no image to ${JSON.stringify(ctx.chat)}`);
      }
    } catch (e) {
      console.error(e);
      logger.error(e.toString());
      await ctx.reply('жожа сломалась(((', replyOptions);
    }

    return true;
  }

  return false;
};
