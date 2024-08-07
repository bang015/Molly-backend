import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { signin, createUser, refreshTokens } from './auth.service';
import { checkJWT } from '../common/middleware/checkJwt';
import { getUser,  } from '../user/user.service';
import { JwtRequest, Signin, SignupInput } from './auth.interfaces';
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
    } catch (e) {
      next(e);
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
  async (req: JwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded?.id;
      const user = await getUser({ id: userId });
      if (!user) {
        return res.status(404).end();
      }
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
