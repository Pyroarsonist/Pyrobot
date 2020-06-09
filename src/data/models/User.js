import Sequelize from 'sequelize';
import { date } from 'data/tools';
import Model from '../sequelize';

const User = Model.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  isBot: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  firstName: {
    type: Sequelize.STRING(1024),
  },
  lastName: {
    type: Sequelize.STRING(1024),
  },
  userName: {
    type: Sequelize.STRING(1024),
  },
  languageCode: {
    type: Sequelize.STRING(1024),
  },
});

User.prototype.serialize = function serialize() {
  return {
    id: this.id,
    userName: this.userName,
    firstName: this.firstName,
    lastName: this.firstName,
    languageCode: this.languageCode,
    createdAt: date(this.createdAt),
    updatedAt: date(this.updatedAt),
  };
};

User.prototype.getMention = function getMention() {
  const tg = `(tg://user?id=${this.id})`;
  if (this.userName) {
    return `[@${this.userName}]${tg}`;
  }
  const names = [];
  if (this.firstName) {
    names.push(this.firstName);
  }
  if (this.lastName) {
    names.push(this.lastName);
  }
  return `[${names.join(' ')}]${tg}`;
};

User.assert = async (_data) => {
  const data = {
    id: _data.id,
    isBot: _data.is_bot,
    firstName: _data.first_name,
    lastName: _data.last_name,
    userName: _data.username,
    languageCode: _data.language_code,
  };
  const [user] = await User.upsert(data, { returning: true });
  return user;
};

export default User;
