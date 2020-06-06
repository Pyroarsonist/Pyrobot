import { Answer } from 'data/models';
import { named as parse } from 'named-regexp';

const regex = parse(/add answer (:<regex>\/.+\/\w*) (:<answers>.+)/);
const withoutRegex = parse(/add default answers (:<answers>.+)/);

const delimiter = 'pyro-del';

export default async (ctx) => {
  if (!ctx.pyroInfo.isAdmin) {
    return false;
  }

  const data = regex.exec(ctx.message.text);
  const dataWithoutRegex = withoutRegex.exec(ctx.message.text);
  if (data || dataWithoutRegex) {
    let regexToSave;
    const answers = data
      ? data.capture('answers')
      : dataWithoutRegex.capture('answers');
    if (data) {
      regexToSave = data.capture('regex');
    }
    const answer = await new Answer({
      regex: regexToSave,
      answers: answers.split(delimiter).map((x) => x.trim()),
    }).save();
    const toLog = `Created new Answer:\n${JSON.stringify(answer)}`;

    try {
      await ctx.reply(toLog, ctx.pyroInfo.replyOptions);
    } catch (e) {
      console.error(e);
      await ctx.reply(`что-то пошло не так:\n${e}`, ctx.pyroInfo.replyOptions);
    }
    return true;
  }

  return false;
};
