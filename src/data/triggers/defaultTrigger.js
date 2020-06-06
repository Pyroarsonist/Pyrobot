import _ from 'lodash';
import { Answer } from 'data/models';

export default async (ctx) => {
  // cannot be
  if (!ctx) {
    console.error('No ctx in default trigger');
    return false;
  }
  const docs = await Answer.find({ regex: { $exists: false } });
  const answers = _.flatten(docs.map((a) => a.answers));
  if (answers.length === 0) {
    answers.push('ответы закончились((');
  }

  await ctx.reply(_.sample(answers), ctx.pyroInfo.replyOptions);
  return true;
};
