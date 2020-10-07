import yesNoWords from 'yes-no-words';

export default async (ctx) => {
  const response = !!ctx.message.text.match(/yes|да/gi);
  if (response) {
    await ctx.reply(yesNoWords.yesRandom(), ctx.pyroInfo.replyOptions);

    return true;
  }

  return false;
};
