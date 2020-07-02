import md5 from 'md5';
import { findIndex } from 'lodash';

const regex = /подскажи|tell me/gi;

const yesUrl = 'https://i.ytimg.com/vi/sq_Fm7qfRQk/maxresdefault.jpg';
const noUrl = 'https://i.ytimg.com/vi/VQgyv1XLp28/maxresdefault.jpg';

const getArg = (text) => {
  if (text) {
    const split = text.split(' ');
    const index = findIndex(split, (word) => !!word.match(regex));
    if (split.length <= index + 1) {
      return null;
    }
    return split.slice(index + 1).join(' ');
  }
  return null;
};

const getBoolOfString = (text) => {
  const str = md5(text);
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i) + i;
  }
  return sum % 2;
};

export default async (ctx) => {
  const response = !!ctx.message.text.match(regex);
  if (response) {
    const arg = getArg(ctx.message.text);
    const bool = getBoolOfString(arg || '');

    try {
      if (bool) {
        await ctx.replyWithPhoto(yesUrl, ctx.pyroInfo.replyOptions);
      } else {
        await ctx.replyWithPhoto(noUrl, ctx.pyroInfo.replyOptions);
      }
    } catch (e) {
      console.error(e);
      await ctx.reply('жожа сломалась(((', ctx.pyroInfo.replyOptions);
    }

    return true;
  }

  return false;
};
