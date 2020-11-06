import { CronMessage, Chat } from 'data/models';
import debugHandler from 'debug';
import cron from 'node-cron';
import onShutdown from '../shutdown';
import { sendMessage } from '../telegram';

const debug = debugHandler('pyrobot:scheduler:cron-messages');

const cronSchedulers = [];

const getAndSendMessage = async (id) => {
  const entity = await CronMessage.findByPk(id);
  if (!entity?.active) return;
  debug(`Sending message ${id}`);
  await sendMessage(entity.chatId, entity.message);
};

const updateCronSchedulers = async () => {
  debug('Updating schedulers');

  const messagesEntities = await CronMessage.findAll({
    where: { active: true },
    include: [{ model: Chat, as: 'chat' }],
  });

  const messages = messagesEntities.map((m) => ({
    id: m.id,
    chatId: m.chat.id,
    cron: m.cron,
    found: false,
  }));

  const cronSchedulersBackup = [...cronSchedulers];

  cronSchedulersBackup.forEach((s, i) => {
    const foundMessage = messages.find(
      (m) => m.id === s.id && m.chatId === s.chatId && s.cron === m.cron,
    );

    if (foundMessage) {
      foundMessage.found = true;
      return;
    }

    s.scheduler.stop();
    cronSchedulers.splice(i, 1);
  });

  messages
    .filter((m) => !m.found)
    .forEach((m) => {
      const scheduler = cron.schedule(m.cron, async () =>
        getAndSendMessage(m.id),
      );
      const metadata = {
        id: m.id,
        chatId: m.chatId,
        cron: m.cron,
        scheduler,
      };
      cronSchedulers.push(metadata);
    });
};

onShutdown(() => {
  debug('Stopping schedulers for cron messages');
  cronSchedulers.forEach((s) => s.scheduler.stop());
  cronSchedulers.length = 0;
});

export default updateCronSchedulers;
