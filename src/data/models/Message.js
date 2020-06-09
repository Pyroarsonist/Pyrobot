import Sequelize from 'sequelize';
import { date } from 'data/tools';
import Model from '../sequelize';

import Chat from './Chat';
import User from './User';

const Message = Model.define('Message', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  date: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  text: {
    type: Sequelize.STRING(1024),
  },
  replyToMessageId: {
    type: Sequelize.INTEGER,
  },
});

Message.prototype.serialize = function serialize() {
  const names = [];
  if (this.user.firstName) {
    names.push(this.user.firstName);
  }
  if (this.user.lastName) {
    names.push(this.user.lastName);
  }
  return {
    id: this.id,
    user: this.user.userName || names.join(' '),
    text: this.text,
    date: date(this.date * 1000),
  };
};

Message.assert = async (_data) => {
  const data = {
    id: _data.message_id,
    date: _data.date,
    text: _data.text,
    replyToMessageId: _data.reply_to_message?.message_id,
    userId: _data.from?.id,
    chatId: _data.chat?.id,
  };
  const [message] = await Message.upsert(data, { returning: true });

  if (_data.from) message.user = await User.assert(_data.from);

  if (_data.chat) message.chat = await Chat.assert(_data.chat);

  if (data.replyToMessageId) {
    message.replyToMessage = await Message.findByPk(data.replyToMessageId, {
      include: [
        {
          model: User,
          as: 'user',
        },
        { model: Chat, as: 'chat' },
      ],
    });
  }

  return message;
};

export default Message;
