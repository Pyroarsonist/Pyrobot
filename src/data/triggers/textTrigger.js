import { Answer } from 'data/models';
import _ from 'lodash';

// todo: add named regexp
export default async (ctx) => {
  let responses = null;

  const docs = await Answer.find({ regex: { $exists: true } });

  docs.map((doc) => {
    const str = doc.regex;
    const lastSlash = str.lastIndexOf('/');

    const regex =
      lastSlash === -1
        ? new RegExp(str)
        : new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));

    const ret = ctx.message.text.match(regex);

    if (ret) {
      responses = doc.answers;
    }
    return ret;
  });
  if (responses) {
    await ctx.reply(_.sample(responses), ctx.pyroInfo.replyOptions);
    return true;
  }

  return false;
};
