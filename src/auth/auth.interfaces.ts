import { Request } from 'express';

export interface SignupInput {
  email: string;
  nickname: string;
  password: string;
  name: string;
  code: string;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface Signin {
  email: string;
  password: string;
}

export interface JwtInfo {
  id?: number;
  email?: string;
  iat?: number;
  exp?: number;
  iss?: string;
  sub?: string;
}

export interface JwtRequest extends Request {
  decoded?: JwtInfo;
}
