import faces from 'cool-ascii-faces';

export default async (ctx) => {
  const response = !!ctx.message.text.match(/face|лицо|ебало/gi);
  if (response) {
    await ctx.reply(faces(), ctx.pyroInfo.replyOptions);

    return true;
  }

  return false;
};
