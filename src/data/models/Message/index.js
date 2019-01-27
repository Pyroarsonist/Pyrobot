import { Schema } from 'mongoose';
import db from 'core/mongo';
import { date } from 'data/tools';

const Message = new Schema(
  {
    id: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
    date: String,
    text: String,
    replyToMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  },
  {
    timestamps: true,
  },
);

function getMessage() {
  const names = [];
  if (this.user.firstName) names.push(this.user.firstName);
  if (this.user.lastName) names.push(this.user.lastName);
  return {
    id: this.id,
    user: this.user.username || names.join(' '),
    text: this.text,
    date: date(this.date * 1000),
  };
}

Message.virtual('formatted').get(getMessage);

export default db.model('Message', Message);
