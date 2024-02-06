import { Application } from "express";
import expressLoader from "./express";
import sequelizeLoader from "./sequelize";
import cloudinaryLoader from "./cloudinary";
import {defineRelationships} from "../models/associations";
export default async ({ expressApp }: { expressApp: Application }) => {
  await sequelizeLoader();

  defineRelationships();
  
  expressLoader({ app: expressApp });

  cloudinaryLoader();
};
