import { Op } from 'sequelize';
import User from '../models/user';
import Image from '../models/profile-image';
import { GetUserInput, UserModify } from '../interfaces/user';
import Post from '../models/post';
import { Sequelize } from 'sequelize-typescript';
import Follow from '../models/follow';
import { IImageDetail } from '../interfaces/image';
import ProfileImage from '../models/profile-image';
import { v2 as cloudinary } from 'cloudinary';

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
  const user = await User.findOne({
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
        [
          Sequelize.fn('COUNT', Sequelize.col('following.id')),
          'followingCount',
        ],
      ],
    },
    group: ['User.id'],
  });
  if (!user) {
    return null;
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
  } catch (e) {
    console.log('modify:' + e);
    return null;
  }
};

export const createprofileImage = async (
  imageInfo: IImageDetail,
): Promise<ProfileImage | null> => {
  try {
    const result = await ProfileImage.create({
      name: imageInfo.name,
      type: imageInfo.type,
      path: imageInfo.path,
    });
    console.log(result.get().id);
    return result.get();
  } catch (e) {
    console.log(e);
    throw Error('프로필 수정을 실패했습니다.');
  }
};
export const deleteProfileImage = async (profileimgId: number) => {
  const profileImage = await ProfileImage.findByPk(profileimgId);
  const id = profileImage?.dataValues.name;
  cloudinary.uploader.destroy(id, function (result: any) {});
  await ProfileImage.destroy({
    where: {
      id: profileimgId,
    },
  });
};
