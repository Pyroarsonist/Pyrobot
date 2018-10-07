import plotTrigger from './plotTrigger';
import defaultTrigger from './defaultTrigger';
import textTrigger from './textTrigger';
import dvachTrigger from './dvachTrigger';
import picTrigger from './picTrigger';

// order matters
function* generateTriggers() {
  yield dvachTrigger;
  yield picTrigger;
  yield plotTrigger;
  yield textTrigger;
  return defaultTrigger;
}
export default generateTriggers;
