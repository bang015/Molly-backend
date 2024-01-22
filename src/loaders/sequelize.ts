import { Sequelize } from "sequelize";
import sequelize from "../config/database";
import User from "../models/user";
import Image from "../models/profile-image";
import Post from "../models/post";
import PostMedias from "../models/post-media";
import Tag from "../models/tag";
import PostTag from "../models/post-tag";
export default async (): Promise<Sequelize> => {
  const db = {
    sequelize,
    Sequelize,
    User,
    Image,
    Post,
    PostMedias,
    Tag,
    PostTag,
  };

  const connection = await db.sequelize.sync();
  return connection;
};
