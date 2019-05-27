import { shrekGifId } from 'config';

export default async ctx => {
  const response = !!ctx.message.text.match(/шрек|shrek/gi);
  if (response) {
    await ctx.replyWithDocument(shrekGifId, ctx.pyroInfo.replyOptions);
    return true;
  }

  return false;
};
