import debugHandler from 'debug';
import cron from 'node-cron';
import { Message, Chat } from 'data/models';
import onShutdown from 'core/shutdown';
import moment from 'moment';

import { godId } from 'data/constants';
import { sendMessage } from 'core/telegram';
import { Op } from 'sequelize';
import updateCronSchedulers from './updateCronSchedulers';

const debug = debugHandler('pyrobot:scheduler');

const MINUTES = 60;

let lastMessagesCount = 0;
let lastChatsCount = 0;

async function getInfoData(interval) {
  const where = {
    createdAt: {
      [Op.gte]: moment().subtract({ minutes: interval }).toISOString(),
    },
  };
  const uniqMessages = await Message.count({
    where,
  });
  const uniqChats = await Chat.count({
    where,
  });
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
  await sendMessage(godId, replyMessage);
  lastMessagesCount = uniqMessages;
  lastChatsCount = uniqChats;
};

export default async function scheduler() {
  debug('Starting scheduler');
  await sendMessagesData();
  await updateCronSchedulers();
  const sendMessagingTask = cron.schedule(`0 0 */1 * * *`, sendMessagesData);
  const updateCronSchedulersTask = cron.schedule(
    `*/10 * * * *`,
    updateCronSchedulers,
  );

  onShutdown(() => {
    debug('Stopping tasks');
    sendMessagingTask.stop();
    updateCronSchedulersTask.stop();
  });
}
