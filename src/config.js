import dotenv from 'dotenv';

dotenv.config();

export const server = {
  port: process.env.PORT || 8443,
  url: process.env.URL,
};

export const sslFolder = process.env.SSL_FOLDER;

export const token = process.env.TELEGRAM_BOT_TOKEN;

// https://github.com/nodejs/help/issues/253 or create_ssl_serticifates.sh for creating certificates
export const tlsPaths = {
  key: `${sslFolder}certs/server/server.key`, // Path to file with PEM private key
  cert: `${sslFolder}certs/server/server.crt`, // Path to file with PEM certificate (should be with your url)
  ca: `${sslFolder}certs/ca/ca.crt`, // This is necessary only if the client uses the self-signed certificate.
};

export const google = {
  cse: process.env.GOOGLE_CSE,
  api: process.env.GOOGLE_API_KEY,
};

export const mongoDB = process.env.MONGO_DB;

export const shrekGifId = process.env.SHREK_GIF_ID;
export const whatNiggerGifId = process.env.WHAT_NIGGER_GIF_ID;

export const neuro = {
  disabled: !!process.env.NEURO_DISABLED,
  messagesLimit: !!process.env.NEURO_MESSAGES_LIMIT || 100,
  iteration: process.env.NEURO_ITERATION || 150,
  errorThresh: process.env.NEURO_ERROR_THRESH || 0.001,
  learningRate: process.env.NEURO_LEARNING_RATE || 0.1,
  trainInterval: process.env.NEURO_TRAIN_INTERVAL || 60 * 60 * 1000, // 1 hour
};

// eslint-disable-next-line no-underscore-dangle
global.__DEV__ = process.env.NODE_ENV !== 'production';

export const pyrobotId =
  process.env.PYROBOT_ID || __DEV__
    ? 396290834 // dev
    : 503111149; // prod
