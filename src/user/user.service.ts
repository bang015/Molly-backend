import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { v2 as cloudinary } from 'cloudinary';
import User from './models/user.model';
import Post from '../post/models/post.model';
import Follow from '../follow/models/follow.model';
import ProfileImage from './models/profile-image.model';
import {
  GetUserInput,
  ProfileImageDetail,
  UserModify,
} from './user.interfaces';

// 모든 유저 목록
export const getAllUsers = async (): Promise<User[] | null> => {
  const allUser = await User.findAll({
    include: [
      {
        model: ProfileImage,
        attributes: ['id', 'path'],
      },
    ],
  });
  return allUser;
};

// 유저 정보
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
        model: ProfileImage,
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

// 유저 정보 수정
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

// 유저 프로필 이미지 생성
export const createprofileImage = async (
  imageInfo: ProfileImageDetail,
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

// 유저 프로필 이미지 삭제
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
