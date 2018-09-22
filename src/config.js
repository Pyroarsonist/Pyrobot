import dotenv from 'dotenv';

dotenv.config();

export const server = {
  port: process.env.PORT || 22222,
  publicUrl: process.env.PUBLIC_URL,
  publicPort: process.env.PUBLIC_PORT,
};

export const sslFolder = process.env.SSL_FOLDER;

export const bot = {
  token: process.env.TELEGRAM_BOT_TOKEN,
};

// eslint-disable-next-line no-underscore-dangle
global.__DEV__ = process.env.NODE_ENV !== 'production';
