import winston from 'winston';
import 'winston-daily-rotate-file';
import fs from 'fs';
import registerShutdownHandler from './shutdown';

const logDir = 'logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const timestamp = () => {
  const d = new Date();
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
};

const customFormat = info => `[${timestamp()}] ${info.message}`;

const fileTransport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/%DATE%.log`,
  datePattern: 'DD-MM-YYYY',
  level: 'info',
  prepend: true,
  colorize: true,
  json: false,
  format: winston.format.printf(info => customFormat(info)),
});

const errorTransport = new winston.transports.File({
  name: 'error-file',
  filename: './logs/exceptions.log',
  level: 'error',
  colorize: true,
  json: true,
});

const logger = winston.createLogger({
  transports: [fileTransport, errorTransport],
  exitOnError: false,
});

registerShutdownHandler(() => {
  console.info('Shutting down logger');
  if (logger) logger.clear();
});
console.info('Starting logger');

export default logger;
