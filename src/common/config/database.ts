import { Sequelize } from 'sequelize-typescript';
import config from './index';

const sequelize = new Sequelize({
  database: config.database.dbname as string,
  dialect: 'mysql',
  username: config.database.username as string,
  password: config.database.password as string,
  models: [
    __dirname + '/../../**/*.model.ts',
    __dirname + '/../../**/*.model.js',
  ],
  host: config.database.host as string,
  port: 3306,
});

export default sequelize;
