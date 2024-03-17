import { Op } from "sequelize";
import User from "../models/user";
import Image from "../models/profile-image";
import { IUserforSignUp, IUserInfo, IUserModify } from "../interfaces/user";

export const createUser = async (userInfo: IUserforSignUp): Promise<void> => {
  await User.create({
    email: userInfo.email,
    nickname: userInfo.nickname,
    password: userInfo.password,
    name: userInfo.name,
  });
};

export const getAllUser = async (): Promise<User[] | null> => {
  const allUser = await User.findAll({
    include: [
      {
        model: Image,
        attributes: ["id", "path"],
      },
    ],
  });
  return allUser;
};
export const getUserByUserInfo = async (
  userInfo: IUserInfo
): Promise<User | null> => {
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
        attributes: ["id", "path"],
      },
    ],
  });
  return user;
};

export const modifyUser = async (
  userInfo: IUserModify
): Promise<User | null> => {
  const existUser: User | null = await User.findByPk(userInfo.id);
  if (!existUser) {
    return null;
  }
  const updateFields: Partial<IUserModify> = {};
  if (userInfo.name) {
    updateFields.name = userInfo.name;
  }
  if (userInfo.nickname) {
    updateFields.nickname = userInfo.nickname;
  }
  if (userInfo.introduce) {
    updateFields.introduce = userInfo.introduce;
  }
  if (userInfo.profile_image) {
    updateFields.profile_image = userInfo.profile_image;
  }
  try {
    const user = await existUser.update(updateFields);
    delete user.dataValues.password;
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};
