import _ from 'lodash';
import { User } from '../index';

function userFormatter({
  id,
  is_bot,
  first_name,
  last_name,
  username,
  language_code,
}) {
  const user = {};
  user.id = id;
  user.isBot = is_bot;
  user.firstName = first_name;
  user.lastName = last_name;
  user.username = username;
  user.languageCode = language_code;
  user.updatedAt = Date.now();
  return user;
}

async function findOrCreateUser(data) {
  const user = userFormatter(data);
  let foundedUser = await User.findOne({ id: user.id });
  if (foundedUser) {
    foundedUser = _.assign(foundedUser, user);
    await foundedUser.save();
  } else {
    foundedUser = await new User(user).save();
  }

  return foundedUser;
}

export default findOrCreateUser;
