import Sequelize from 'sequelize';
import { date } from 'data/tools';
import Model from '../sequelize';

const Chat = Model.define('Chat', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
  },
  type: {
    type: Sequelize.STRING(32),
  },
  title: {
    type: Sequelize.STRING(1024),
  },
  userName: {
    type: Sequelize.STRING(1024),
  },
  firstName: {
    type: Sequelize.STRING(1024),
  },
  lastName: {
    type: Sequelize.STRING(1024),
  },
  allMembersAreAdministrators: {
    type: Sequelize.STRING(1024),
  },
  // returned in get chat
  photo: {
    type: Sequelize.STRING(1024),
  },
  description: {
    type: Sequelize.STRING(1024),
  },
  inviteLink: {
    type: Sequelize.STRING(1024),
  },
  pinnedMessage: {
    type: Sequelize.STRING(1024),
  },
  stickerSetName: {
    type: Sequelize.STRING(1024),
  },
  catSetStickerSet: {
    type: Sequelize.STRING(1024),
  },
});

Chat.prototype.serialize = function serialize() {
  return {
    id: this.id,
    userName: this.userName,
    type: this.type,
    firstName: this.firstName,
    lastName: this.firstName,
    title: this.title,
    createdAt: date(this.createdAt),
    updatedAt: date(this.updatedAt),
  };
};

Chat.assert = async (_data) => {
  const data = {
    id: _data.id,
    type: _data.type,
    title: _data.title,
    userName: _data.username,
    firstName: _data.first_name,
    lastName: _data.last_name,
    allMembersAreAdministrators: _data.all_members_are_administrators,
    photo: _data.photo,
    description: _data.description,
    inviteLink: _data.invite_link,
    pinnedMessage: _data.pinned_message,
    stickerSetName: _data.sticker_set_name,
    catSetStickerSet: _data.can_set_sticker_set,
  };
  const [chat] = await Chat.upsert(data, { returning: true });
  return chat;
};

export default Chat;
