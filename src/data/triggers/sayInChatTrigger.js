import { findIndex } from 'lodash';

const regex = /send|отправь/gi;

const getArgs = (text) => {
  if (text) {
    const split = text.split(' ');
    const index = findIndex(split, (word) => !!word.match(regex));
    if (split.length <= index + 2) {
      return [];
    }
    return [split[index + 1], split.slice(index + 2).join(' ')];
  }
  return [];
};

export default async (ctx) => {
  if (!ctx.pyroInfo.isAdmin) {
    return false;
  }

  const response = !!ctx.message.text.match(regex);
  if (response) {
    const [chatId, replyMessage] = getArgs(ctx.message.text);

    try {
      if (chatId && replyMessage) {
        await ctx.telegram.sendMessage(chatId, replyMessage);
        await ctx.reply(
          'Сообщение отослано успешно',
          ctx.pyroInfo.replyOptions,
        );
      } else {
        await ctx.reply(
          `Ты не правильно вписал аргументы\n${JSON.stringify({
            chatId,
            replyMessage,
          })}`,
          ctx.pyroInfo.replyOptions,
        );
      }
    } catch (e) {
      console.error(e);
      await ctx.reply('крит, ныа', ctx.pyroInfo.replyOptions);
    }

    return true;
  }

  return false;
};
