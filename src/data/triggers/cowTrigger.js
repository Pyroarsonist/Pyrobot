import _ from 'lodash';
import cows from 'cows';

export default async (ctx) => {
  const response = !!ctx.message.text.match(/cow|корова/gi);
  if (response) {
    await ctx.reply(_.sample(cows()), ctx.pyroInfo.replyOptions);

    return true;
  }

  return false;
};
