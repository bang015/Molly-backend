import { Sequelize } from 'sequelize-typescript';
import config from './index';

const sequelize = new Sequelize({
  database: config.database.dbname as string,
  dialect: 'mysql',
  username: config.database.username as string,
  password: config.database.password as string,
  storage: ':memory:',
  models: [__dirname + '/../../**/*.model.ts'],
});

export default sequelize;
