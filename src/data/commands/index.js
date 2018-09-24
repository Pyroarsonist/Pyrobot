import { bot } from '../../core/telegram';
import triggers from '../triggers/index';

export default () => {
  bot.on('message', async msg => {
    const chatId = msg.chat.id;

    // todo: logs
    const text = triggers(msg.text);
    if (msg.chat.type === 'private') {
      await bot.sendMessage(chatId, text);
    }
    if (msg.text.match(/pyro|пбот|pbot/gi) || msg.reply_to_message)
      await bot.sendMessage(chatId, text);
  });
};
