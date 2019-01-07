import _ from 'lodash';
import { Chat } from '../index';

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
    foundedChat = _.assign(foundedChat, chat);
    await foundedChat.save();
  } else {
    foundedChat = await new Chat(chat).save();
  }
  return foundedChat;
}

export default findOrCreateChat;
