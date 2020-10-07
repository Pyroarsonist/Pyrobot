import superb from 'superb';

export default async (ctx) => {
  const response = !!ctx.message.text.match(
    /superb|нет, ты|нет ты|милашка|милая|красивая|комплимент|pond|понд/gi,
  );
  if (response) {
    await ctx.reply(superb.random(), ctx.pyroInfo.replyOptions);

    return true;
  }

  return false;
};
