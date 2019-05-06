import debugHandler from 'debug';
import cron from 'node-cron';
import { Message } from 'data/models';
import registerShutdownHandler from 'core/shutdown';
import moment from 'moment';
import _ from 'lodash';
import { pyroarsonistId } from 'constants';
import { bot } from 'core/telegram';

const debug = debugHandler('pyrobot:scheduler');

const MINUTES = 60;

let lastMessagesCount = 0;
let lastChatsCount = 0;

async function getInfoData(interval) {
  const messages = await Message.find({
    createdAt: {
      $gte: moment()
        .subtract({ minutes: interval })
        .toISOString(),
    },
  });
  const uniqMessages = messages.length;
  const uniqChats = _.uniq(messages.map(x => x.chat.toString())).length;
  return { uniqMessages, uniqChats };
}

const sendMessagesData = async () => {
  debug('Fetching messages info data');
  const { uniqMessages, uniqChats } = await getInfoData(MINUTES);
  const msgDiff = (uniqMessages / lastMessagesCount) * 100 - 100;
  const msgPercentString = lastMessagesCount
    ? `${msgDiff > 0 ? '✅ +' : '🔴 -'}${Math.abs(msgDiff).toPrecision(5)}%`
    : '⚫️ последние данные отсутствуют';
  const chatsDiff = (uniqChats / lastChatsCount) * 100 - 100;
  const chatsPercentString = lastChatsCount
    ? `${chatsDiff > 0 ? '✅ +' : '🔴 -'}${Math.abs(chatsDiff).toPrecision(5)}%`
    : '⚫️ последние данные отсутствуют';
  const msgString = ` ${uniqMessages} сообщений (${msgPercentString})`;
  const chatsString = ` ${uniqChats} чатов (${chatsPercentString})`;
  const replyMessage = `За ${MINUTES} минут пришло\n${msgString}\n${chatsString}`;
  await bot.telegram.sendMessage(pyroarsonistId, replyMessage);
  lastMessagesCount = uniqMessages;
  lastChatsCount = uniqChats;
};

export default async function scheduler() {
  debug('Starting scheduler');
  await sendMessagesData();
  const task = cron.schedule(`0 0 */1 * * *`, sendMessagesData);

  registerShutdownHandler(() => {
    debug('Stopping tasks');
    task.stop();
  });
}
