import { Sequelize } from "sequelize-typescript";
import config from "./index";

const sequelize = new Sequelize({
  database: config.database.dbname as string,
  dialect: 'mysql',
  username: config.database.username as string,
  password: config.database.password as string,
  storage: ':memory:',
  models: [__dirname + '/../models'], // or [Player, Team],
});
// const sequelize = new Sequelize(
//   config.database.dbname as string,
//   config.database.username as string,
//   config.database.password as string,
//   {
//     host: config.database.host,
//     dialect: "mysql",
//     dialectOptions: {
//       timezone: "Asia/Seoul",
//     },
//     define: {
//       timestamps: true,
//     },
//   }
// );

export default sequelize;
