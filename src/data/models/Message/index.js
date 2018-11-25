import { Schema } from 'mongoose';
import db from 'core/mongo';

const Message = new Schema(
  {
    id: { type: String, required: true },
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

export default db.model('Message', Message);
