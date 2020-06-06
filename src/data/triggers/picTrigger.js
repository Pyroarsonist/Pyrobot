import { findIndex, sample } from 'lodash';

import randomPicture from 'random-picture';
import GoogleImages from 'google-images';

import { google } from 'config';

const regex = /картинка|pic|img|image|пик/gi;

const range = 15;

const getArg = (text) => {
  if (text) {
    const split = text.split(' ');
    const index = findIndex(split, (word) => !!word.match(regex));
    if (split.length <= index + 1) {
      return null;
    }
    return split.slice(index + 1).join(' ');
  }
  return null;
};

export default async (ctx) => {
  const response = !!ctx.message.text.match(regex);
  if (response) {
    const arg = getArg(ctx.message.text);

    try {
      if (arg) {
        const client = new GoogleImages(google.cse, google.api);
        const images = await client.search(arg);
        if (!images.length) {
          await ctx.reply(
            'Такого запроса даже в гугле нету, даунец))',
            ctx.pyroInfo.replyOptions,
          );
        } else {
          const image = sample(images.filter((x) => x?.url).slice(0, range));
          await ctx.replyWithPhoto(image.url, ctx.pyroInfo.replyOptions);
        }
      } else {
        const picture = await randomPicture();
        await ctx.replyWithPhoto(picture.url, ctx.pyroInfo.replyOptions);
      }
    } catch (e) {
      console.error(e);
      await ctx.reply(
        'не будет вам картинки, заебали',
        ctx.pyroInfo.replyOptions,
      );
    }

    return true;
  }

  return false;
};
