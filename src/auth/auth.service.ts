import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';
import Image from '../models/profile-image';
import config from '../common/config';
import { Signin, Token } from '../interfaces/auth';
import { SignupInput } from '../interfaces/user';

export const createUser = async (payload: SignupInput): Promise<Token> => {
  try {
    const user = await User.create({ ...payload });
    return generateTokens({ userId: user.id });
  } catch (err) {
    throw new Error('회원가입에 실패했습니다.');
  }
};

export const signin = async (payload: Signin): Promise<Token> => {
  const user = await User.findOne({
    where: {
      email: payload.email,
    },
  });
  if (!user) {
    throw new Error('등록되지 않은 이메일입니다.');
  }
  const isPasswordMatch = bcrypt.compareSync(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new Error('비밀번호가 틀렸습니다.');
  }
  return generateTokens({ userId: user.id });
};

const generateTokens = (payload: { userId: number }) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

const generateAccessToken = (payload: { userId: number }): string => {
  console.log(payload);
  const token = jwt.sign(payload, config.jwtAccessKey.toString(), {
    expiresIn: '10m',
    issuer: 'molly',
  });
  return token;
};

const generateRefreshToken = (payload: { userId: number }): string => {
  const token = jwt.sign(payload, config.jwtRefreshKey.toString(), {
    expiresIn: '7d',
    issuer: 'molly',
  });
  return token;
};

export const refreshTokens = (token: string) => {
  try {
    const payload = jwt.verify(token, config.jwtRefreshKey) as jwt.JwtPayload;
    return generateTokens({ userId: payload.userId });
  } catch (e: any) {
    throw new Error(e);
  }
};
