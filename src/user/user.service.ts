import { literal, Op } from 'sequelize';
import { v2 as cloudinary } from 'cloudinary';
import User from './models/user.model';
import ProfileImage from './models/profile-image.model';
import bcrypt from 'bcrypt';
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
    ],
    attributes: {
      exclude: ['password'],
      include: [
        [
          literal(`(
          SELECT COUNT(*)
          FROM \`Post\`
          WHERE \`Post\`.\`userId\` = \`User\`.\`id\`
        )`),
          'postCount',
        ],
        [
          literal(`(
          SELECT COUNT(DISTINCT \`followers\`.\`id\`)
          FROM \`Follow\` AS \`followers\`
          WHERE \`followers\`.\`followingId\` = \`User\`.\`id\`
        )`),
          'followerCount',
        ],
        [
          literal(`(
          SELECT COUNT(DISTINCT \`following\`.\`id\`)
          FROM \`Follow\` AS \`following\`
          WHERE \`following\`.\`followerId\` = \`User\`.\`id\`
        )`),
          'followingCount',
        ],
      ],
    },
  });
  if (!user) {
    return null;
  }
  return user;
};

// 유저 정보 수정
export const modifyUser = async (
  userInfo: UserModify,
): Promise<User | null> => {
  const existUser: User | null = await User.findByPk(userInfo.id);
  if (!existUser) {
    return null;
  }
  const newPassword = userInfo.newPassword;
  const currentPassword = userInfo.currentPassword;
  if (newPassword && currentPassword) {
    if (!bcrypt.compareSync(currentPassword, existUser.get('password'))) {
      throw Error(
        '현재 비밀번호가 올바르지 않습니다. 확인 후 다시 입력해 주세요.',
      );
    }
    const password = await bcrypt.hash(newPassword, 10);
    existUser.update({ password: password });
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
    throw new Error('유저 정보 수정에 실패했습니다.');
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
    return result.get();
  } catch (e) {
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
