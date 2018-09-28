import _ from 'lodash';

import { regexes, answers } from '../../constants';

import plotTrigger from './plot';

export default text => {
  if (!text) return _.sample(answers);
  let response = null;

  regexes.map(r => {
    const ret = text.match(r.regex);
    if (ret) {
      response = r.answer;
    }
    return ret;
  });
  if (!response) response = _.sample(answers);
  return response;
};

export { plotTrigger };
