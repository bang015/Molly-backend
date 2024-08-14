import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import {
  signin,
  createUser,
  refreshTokens,
  createVerificationCode,
  resetPassword,
} from './auth.service';
import { checkJWT } from '../common/middleware/checkJwt';
import { getUser } from '../user/user.service';
import { JwtRequest, Signin, SignupInput } from './auth.interfaces';
import {
  sendPasswordResetLink,
  sendVerificationCode,
} from '../common/service/email';
const authRouter = Router();

// 이메일 인증번호 생성 및 이메일 보내기
authRouter.post(
  '/code',
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    try {
      const code = await createVerificationCode(email);
      await sendVerificationCode(email, code);
      return res.status(200).end();
    } catch (e) {
      console.log(e);
      return next(e);
    }
  },
);

// 비밀번호 재설정 링크 보내기
authRouter.post(
  '/link',
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    try {
      const user = await getUser({ email });
      if (!user) {
        return res
          .status(404)
          .json({ error: '해당 이메일로 등록된 계정이 없습니다.' });
      }
      const code = await createVerificationCode(email);
      await sendPasswordResetLink(email, code);
      return res.status(200).end();
    } catch (e) {
      console.log(e);
      return next(e);
    }
  },
);

// 비밀번호 재설정
authRouter.post(
  '/reset/password',
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, code, newPassword } = req.body;
    console.log(email, code, newPassword);
    try {
      const user = await getUser({ email });
      if (!user) {
        return res
          .status(404)
          .json({ error: '해당 이메일로 등록된 계정이 없습니다.' });
      }
      const result = await resetPassword(email, code, newPassword);
      if (result === 0) {
        return res
          .status(404)
          .json({ error: '비밀번호 재설정을 실패했습니다.' });
      }
      return res
        .status(200)
        .json({ message: '비밀번호 재설정을 성공했습니다.' });
    } catch (e) {
      return next(e);
    }
  },
);

// 회원가입
authRouter.post(
  '/up',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      nickname: Joi.string().required(),
      password: Joi.string().required(),
      code: Joi.string().required(),
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
