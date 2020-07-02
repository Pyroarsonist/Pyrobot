import { Chat, Message } from 'data/models';
import Bluebird from 'bluebird';
import moment from 'moment';
import { Op } from 'sequelize';
import User from '../models/User';

const regex = /сообщения|messages|msg(?<hours> \d*)/gi;

export default async (ctx) => {
  if (!ctx.pyroInfo.isAdmin) {
    return false;
  }

  const response = !!ctx.message.text.match(regex);
  if (response) {
    try {
      const hours = Number.parseInt(regex.exec(ctx.message.text).groups.hours);
      if (Number.isNaN(hours)) {
        await ctx.reply(
          `Кол-во часов неправильное значение:\n${hours}`,
          ctx.pyroInfo.replyOptions,
        );
      } else {
        const chats = await Chat.findAll({
          where: {
            updatedAt: {
              [Op.gte]: moment().subtract({ hours }).toISOString(),
            },
          },
        });

        await Bluebird.each(chats, async (chat) => {
          const relatedMessages = await Message.findAll({
            where: {
              chatId: chat.id,
            },
            limit: 10,
            order: [['date', 'DESC']],
            include: [
              {
                model: User,
                as: 'user',
              },
              { model: Chat, as: 'chat' },
            ],
          });
          const message = `${JSON.stringify(
            chat.serialize(),
            null,
            2,
          )}\n${relatedMessages
            .reverse()
            .map((x) => JSON.stringify(x.serialize(), null, 2))
            .join('\n')}`;
          await ctx.reply(message, ctx.pyroInfo.replyOptions);
        });
      }
    } catch (e) {
      console.error(e);
      await ctx.reply('крит, ныа', ctx.pyroInfo.replyOptions);
    }

    return true;
  }

  return false;
};
