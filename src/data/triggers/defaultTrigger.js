import _ from 'lodash';
import { Answer } from 'data/models';
import { Op } from 'sequelize';

export default async (ctx) => {
  // cannot be
  if (!ctx) {
    console.error('No ctx in default trigger');
    return false;
  }
  const docs = await Answer.findAll({
    where: {
      regex: { [Op.eq]: null },
    },
  });
  const answers = _.flatten(docs.map((a) => a.answers.filter((x) => x)));
  if (answers.length === 0) {
    answers.push('ответы закончились((');
  }

  await ctx.reply(_.sample(answers), ctx.pyroInfo.replyOptions);
  return true;
};
