import { EmoteFetcher } from '@mkody/twitch-emoticons';

import { twitch } from '../../config';

const fetcher = new EmoteFetcher(twitch.ID, twitch.SECRET);

const getURL = async (emote) => {
  await fetcher.fetchTwitchEmotes(null);

  const foundEmote = fetcher.emotes.get(emote);

  if (!foundEmote) return null;

  return foundEmote.toLink(3);
};

const regex = /(твитч эмоция|twitch emote) (?<emote>.+)/i;

const getArg = (text) => {
  if (!text) {
    return null;
  }

  const regexData = regex.exec(text);

  const { emote } = regexData.groups;

  return emote;
};

export default async (ctx) => {
  const response = !!ctx.message.text.match(regex);
  if (!response) {
    return false;
  }

  const arg = getArg(ctx.message.text);
  if (!arg) return false;

  try {
    const url = await getURL(arg);
    if (!url) {
      await ctx.reply('нет такого твитч эмота', ctx.pyroInfo.replyOptions);
      return true;
    }

    await ctx.replyWithPhoto(url, ctx.pyroInfo.replyOptions);
  } catch (e) {
    console.error(e);
    await ctx.reply('твитч сломался(((', ctx.pyroInfo.replyOptions);
  }

  return true;
};
