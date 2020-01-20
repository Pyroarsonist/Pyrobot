import { Schema } from 'mongoose';
import db from 'core/mongo';
import { date } from 'data/tools';

const Model = new Schema(
  {
    id: { type: String, required: true, unique: true },
    isBot: String,
    firstName: String,
    lastName: String,
    username: String,
    languageCode: String,
  },
  {
    timestamps: true,
  },
);

function getUser() {
  return {
    id: this.id,
    username: this.username,
    firstName: this.firstName,
    lastName: this.firstName,
    languageCode: this.languageCode,
    createdAt: date(this.createdAt),
    updatedAt: date(this.updatedAt),
  };
}

Model.virtual('formatted').get(getUser);

function getMention() {
  const tg = `(tg://user?id=${this.id})`;
  if (this.username) {
    return `[@${this.username}]${tg}`;
  }
  const names = [];
  if (this.firstName) names.push(this.firstName);
  if (this.lastName) names.push(this.lastName);
  return `[${names.join(' ')}]${tg}`;
}

function getName() {
  if (this.username) {
    return `*@${this.username}*`;
  }
  const names = [];
  if (this.firstName) names.push(this.firstName);
  if (this.lastName) names.push(this.lastName);
  return `*${names.join(' ')}*`;
}

Model.virtual('mention').get(getMention);
Model.virtual('name').get(getName);

const User = db.model('User', Model);

function userFormatter({
  id,
  is_bot,
  first_name,
  last_name,
  username,
  language_code,
}) {
  const user = {};
  user.id = id;
  user.isBot = is_bot;
  user.firstName = first_name;
  user.lastName = last_name;
  user.username = username;
  user.languageCode = language_code;
  user.updatedAt = Date.now();
  return user;
}

async function findOrCreateUser(data) {
  const user = userFormatter(data);
  let foundedUser = await User.findOne({ id: user.id });
  if (foundedUser) {
    foundedUser = Object.assign(foundedUser, user);
    await foundedUser.save();
  } else {
    foundedUser = await new User(user).save();
  }

  return foundedUser;
}
export { findOrCreateUser };
export default User;
