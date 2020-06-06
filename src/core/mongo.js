import mongoose from 'mongoose';
import debugHandler from 'debug';
import { mongoDB } from 'config';

const debug = debugHandler('pyrobot:mongo');

const db = mongoose.createConnection(mongoDB, {
  useNewUrlParser: true,
});

db.on('error', (error) => {
  debug('Error in connecting to mongo: %o', error);
});

db.on('connected', () => {
  debug('Connected to mongo');
});

db.on('disconnected', () => {
  debug('Disconnected from mongo');
});

export default db;
