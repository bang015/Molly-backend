import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../common/config';
import User from '../user/models/user.model';
import { Signin, SignupInput, Token } from './auth.interfaces';
import Verification from './models/verification.model';
import sequelize from '../common/config/database';
const { v4: uuidv4 } = require('uuid');
// 인증번호 생성
export const createVerificationCode = async (email: string) => {
  const verificationCode = uuidv4().substring(0, 6);
  const transaction = await sequelize.transaction();
  try {
    await Verification.destroy({ where: { email }, transaction });
    const verification = await Verification.create(
      {
        email,
        code: verificationCode,
        expiresAt: Date.now() + 10 * 60 * 1000,
      },
      { transaction },
    );
    await transaction.commit();
    return verification.get('code');
  } catch (e) {
    await transaction.rollback();
    throw Error('인증번호 생성에 실패했습니다.');
  }
};
// 유저 생성
export const createUser = async (payload: SignupInput): Promise<Token> => {
  await verificationCode(payload.email, payload.code);
  const transaction = await sequelize.transaction();
  try {
    const user = await User.create({ ...payload }, { transaction });
    await Verification.destroy({
      where: { email: payload.email },
      transaction,
    });
    await transaction.commit();
    return generateTokens({ userId: user.id });
  } catch (e) {
    await transaction.rollback();
    throw new Error('회원가입에 실패했습니다.');
  }
};

// 인증번호 확인
export const verificationCode = async (email: string, code: string) => {
  const verification = await Verification.findOne({
    where: { email },
  });
  if (!verification) {
    throw new Error(
      '등록된 인증번호가 없습니다. 이메일을 확인하고 인증번호를 요청해 주세요.',
    );
  }
  const currentTime = Date.now();
  const codeExpiration = verification.get('expiresAt').getTime();
  if (currentTime > codeExpiration) {
    throw new Error(
      '인증번호의 유효기간이 만료되었습니다. 새로운 인증번호를 요청해 주세요.',
    );
  }
  if (verification.get('code') !== code) {
    throw new Error('입력한 인증번호가 올바르지 않습니다. 다시 시도해 주세요.');
  }
};

// 로그인
export const signin = async (payload: Signin): Promise<Token> => {
  const user = await User.findOne({
    where: {
      email: payload.email,
    },
  });
  if (!user || !bcrypt.compareSync(payload.password, user.password)) {
    throw new Error('이메일 또는 비밀번호가 틀렸습니다.');
  }
  return generateTokens({ userId: user.id });
};

// 비밀번호 재설정
export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string,
) => {
  await verificationCode(email, code);
  const transaction = await sequelize.transaction();
  try {
    const password = await bcrypt.hash(newPassword, 10);
    const [result] = await User.update(
      { password: password },
      { where: { email }, transaction },
    );
    await Verification.destroy({
      where: { email },
      transaction,
    });
    await transaction.commit();
    return result;
  } catch (e) {
    await transaction.rollback();
    throw new Error('비밀번호 재설정을 실패했습니다.');
  }
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
