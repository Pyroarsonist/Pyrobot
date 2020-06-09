import Sequelize from 'sequelize';
import { databaseUrl } from '../config';

const sequelize = new Sequelize(databaseUrl, {
  logging: false,
  dialect: 'postgres',
  define: {
    freezeTableName: true,
  },
});

export default sequelize;
