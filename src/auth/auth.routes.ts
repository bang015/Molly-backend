import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { Signin, IJwtRequest } from '../interfaces/auth';
import { signin, createUser, refreshTokens } from './auth.service';
import { checkJWT } from '../common/middleware/checkJwt';
import { SignupInput } from '../interfaces/user';
import { getUser } from '../user/user.service';
const authRouter = Router();

// 회원가입
authRouter.post(
  '/up',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      nickname: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } = await createUser(
        req.body as SignupInput,
      );
      return res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  },
);

// 로그인
authRouter.post(
  '/in',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } = await signin(req.body as Signin);
      return res.status(200).json({ accessToken, refreshToken });
    } catch (e) {
      next(e);
    }
  },
);

// 유저 정보
authRouter.get(
  '/',
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded?.id;
      const user = await getUser({ id: userId });
      return res.status(200).json(user);
    } catch (e) {
      return next(e);
    }
  },
);

// refreshToken
authRouter.post(
  '/token',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      console.log(refreshToken);
      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
      }
      return res.status(200).json(refreshTokens(refreshToken));
    } catch (e) {
      return next(e);
    }
  },
);

export default authRouter;
