import { Sequelize } from "sequelize";
import sequelize from "../config/database";
import User from "../models/user";
import Image from "../models/profile-image";
import Post from "../models/post";
import PostMedias from "../models/post-media";
import Tag from "../models/tag";
import PostTag from "../models/post-tag";
import Follow from "../models/follow";
import Comment from "../models/comment";
import Like from "../models/like";
import ChatRoom from "../models/chat-room";
import ChatUsers from "../models/chat-users";
import ChatMessage from "../models/chat-message";

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
    Follow,
    Comment,
    Like,
    ChatRoom,
    ChatUsers,
    ChatMessage,
  };

  const connection = await db.sequelize.sync();
  return connection;
};
