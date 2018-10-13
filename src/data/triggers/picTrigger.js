import { pyroBotId } from 'constants';
import logger from 'core/logger';
import { findIndex, sample } from 'lodash';

import randomPicture from 'random-picture';
import GoogleImages from 'google-images';

import { google } from 'config';

const regex = /картинка|pic|img|image|пик/gi;

const range = 10;

const getArg = text => {
  if (text) {
    const split = text.split(' ');
    const index = findIndex(split, word => !!word.match(regex));
    if (split.length <= index + 1) return null;
    return split.slice(index + 1).join(' ');
  }
  return null;
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

    const arg = getArg(ctx.message.text);

    try {
      if (arg) {
        const client = new GoogleImages(google.cse, google.api);
        const images = await client.search(arg);
        const image = sample(images.slice(range).filter(x => x && x.url));
        await ctx.replyWithPhoto(image.url, replyOptions);
        logger.info(
          `Sent random picture ${image.url} to ${JSON.stringify(ctx.chat)}`,
        );
      } else {
        const picture = await randomPicture();
        await ctx.replyWithPhoto(picture.url, replyOptions);
        logger.info(
          `Sent google picture ${picture.url} to ${JSON.stringify(ctx.chat)}`,
        );
      }
    } catch (e) {
      console.error(e);
      logger.error(e.toString());
      await ctx.reply('нет будет вам картинки, заебали', replyOptions);
    }

    return true;
  }

  return false;
};
