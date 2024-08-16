import { Application } from 'express';
import expressLoader from './express';
import cloudinaryLoader from './cloudinary';
import sequelize from '../config/database';
export default async ({ expressApp }: { expressApp: Application }) => {
  await sequelize.sync();

  expressLoader({ app: expressApp });

  cloudinaryLoader();
};
