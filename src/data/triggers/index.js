import plotTrigger from './plotTrigger';
import defaultTrigger from './defaultTrigger';
import textTrigger from './textTrigger';
import dvachTrigger from './dvachTrigger';
import picTrigger from './picTrigger';
import yesOrNoTrigger from './yesOrNoTrigger';
import twitchEmotesTrigger from './twitchEmotesTrigger';
import jojoTrigger from './jojoTrigger';
import sayInChatTrigger from './sayInChatTrigger';
import broadcastTrigger from './broadcastTrigger';
import getChatsTrigger from './getChatsTrigger';
import getUsersTrigger from './getUsersTrigger';
import addAnswer from './addAnswer';
import getLastUniqueMessagesTrigger from './getLastUniqueMessagesTrigger';
import shrekTrigger from './shrekTrigger';
import whatNiggerTrigger from './whatNiggerTrigger';
import cowTrigger from './cowTrigger';
import catTrigger from './catTrigger';
import faceTrigger from './faceTrigger';
import yesTrigger from './yesTrigger';
import noTrigger from './noTrigger';
import superbTrigger from './superbTrigger';
import langTrigger from './langTrigger';

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
  yield twitchEmotesTrigger;

  // triggers with code words
  yield langTrigger;
  yield superbTrigger;
  yield noTrigger;
  yield yesTrigger;
  yield faceTrigger;
  yield catTrigger;
  yield cowTrigger;
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
