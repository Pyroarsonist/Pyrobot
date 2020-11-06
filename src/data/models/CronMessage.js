import Sequelize from 'sequelize';
import Model from '../sequelize';

const CronMessage = Model.define('CronMessage', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  message: {
    type: Sequelize.STRING(4096),
    allowNull: false,
  },
  cron: {
    type: Sequelize.STRING(64),
    allowNull: false,
  },
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

export default CronMessage;
