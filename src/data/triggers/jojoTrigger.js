import { pyroBotId } from 'constants';
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
  'Yoshikage Kira',
  'Jojo',
];

const getStickerFileName = async ctx => {
  const name = sample(stickerPackNames);
  // todo: telegram cant get stickers in webhooks mode
  ctx.webhookReply = false;
  const pack = await ctx.getStickerSet(name);
  ctx.webhookReply = true;

  if (!pack || !pack.stickers) return null;
  // eslint-disable-next-line camelcase
  return sample(pack.stickers.filter(x => x?.file_id));
};

export default async ctx => {
  if (!ctx?.message?.text) return false;

  const response = !!ctx.message.text.match(regex);
  if (response) {
    const needReply = ctx.message?.reply_to_message?.from?.id === pyroBotId;

    const replyOptions = {
      reply_to_message_id: needReply ? ctx.message.message_id : null,
    };

    try {
      const file = await getStickerFileName(ctx);
      if (file) {
        await ctx.replyWithSticker(file.file_id, replyOptions);
      } else {
        await ctx.reply('jare jare daze', replyOptions);
      }
    } catch (e) {
      console.error(e);
      await ctx.reply('kono dio da', replyOptions);
    }
    return true;
  }

  return false;
};
