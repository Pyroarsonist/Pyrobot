import { bot } from '../../core/telegram';
import triggers from '../triggers/index';

export default () => {
  bot.on('message', async msg => {
    const chatId = msg.chat.id;

    // todo: logs
    const text = triggers(msg.text);
    await bot.sendMessage(chatId, text);
  });
};
