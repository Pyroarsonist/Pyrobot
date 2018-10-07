import { pyroBotId } from 'constants';
import logger from 'core/logger';
import { sample } from 'lodash';

const regex = /jojo|жижа|жожо|dio|дио/gi;

const stickerPackNames = [
  'Jojo_stickers',
  'jojobattle',
  'bizzarro',
  'morejojo',
  'jjbafag',
  'LINE_JoJo',
  'jojomeme',
  'JoJoNoKimyouNaBouken',
];

const getStickerFileName = async ctx => {
  const name = sample(stickerPackNames);
  const pack = await ctx.getStickerSet(name);
  if (!pack || !pack.stickers) return null;
  return sample(pack.stickers.filter(x => x && x.file_id));
};

export default async ctx => {
  if (!ctx || !ctx.message || !ctx.message.text) return false;

  const response = !!ctx.message.text.match(regex);
  if (response) {
    const needReply =
      ctx.message.reply_to_message &&
      ctx.message.reply_to_message.from.id === pyroBotId;

    const replyOptions = {
      reply_to_message_id: needReply ? ctx.message.message_id : null,
    };

    try {
      const file = await getStickerFileName(ctx);
      const answer = file ? file.file_id : 'jare jare daze';
      await ctx.replyWithSticker(answer, replyOptions);
      logger.info(
        `Sent jojo sticker fileName to ${JSON.stringify(ctx.chat)}\n`,
      );
    } catch (e) {
      console.error(e);
      logger.error(e.toString());
      await ctx.reply('kono dio da', replyOptions);
    }
    return true;
  }

  return false;
};
