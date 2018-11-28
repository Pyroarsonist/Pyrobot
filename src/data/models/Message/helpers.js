/* eslint-disable no-use-before-define */
import _ from 'lodash';
import { findOrCreateChat, findOrCreateUser, Message } from '../index';

async function messageFormatter({
  message_id,
  from,
  chat,
  date,
  text,
  reply_to_message,
}) {
  const message = {};
  message.id = message_id;
  message.user = await findOrCreateUser(from); // user model
  message.chat = await findOrCreateChat(chat); // chat model
  message.date = date;
  message.text = text;
  if (reply_to_message)
    message.replyToMessage = await findOrCreateMessage(reply_to_message);

  message.updatedAt = Date.now();
  return message;
}

async function findOrCreateMessage(data) {
  const message = await messageFormatter(data);
  let foundedMessage = await Message.findOne({ id: message.id });
  if (foundedMessage) {
    foundedMessage = _.assign(foundedMessage, message);
    await foundedMessage.save();
  } else {
    foundedMessage = await new Message(message).save();
  }

  return foundedMessage;
}

export default findOrCreateMessage;
