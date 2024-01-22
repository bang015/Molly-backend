import { Application } from "express";
import expressLoader from "./express";
import sequelizeLoader from "./sequelize";
import cloudinaryLoader from "./cloudinary";
export default async ({ expressApp }: { expressApp: Application }) => {
  await sequelizeLoader();

  expressLoader({ app: expressApp });

  cloudinaryLoader();
};
