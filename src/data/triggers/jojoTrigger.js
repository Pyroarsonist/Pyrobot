import { sample } from 'lodash';

const regex = /jojo|жижа|жожо|джоджо|dio|дио/gi;

const stickerPackNames = [
  'Jojo_stickers',
  'jojobattle',
  'bizzarro',
  'morejojo',
  'jjbafag',
  'LINE_JoJo',
  'jojomeme',
  'JoJoNoKimyouNaBouken',
  'Yoshikage',
  'JojosBA',
];

const getStickerFileName = async (ctx) => {
  const name = sample(stickerPackNames);
  ctx.webhookReply = false;
  const pack = await ctx.getStickerSet(name);
  ctx.webhookReply = true;

  if (!pack || !pack.stickers) {
    return null;
  }
  // eslint-disable-next-line camelcase
  return sample(pack.stickers.filter((x) => x?.file_id));
};

export default async (ctx) => {
  const response = !!ctx.message.text.match(regex);
  if (response) {
    try {
      const file = await getStickerFileName(ctx);
      if (file) {
        await ctx.replyWithSticker(file.file_id, ctx.pyroInfo.replyOptions);
      } else {
        await ctx.reply('jare jare daze', ctx.pyroInfo.replyOptions);
      }
    } catch (e) {
      console.error(e);
      await ctx.reply('kono dio da', ctx.pyroInfo.replyOptions);
    }
    return true;
  }

  return false;
};
