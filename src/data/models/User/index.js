import { Schema } from 'mongoose';
import db from 'core/mongo';
import { date } from 'data/tools';

const User = new Schema(
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

User.virtual('formatted').get(getUser);

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

User.virtual('mention').get(getMention);
User.virtual('name').get(getName);

export default db.model('User', User);
