import plotTrigger from './plotTrigger';
import defaultTrigger from './defaultTrigger';
import textTrigger from './textTrigger';
import dvachTrigger from './dvachTrigger';
import picTrigger from './picTrigger';
import yesOrNoTrigger from './yesOrNoTrigger';
import jojoTrigger from './jojoTrigger';
import sayInChatTrigger from './sayInChatTrigger';
import broadcastTrigger from './broadcastTrigger';
import getChatsTrigger from './getChatsTrigger';
import getUsersTrigger from './getUsersTrigger';
import addAnswer from './addAnswer';
import getLastUniqueMessagesTrigger from './getLastUniqueMessagesTrigger';
import shrekTrigger from './shrekTrigger';
import whatNiggerTrigger from './whatNiggerTrigger';
import neuroTrigger from './neuroTrigger';

// order matters
function* generateTriggers() {
  // admin triggers
  yield addAnswer;
  yield sayInChatTrigger;
  yield broadcastTrigger;
  yield getUsersTrigger;
  yield getChatsTrigger;
  yield getLastUniqueMessagesTrigger;

  // triggers with arguments
  yield picTrigger;
  yield yesOrNoTrigger;

  // triggers with code words
  yield neuroTrigger;
  yield dvachTrigger;
  yield jojoTrigger;
  yield plotTrigger;
  yield shrekTrigger;
  yield whatNiggerTrigger;

  // regexes
  yield textTrigger;
  return defaultTrigger;
}
export default generateTriggers;
