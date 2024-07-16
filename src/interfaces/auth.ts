import { Request } from 'express';

export interface Token {
  accessToken: string;
  refreshToken: string;
}
export interface Signin {
  email: string;
  password: string;
}
export interface IJwtInfo {
  id?: number;
  email?: string;
  iat?: number;
  exp?: number;
  iss?: string;
  sub?: string;
}

export interface IJwtRequest extends Request {
  decoded?: IJwtInfo;
}
