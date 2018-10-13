import plotTrigger from './plotTrigger';
import defaultTrigger from './defaultTrigger';
import textTrigger from './textTrigger';
import dvachTrigger from './dvachTrigger';
import picTrigger from './picTrigger';
import jojoTrigger from './jojoTrigger';

// order matters
function* generateTriggers() {
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
