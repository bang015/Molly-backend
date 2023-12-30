import { Sequelize } from "sequelize";
import sequelize from "../config/database";
import User from "../models/user";
import Image from "../models/image";

export default async (): Promise<Sequelize> => {
  const db = {
    sequelize,
    Sequelize,
    User,
    Image,
  };

  const connection = await db.sequelize.sync();
  return connection;
};
