import { networkManager } from 'core/neuro';

export default async ctx => {
  const response = !!ctx.message.text.match(/нейро|neuro/gi);
  if (response) {
    const output = networkManager.extract() || 'Пайро сеть еще обучается';
    await ctx.reply(output, ctx.pyroInfo.replyOptions);
    return true;
  }

  return false;
};
