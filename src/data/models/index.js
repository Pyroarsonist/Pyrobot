import sequelize from '../sequelize';
import Chat from './Chat';
import User from './User';
import Answer from './Answer';
import Message from './Message';

User.hasMany(Message, {
  foreignKey: 'userId',
  as: 'messages',
});

Chat.hasMany(Message, {
  foreignKey: 'chatId',
  as: 'messages',
});

Message.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Message.belongsTo(Chat, {
  foreignKey: 'chatId',
  as: 'chat',
});

const sync = (...args) => sequelize.sync(...args);

export default { sync };

export { Chat, User, Message, Answer };
