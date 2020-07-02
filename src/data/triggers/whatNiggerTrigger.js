import { media } from 'config';

export default async (ctx) => {
  const response = !!ctx.message.text.match(/what|\?\?\?|каво|что\?/gi);
  if (response) {
    await ctx.replyWithDocument(
      media.whatPerplexityGifId,
      ctx.pyroInfo.replyOptions,
    );
    return true;
  }

  return false;
};
