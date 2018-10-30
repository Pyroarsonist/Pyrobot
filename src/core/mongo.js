// todo

import { MongoClient } from 'mongodb';
import { mongo } from 'config';
import registerShutdownHandler from 'core/shutdown';

import debugHandler from 'debug';

const debug = debugHandler('pyrobot:mongo');

function User({ id, is_bot, first_name, last_name, username, language_code }) {
  this.id = id;
  this.isBot = is_bot;
  this.firstName = first_name;
  this.lastName = last_name;
  this.username = username;
  this.languageCode = language_code;
  this.createdAt = Date.now();
  this.updatedAt = Date.now();
}

function Chat({
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
  this.id = id;
  this.type = type;
  this.title = title;
  this.username = username;
  this.firstName = first_name;
  this.lastName = last_name;
  this.allMembersAreAdministrators = all_members_are_administrators;
  // get chat
  this.photo = photo;
  this.description = description;
  this.inviteLink = invite_link;
  this.pinnedMessage = pinned_message;
  this.stickerSetName = sticker_set_name;
  this.catSetStickerSet = can_set_sticker_set;
}

function Message({ message_id, from, chat, date, text, reply_to_message }) {
  this.id = message_id;
  this.from = from; // user  model
  this.chat = chat; // chat model
  this.date = date;
  this.text = text;
  this.replyToMessage = reply_to_message;
  this.createdAt = Date.now();
  this.updatedAt = Date.now();
}

const usersCollectionName = 'users';
const chatsCollectionName = 'chats';
const messagesCollectionName = 'messages';

let db = null;

let usersCollection = null;
let chatsCollection = null;
let messagesCollection = null;

function checkCollection(collection) {
  if (!db) {
    debug('No database provided');
    return false;
  }
  if (!collection) {
    debug('No collection provided');
    return false;
  }
  return true;
}

// const updateMatch = async data => {
//   if (!checkCollection(usersCollection)) return null;
//   if (!data) {
//     debug('data absent while updating');
//     return null;
//   }
//   if (!data.matchId) {
//     debug('matchId absent while updating');
//     return null;
//   }
//
//   try {
//     const match = new Match(data);
//     await usersCollection.updateOne(
//       { matchId: data.matchId },
//       { $set: match },
//       { upsert: true },
//     );
//     debug(`Successfully updated match №${data.matchId}`);
//   } catch (e) {
//     debug(`Error when updating match\n${e}`);
//   }
//   return null;
// };
//
// const updateTournament = async (
//   tournamentId,
//   matchesIds,
//   lastUsedCurl,
//   eventName,
// ) => {
//   if (!checkCollection(messagesCollection)) return null;
//   if (!tournamentId) {
//     debug('tournamentId absent while updating');
//     return null;
//   }
//
//   try {
//     const tournament = new Tournament(
//       tournamentId,
//       matchesIds,
//       lastUsedCurl,
//       eventName,
//     );
//     await messagesCollection.updateOne(
//       { tournamentId },
//       { $set: tournament },
//       { upsert: true },
//     );
//     debug(`Successfully updated match №${tournamentId}`);
//   } catch (e) {
//     debug(`Error when updating tournament\n${e}`);
//   }
//   return null;
// };
//
// const updateTeamStats = async (teamId, mapId, payload, lastUsedCurl) => {
//   if (!checkCollection(chatsCollection)) return null;
//   if (!teamId || !mapId) {
//     debug('teamId or mapId absent while updating');
//     return null;
//   }
//
//   if (!payload) {
//     debug('payload absent while updating');
//     return null;
//   }
//
//   try {
//     const teamStats = new TeamStats(teamId, mapId, payload, lastUsedCurl);
//     await chatsCollection.updateOne(
//       { teamId, mapId },
//       { $set: teamStats },
//       { upsert: true },
//     );
//     debug(
//       `Successfully updated teamStats with team №${teamId} with mapId №${mapId}`,
//     );
//   } catch (e) {
//     debug(`Error when updating teamStats\n${e}`);
//   }
//   return null;
// };
//
// const getMatches = async () => {
//   if (!checkCollection(usersCollection)) return null;
//   try {
//     return usersCollection.find().toArray();
//   } catch (e) {
//     debug(`Error when fetching matches\n${e}`);
//     return [];
//   }
// };
//
// const findMatchById = async matchId => {
//   if (!checkCollection(usersCollection)) return null;
//   if (!matchId) debug('No match id is provided');
//
//   try {
//     return await usersCollection.findOne({ matchId });
//   } catch (e) {
//     debug(`Error when finding match by match id\n${e}`);
//     return null;
//   }
// };
//
// const findTournamentById = async tournamentId => {
//   if (!checkCollection(messagesCollection)) return null;
//   if (!tournamentId) debug('No tournament id is provided');
//
//   try {
//     return await messagesCollection.findOne({ tournamentId });
//   } catch (e) {
//     debug(`Error when finding tournament by tournament id\n${e}`);
//     return null;
//   }
// };
//
// const findTeamStatsByTeamIdAndMapId = async (teamId, mapId) => {
//   if (!checkCollection(chatsCollection)) return null;
//   if (!teamId || !mapId) debug('No team id or map id is provided');
//
//   try {
//     return await chatsCollection.findOne({ teamId, mapId });
//   } catch (e) {
//     debug(`Error when finding teamStats by team id and map id\n${e}`);
//     return null;
//   }
// };

export default async function() {
  try {
    await MongoClient.connect(
      mongo.url,
      { useNewUrlParser: true },
      async (err, client) => {
        if (err) throw err;
        debug('Connected successfully to mongo server');

        db = await client.db(mongo.db);
        usersCollection = await db.collection(usersCollectionName);
        messagesCollection = await db.collection(chatsCollectionName);
        chatsCollection = await db.collection(messagesCollectionName);

        registerShutdownHandler(async () => {
          debug('Shutting down mongo client');
          if (client) await client.close();
        });
      },
    );
  } catch (e) {
    debug(`Error when initializing mongo client\n${e}`);
  }
}

export // updateMatch,
// getMatches,
// updateTeamStats,
// findTeamStatsByTeamIdAndMapId,
// findMatchById,
// updateTournament,
// findTournamentById,
{};
