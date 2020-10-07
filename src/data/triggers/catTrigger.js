import cats from 'cat-ascii-faces';

export default async (ctx) => {
  const response = !!ctx.message.text.match(/cat|кот|кошка/gi);
  if (response) {
    await ctx.reply(cats(), ctx.pyroInfo.replyOptions);

    return true;
  }

  return false;
};
