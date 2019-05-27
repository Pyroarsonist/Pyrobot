import { whatNiggerGidid } from 'constants';

export default async ctx => {
  const response = !!ctx.message.text.match(/what|\?\?\?|каво|что?/gi);
  if (response) {
    await ctx.replyWithDocument(whatNiggerGidid, ctx.pyroInfo.replyOptions);
    return true;
  }

  return false;
};
