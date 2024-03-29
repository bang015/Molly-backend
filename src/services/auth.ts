import { Op } from "sequelize";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user";
import Image from "../models/profile-image";
import jwtKey from "../config";
import { IAuthUser } from "../interfaces/auth";

export const authenticate = async (
  authInfo: IAuthUser
): Promise<User | null> => {
  const user = await User.findOne({
    where: {
      email: authInfo.email,
    },
  });
  if (!user) {
    return null;
  }
  const isPasswordMatch = bcrypt.compareSync(authInfo.password, user.password);
  if (!isPasswordMatch) {
    return null;
  }

  return user;
};

export const authorize = (user: User): string => {
  const token = jwt.sign(
    { id: user.id, email: user.email, nick: user.nickname },
    jwtKey.toString(),
    {
      expiresIn: "7d",
      issuer: "bletcher",
      subject: "userInfo",
    }
  );
  return token;
};

export const getUserById = async (id?: number): Promise<User | null> => {
  if (id) {
    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Image,
          attributes: ["id", "path"],
        },
      ],
    });
    return user;
  }
  return null;
};
