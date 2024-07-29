import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import { IJwtRequest, IJwtInfo } from '../../interfaces/auth';

export const checkJWT = (
  req: IJwtRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(400).json({ error: 'Token does not exist.' });
  }
  try {
    const decoded: jwt.JwtPayload = jwt.verify(
      token,
      config.jwtAccessKey.toString(),
    ) as jwt.JwtPayload;
    const convertedDecoded: IJwtInfo = { id: decoded.userId };
    req.decoded = convertedDecoded;
    next();
  } catch (e: any) {
    if (e.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired ' });
    }
    res.status(400).json({ error: 'Invalid token' });
  }
};