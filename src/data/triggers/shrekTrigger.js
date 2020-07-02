import { media } from 'config';

export default async (ctx) => {
  const response = !!ctx.message.text.match(/шрек|shrek/gi);
  if (response) {
    await ctx.replyWithDocument(media.shrekGifId, ctx.pyroInfo.replyOptions);
    return true;
  }

  return false;
};
