/* eslint-disable no-param-reassign */
import db from 'core/mongo';
import { Schema } from 'mongoose';

const Answer = new Schema(
  {
    regex: String,
    answers: [String],
  },
  {
    timestamps: true,
  },
);

export default db.model('Answer', Answer);
