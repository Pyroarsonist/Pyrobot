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
    get() {
      return this.getDataValue('answers').map((a) =>
        a.split(Answer.delimiter).join(','),
      );
    },
    set(val) {
      this.setDataValue(
        'answers',
        val.map((a) => a.split(',').join(Answer.delimiter)),
      );
    },
  },
});

Answer.delimiter = ';pyro-del;';

export default Answer;
