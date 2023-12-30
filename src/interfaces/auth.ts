import { Request } from "express";

export interface IAuthUser {
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
