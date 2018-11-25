import { Schema } from 'mongoose';
import db from 'core/mongo';
import date from 'data/tools/date';

const User = new Schema(
  {
    id: { type: String, required: true },
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

User.virtual('validated').get(getUser);

export default db.model('User', User);
