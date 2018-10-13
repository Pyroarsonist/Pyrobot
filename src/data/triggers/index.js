import plotTrigger from './plotTrigger';
import defaultTrigger from './defaultTrigger';
import textTrigger from './textTrigger';
import dvachTrigger from './dvachTrigger';
import picTrigger from './picTrigger';
import jojoTrigger from './jojoTrigger';
import sayInChatTrigger from './sayInChatTrigger';
import getChatsTrigger from './getChatsTrigger';

// order matters
function* generateTriggers() {
  // admin triggers
  yield sayInChatTrigger;
  yield getChatsTrigger;

  // triggers with arguments
  yield picTrigger;

  // triggers with code words
  yield dvachTrigger;
  yield jojoTrigger;
  yield plotTrigger;

  // regexes
  yield textTrigger;
  return defaultTrigger;
}
export default generateTriggers;
