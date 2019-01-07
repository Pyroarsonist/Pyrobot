import { pyroarsonistId, pyroBotId } from 'constants';
import { Answer } from 'data/models';
import { named as parse } from 'named-regexp';

const regex = parse(/add answer (:<regex>\/.+\/\w*) (:<answers>.+)/);
const withoutRegex = parse(/add default answers (:<answers>.+)/);

const delimiter = 'pyro-del';

export default async ctx => {
  if (!ctx?.message?.text) return false;
  if (ctx?.from?.id !== pyroarsonistId) return false;

  const data = regex.exec(ctx.message.text);
  const dataWithoutRegex = withoutRegex.exec(ctx.message.text);
  if (data || dataWithoutRegex) {
    let regexToSave;
    const answers = data
      ? data.capture('answers')
      : dataWithoutRegex.capture('answers');
    if (data) regexToSave = data.capture('regex');
    const answer = await new Answer({
      regex: regexToSave,
      answers: answers.split(delimiter).map(x => x.trim()),
    }).save();
    const toLog = `Created new Answer:\n${JSON.stringify(answer)}`;
    const needReply = ctx.message?.reply_to_message?.from?.id === pyroBotId;

    const replyOptions = {
      reply_to_message_id: needReply ? ctx.message.message_id : null,
    };

    try {
      await ctx.reply(toLog, replyOptions);
    } catch (e) {
      console.error(e);
      await ctx.reply(`что-то пошло не так:\n${e}`, replyOptions);
    }
    return true;
  }

  return false;
};
