import plotTrigger from './plotTrigger';
import defaultTrigger from './defaultTrigger';
import textTrigger from './textTrigger';
import dvachTrigger from './dvachTrigger';

// order matters
function* generateTriggers() {
  yield dvachTrigger;
  yield plotTrigger;
  yield textTrigger;
  return defaultTrigger;
}
export default generateTriggers;
