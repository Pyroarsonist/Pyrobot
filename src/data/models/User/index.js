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

User.virtual('validated').get(function() {
  return {
    id: this.id,
    username: this.username,
    firstName: this.firstName,
    lastName: this.firstName,
    languageCode: this.languageCode,
    createdAt: date(this.createdAt),
    updatedAt: date(this.updatedAt),
  };
});

export default db.model('User', User);
