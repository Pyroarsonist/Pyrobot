import { Schema } from 'mongoose';
import db from 'core/mongo';
import { date } from 'data/tools';

const Chat = new Schema(
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
    createdAt: date(this.createdAt),
    updatedAt: date(this.updatedAt),
  };
}

Chat.virtual('formatted').get(getChat);

export default db.model('Chat', Chat);
