import { Answer } from 'data/models';
import { named as parse } from 'named-regexp';

const regex = parse(/add answer (:<regex>\/.+\/\w*) (:<answers>.+)/);
const withoutRegex = parse(/add default answers (:<answers>.+)/);

const getAnswersFromRegex = (regexData) =>
  regexData
    .capture('answers')
    .split(Answer.delimiter)
    .map((x) => x.trim())
    .filter((x) => x);

const saveWithRegex = async (regexData) => {
  const regexToSave = regexData.capture('regex');
  const answers = getAnswersFromRegex(regexData);
  const answer = await Answer.create({
    regex: regexToSave,
    answers,
  });

  return answer;
};

const saveWithoutRegex = async (regexData) => {
  const answers = getAnswersFromRegex(regexData);
  let answer = await Answer.findOne({ where: { regex: null } });
  if (!answer) {
    answer = await Answer.create({
      answers,
    });
    return answer;
  }
  answer.answers = [...answer.answers, ...answers];
  await answer.save();
  return answer;
};

export default async (ctx) => {
  if (!ctx.pyroInfo.isAdmin) {
    return false;
  }

  const data = regex.exec(ctx.message.text);
  const dataWithoutRegex = withoutRegex.exec(ctx.message.text);
  if (data || dataWithoutRegex) {
    try {
      let answer;

      if (data) answer = await saveWithRegex(data);
      if (dataWithoutRegex) answer = await saveWithoutRegex(dataWithoutRegex);

      const toLog = `Created new Answer:\n${JSON.stringify(answer)}`;

      await ctx.reply(toLog, ctx.pyroInfo.replyOptions);
    } catch (e) {
      console.error(e);
      await ctx.reply(`что-то пошло не так:\n${e}`, ctx.pyroInfo.replyOptions);
    }
    return true;
  }

  return false;
};
