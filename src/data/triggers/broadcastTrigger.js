import { findIndex } from 'lodash';
import { Chat } from 'data/models';

const regex = /вещай|broadcast/gi;

const getBroadcastMessage = text => {
  if (text) {
    const split = text.split(' ');
    const index = findIndex(split, word => !!word.match(regex));
    if (split.length <= index + 1) return null;
    return split.slice(index + 1).join(' ');
  }
  return null;
};

export default async ctx => {
  if (!ctx.pyroInfo.isAdmin) return false;

  const response = !!ctx.message.text.match(regex);
  if (response) {
    const broadcastMessage = getBroadcastMessage(ctx.message.text);

    try {
      if (broadcastMessage) {
        const chats = await Chat.find();
        await Promise.all(
          chats.map(async chat => {
            await ctx.telegram.sendMessage(chat.id, broadcastMessage);
          }),
        );
        await ctx.reply('Сообщение вещано успешно', ctx.pyroInfo.replyOptions);
      } else {
        await ctx.reply(
          `Ты не правильно вписал аргументы\n${JSON.stringify({
            broadcastMessage,
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
