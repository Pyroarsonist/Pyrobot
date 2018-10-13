import { pyroBotId, pyroarsonistId } from 'constants';
import logger from 'core/logger';
import { findIndex } from 'lodash';

const regex = /say|скажи/gi;

const getArgs = text => {
  if (text) {
    const split = text.split(' ');
    const index = findIndex(split, word => !!word.match(regex));
    if (split.length <= index + 2) return [];
    return [split[index + 1], split.slice(index + 2).join(' ')];
  }
  return [];
};

export default async ctx => {
  if (!ctx || !ctx.message || !ctx.message.text || !ctx.from) return false;

  if (ctx.from.id !== pyroarsonistId) return false;

  const response = !!ctx.message.text.match(regex);
  if (response) {
    const needReply =
      ctx.message.reply_to_message &&
      ctx.message.reply_to_message.from.id === pyroBotId;

    const replyOptions = {
      reply_to_message_id: needReply ? ctx.message.message_id : null,
    };

    const [chatId, replyMessage] = getArgs(ctx.message.text);

    try {
      if (chatId && replyMessage) {
        await ctx.telegram.sendMessage(chatId, replyMessage);
        logger.info(`Sent message ${replyMessage} to ${chatId}`);
        await ctx.reply('Сообщение отослано успешно', replyOptions);
      } else {
        await ctx.reply(
          `Ты не правильно вписал аргументы\n${JSON.stringify({
            chatId,
            replyMessage,
          })}`,
          replyOptions,
        );
        logger.info(
          `Sent error message ${JSON.stringify({
            chatId,
            replyMessage,
          })} to ${JSON.stringify(ctx.chat)}`,
        );
      }
    } catch (e) {
      console.error(e);
      logger.error(e.toString());
      await ctx.reply('крит, ныа', replyOptions);
    }

    return true;
  }

  return false;
};
