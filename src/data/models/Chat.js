import { Schema } from 'mongoose';
import db from 'core/mongo';
import { date } from 'data/tools';

const Model = new Schema(
  {
    id: { type: String, required: true, unique: true },
    type: String,
    title: String,
    username: String,
    firstName: String,
    lastName: String,
    allMembersAreAdministrators: String,
    // get chat
    photo: String,
    description: String,
    inviteLink: String,
    pinnedMessage: String,
    stickerSetName: String,
    catSetStickerSet: String,
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  },
  {
    timestamps: true,
  },
);

function getChat() {
  return {
    id: this.id,
    username: this.username,
    type: this.type,
    firstName: this.firstName,
    lastName: this.firstName,
    title: this.title,
    createdAt: date(this.createdAt),
    updatedAt: date(this.updatedAt),
  };
}

Model.virtual('formatted').get(getChat);

const Chat = db.model('Chat', Model);

function chatFormatter({
  id,
  type,
  title,
  username,
  first_name,
  last_name,
  all_members_are_administrators,
  photo,
  description,
  invite_link,
  pinned_message,
  sticker_set_name,
  can_set_sticker_set,
}) {
  const chat = {};
  chat.id = id;
  chat.type = type;
  chat.title = title;
  chat.username = username;
  chat.firstName = first_name;
  chat.lastName = last_name;
  chat.allMembersAreAdministrators = all_members_are_administrators;
  // get chat
  chat.photo = photo;
  chat.description = description;
  chat.inviteLink = invite_link;
  chat.pinnedMessage = pinned_message;
  chat.stickerSetName = sticker_set_name;
  chat.catSetStickerSet = can_set_sticker_set;
  chat.updatedAt = Date.now();
  return chat;
}

async function findOrCreateChat(data) {
  const chat = chatFormatter(data);
  let foundedChat = await Chat.findOne({ id: chat.id });
  if (foundedChat) {
    foundedChat = Object.assign(foundedChat, chat);
    await foundedChat.save();
  } else {
    foundedChat = await new Chat(chat).save();
  }
  return foundedChat;
}
export { findOrCreateChat };
export default Chat;
