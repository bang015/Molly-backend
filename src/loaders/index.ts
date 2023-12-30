import { Application } from "express";
import expressLoader from "./express";
import sequelizeLoader from "./sequelize";

export default async ({ expressApp }: { expressApp: Application }) => {
  await sequelizeLoader();

  expressLoader({ app: expressApp });
};
