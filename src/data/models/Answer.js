import Sequelize from 'sequelize';
import Model from '../sequelize';

const Answer = Model.define('Answer', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  regex: {
    type: Sequelize.STRING(1024),
  },
  answers: {
    type: Sequelize.ARRAY(Sequelize.STRING(1024)),
  },
});

export default Answer;
