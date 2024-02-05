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
    },
    define: {
      timestamps: true,
    },
  }
);

export default sequelize;
