import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../common/config';
import User from '../user/models/user.model';
import { Signin, SignupInput, Token } from './auth.interfaces';

// 유저 생성
export const createUser = async (payload: SignupInput): Promise<Token> => {
  try {
    const user = await User.create({ ...payload });
    return generateTokens({ userId: user.id });
  } catch (err) {
    throw new Error('회원가입에 실패했습니다.');
  }
};

// 로그인
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

// 토큰 생성
const generateTokens = (payload: { userId: number }) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

// 엑세스 토큰 생성
const generateAccessToken = (payload: { userId: number }): string => {
  const token = jwt.sign(payload, config.jwtAccessKey.toString(), {
    expiresIn: '10m',
    issuer: 'molly',
  });
  return token;
};

// 리프레쉬 토큰 생성
const generateRefreshToken = (payload: { userId: number }): string => {
  const token = jwt.sign(payload, config.jwtRefreshKey.toString(), {
    expiresIn: '7d',
    issuer: 'molly',
  });
  return token;
};

// 토큰 재발급
export const refreshTokens = (token: string) => {
  try {
    const payload = jwt.verify(token, config.jwtRefreshKey) as jwt.JwtPayload;
    return generateTokens({ userId: payload.userId });
  } catch (e: any) {
    throw new Error(e);
  }
};
