import { Op } from 'sequelize';
import User from '../models/user';
import Image from '../models/profile-image';
import { GetUserInput, UserModify } from '../interfaces/user';
import Post from '../models/post';
import { Sequelize } from 'sequelize-typescript';
import Follow from '../models/follow';

export const getAllUsers = async (): Promise<User[] | null> => {
  const allUser = await User.findAll({
    include: [
      {
        model: Image,
        attributes: ['id', 'path'],
      },
    ],
  });
  return allUser;
};
export const getUser = async (userInfo: GetUserInput): Promise<User | null> => {
  const user =  await User.findOne({
    where: {
      [Op.or]: [
        { id: userInfo.id || null },
        { email: userInfo.email || null },
        { nickname: userInfo.nickname || null },
      ],
    },
    include: [
      {
        model: Image,
        attributes: ['id', 'path'],
      },
      {
        model: Post,
        as: 'posts',
        attributes: [],
      },
      {
        model: Follow,
        as: 'followers',
        attributes: [],
      },
      {
        model: Follow,
        as: 'following',
        attributes: [],
      },
    ],
    subQuery: false,
    attributes: {
      exclude: ['password'],
      include: [
        [Sequelize.fn('COUNT', Sequelize.col('posts.id')), 'postCount'],
        [Sequelize.fn('COUNT', Sequelize.col('followers.id')), 'followerCount'],
        [Sequelize.fn('COUNT', Sequelize.col('following.id')), 'followingCount'],
      ],
    },
    group: ["User.id"],
  });
  if(!user){
    return null
  }
  return user.get();
};

export const modifyUser = async (
  userInfo: UserModify,
): Promise<User | null> => {
  const existUser: User | null = await User.findByPk(userInfo.id);
  if (!existUser) {
    return null;
  }
  const updateFields: Partial<UserModify> = {};
  if (userInfo.name) {
    updateFields.name = userInfo.name;
  }
  if (userInfo.nickname) {
    updateFields.nickname = userInfo.nickname;
  }
  if (userInfo.introduce) {
    updateFields.introduce = userInfo.introduce;
  }
  if (userInfo.profileImageId) {
    updateFields.profileImageId = userInfo.profileImageId;
  }
  try {
    const user = await existUser.update(updateFields);
    return user.get();
  } catch (err) {
    return null;
  }
};
