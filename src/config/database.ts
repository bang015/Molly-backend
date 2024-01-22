import { Sequelize } from "sequelize";
import config from "./index";

const sequelize = new Sequelize(
  config.database.dbname as string,
  config.database.username as string,
  config.database.password as string,
  {
    host: config.database.host,
    dialect: "mysql",
    dialectOptions: {
      timezone: "Asia/Seoul",
      connectTimeout: 1000,
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
      dateStrings: true,
      typeCast: true,
    },
    timezone: "+09:00",
    define: {
      timestamps: true,
    },
  }
);

export default sequelize;
