import { sample, findIndex } from 'lodash';
import h2p from 'html2plaintext';
import DvachApi from 'dvach.js';

const regex = /dvach|двач|2ch/gi;

const errorMessage = 'Timeout on dvach request';

const getBoard = (text) => {
  let res = 'b';
  if (text) {
    const split = text.split(' ');
    const index = findIndex(split, (word) => !!word.match(regex));
    if (split.length > index + 1) {
      res = split[index + 1];
    }
  }
  return res;
};

const getPost = (threads, board) => {
  const defRet =
    'Найс запрос, даунец\nСразу видно опытного двачера\nИди ракуй на b';
  if (!threads || !threads.length) {
    return defRet;
  }
  const thread = sample(threads.filter((x) => x?.post));
  if (!thread) {
    return null;
  }
  if (thread.status === 404) {
    return defRet;
  }
  let resStr = `/${board}/ #${thread.num}\n`;
  resStr += `${thread.post.subject}\n\n`;
  resStr += `${h2p(thread.post.comment)}\n`;
  resStr += `Ссылочка: https://2ch.hk/${board}/res/${thread.num}.html\n`;
  return resStr;
};

const initTimeout = () =>
  new Promise((res, rej) => {
    setTimeout(() => rej(new Error(errorMessage)), 5000);
  });

export default async (ctx) => {
  const response = !!ctx.message.text.match(regex);
  if (response) {
    const board = getBoard(ctx.message.text);

    try {
      const threads = await Promise.race([
        DvachApi.getBoard(board),
        initTimeout(),
      ]);
      const post = getPost(threads, board);

      if (post) {
        await ctx.reply(post, ctx.pyroInfo.replyOptions);
      } else {
        await ctx.reply('сап двач', ctx.pyroInfo.replyOptions);
      }
    } catch (e) {
      if (e.message === errorMessage) {
        await ctx.reply(
          'двач таймаутнулся, долго запросик к ним в апишку ходит',
          ctx.pyroInfo.replyOptions,
        );
        return true;
      }

      console.error(e);
      await ctx.reply('двач сломался', ctx.pyroInfo.replyOptions);
    }
    return true;
  }

  return false;
};
