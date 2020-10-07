import { findIndex } from 'lodash';
import franc from 'franc';

const regex = /lang|язык/gi;

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

export default async (ctx) => {
  const response = !!ctx.message.text.match(regex);
  if (response) {
    const text = getArg(ctx.message.text);
    const lang = franc(text);
    const isUnknown = lang === 'und';

    await ctx.reply(
      isUnknown ? 'хз что за язык' : `Код языка: ${lang}`,
      ctx.pyroInfo.replyOptions,
    );

    return true;
  }

  return false;
};
