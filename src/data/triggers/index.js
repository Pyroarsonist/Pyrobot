import plotTrigger from './plotTrigger';
import defaultTrigger from './defaultTrigger';
import textTrigger from './textTrigger';

// order matters
function* generateTriggers() {
  yield plotTrigger;
  yield textTrigger;
  return defaultTrigger;
}
export default generateTriggers;
