import moment from 'moment';

const format = 'hh:mm:ss DD-MM-YYYY';

export default (date, customFormat = format) =>
  moment(date).format(customFormat);
