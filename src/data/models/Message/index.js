import { Schema } from 'mongoose';
import db from 'core/mongo';

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
  return {
    id: this.id,
    user: this.user.username,
    text: this.text,
    date: new Date(+this.date * 1000).toTimeString(),
  };
}

Message.virtual('formatted').get(getMessage);

export default db.model('Message', Message);
