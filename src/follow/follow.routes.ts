import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import {
  follow,
  isFollowing,
  selectFollower,
  selectFollowing,
  suggestFollowers,
  unfollow,
} from './follow.service';
import { checkJWT } from '../common/middleware/checkJwt';
import { JwtRequest } from '../auth/auth.interfaces';

const followRouter = Router();

// 팔로우
followRouter.post(
  '/',
  checkJWT,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      followUserId: Joi.number().required(),
    }),
  }),
  async (req: JwtRequest, res: Response, next: NextFunction) => {
    try {
      const payload = {
        userId: req.decoded.id,
        targetId: Number(req.body.followUserId),
      };
      let isFollowingUser = await isFollowing(payload);
      if (isFollowingUser) {
        await unfollow(payload);
        return res.status(200).json(true);
      } else {
        await follow(payload);
        return res.status(200).json(false);
      }
    } catch (e) {
      return next(e);
    }
  },
);

// 추천 팔로우 목록
followRouter.get(
  '/',
  checkJWT,
  async (req: JwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded?.id;
      let limit = parseInt(req.query.limit as string);
      const suggestList = await suggestFollowers(userId!, limit);
      return res.status(200).json({ suggestFollowerList: suggestList });
    } catch (e) {
      return next(e);
    }
  },
);

// 팔로윙 목록
followRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { query } = req.query as any;
      const { page } = req.query as any;
      const result = await selectFollowing(id, query, page);
      return res.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  },
);

// 팔로워 목록
followRouter.get(
  '/r/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { query } = req.query as any;
      const { page } = req.query as any;
      const result = await selectFollower(id, query, page);
      return res.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  },
);

// 팔로우 상태
followRouter.get(
  '/check/:followUserId',
  checkJWT,
  async (req: JwtRequest, res: Response, next: NextFunction) => {
    try {
      const payload = {
        userId: req.decoded.id,
        targetId: parseInt(req.params.followUserId, 10),
      };
      const check = await isFollowing(payload);
      return res.status(200).json(check);
    } catch (e) {
      return next(e);
    }
  },
);
export default followRouter;
