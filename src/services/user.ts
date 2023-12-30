import { Op } from 'sequelize';
import User from '../models/user';
import Image from '../models/image';
import { IUserforSignUp, IUserInfo } from '../interfaces/user';

export const createUser =async (userInfo : IUserforSignUp): Promise<void> => {
  await User.create({
    email: userInfo.email,
    nickname: userInfo.nickname,
    password: userInfo.password,
    name : userInfo.name,
  });
};

export const getUserByUserInfo = async (userInfo: IUserInfo): Promise<User | null> => {
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
    ],
  });
  return user;
};