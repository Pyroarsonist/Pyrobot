import { plotUrl } from 'data/constants';

export default async (ctx) => {
  const response = !!ctx.message.text.match(/график|plot/gi);
  if (response) {
    await ctx.replyWithPhoto(plotUrl, ctx.pyroInfo.replyOptions);
    return true;
  }

  return false;
};
