import { pyroBotId } from 'constants';
import logger from 'core/logger';
import { sample, findIndex } from 'lodash';
import h2p from 'html2plaintext';
import DvachApi from 'dvach.js';

const regex = /dvach|двач|2ch/gi;

const getBoard = text => {
  let res = 'b';
  if (text) {
    const split = text.split(' ');
    const index = findIndex(split, word => !!word.match(regex));
    if (split.length > index + 1) res = split[index + 1];
  }
  return res;
};

const getPost = (threads, board) => {
  const defRet =
    'Найс запрос, даунец\nСразу видно опытного двачера\nИди ракуй на b';
  if (!threads || !threads.length) return defRet;
  const thread = sample(threads.filter(x => x || x.post));
  if (!thread) return null;
  if (thread.status === 404) return defRet;
  let resStr = `/${board}/ #${thread.num}\n`;
  resStr += `${thread.post.subject}\n\n`;
  resStr += `${h2p(thread.post.comment)}\n`;
  resStr += `Ссылочка: https://2ch.hk/${board}/res/${thread.num}.html\n`;
  return resStr;
};

export default async ctx => {
  if (!ctx || !ctx.message || !ctx.message.text) return false;

  const response = !!ctx.message.text.match(regex);
  if (response) {
    const board = getBoard(ctx.message.text);
    const needReply =
      ctx.message.reply_to_message &&
      ctx.message.reply_to_message.from.id === pyroBotId;

    const replyOptions = {
      reply_to_message_id: needReply ? ctx.message.message_id : null,
    };

    try {
      const threads = await DvachApi.getBoard(board);
      const post = getPost(threads, board);

      if (post) await ctx.reply(post, replyOptions);
      else await ctx.reply('сап двач', replyOptions);
      logger.info(`Sent 2ch post to ${JSON.stringify(ctx.chat)}\n${post}`);
    } catch (e) {
      console.error(e);
      logger.error(e.toString());
      await ctx.reply('двач сломался', replyOptions);
    }
    return true;
  }

  return false;
};
