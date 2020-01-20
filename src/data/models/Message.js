import { Schema } from 'mongoose';
import db from 'core/mongo';
import { date } from 'data/tools';
// eslint-disable-next-line import/no-cycle
import { findOrCreateChat, findOrCreateUser } from './index';

const Model = new Schema(
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

Model.virtual('formatted').get(getMessage);

const Message = db.model('Message', Model);

async function messageFormatter({
  message_id,
  from,
  chat,
  date: dateVal,
  text,
  reply_to_message,
}) {
  const message = {};
  message.id = message_id;
  message.user = await findOrCreateUser(from); // user model
  message.chat = await findOrCreateChat(chat); // chat model
  message.date = dateVal;
  message.text = text;
  if (reply_to_message)
    // eslint-disable-next-line no-use-before-define
    message.replyToMessage = await findOrCreateMessage(reply_to_message);

  message.updatedAt = Date.now();
  return message;
}

async function findOrCreateMessage(data) {
  const message = await messageFormatter(data);
  let foundedMessage = await Message.findOne({ id: message.id });
  if (foundedMessage) {
    foundedMessage = Object.assign(foundedMessage, message);
    await foundedMessage.save();
  } else {
    foundedMessage = await new Message(message).save();
  }

  return foundedMessage;
}

export { findOrCreateMessage };
export default Message;
