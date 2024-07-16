import { Router, Request, Response, NextFunction } from 'express';
import { checkJWT } from '../../common/middleware/checkJwt';
import { IJwtRequest } from '../../interfaces/auth';
import { celebrate, Joi, Segments } from 'celebrate';
import {
  addFollowing,
  checkFollowed,
  followCount,
  selectFollower,
  selectFollowing,
  suggestFollowers,
  unfollow,
} from '../../services/follow';

const followRouter = Router();

followRouter.post(
  '/',
  checkJWT,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      followUserId: Joi.number().required(),
    }),
  }),
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded?.id;
      const { followUserId } = req.body;
      let check = await checkFollowed(userId!, followUserId);
      if (check) {
        await unfollow(userId!, followUserId);
      } else {
        await addFollowing(userId!, followUserId);
      }
      const count = await followCount(userId!);
      check = await checkFollowed(userId!, followUserId);
      return res.status(200).json({ check, followUserId, count });
    } catch {}
  },
);

followRouter.get(
  '/',
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded?.id;
      let limit = parseInt(req.query.limit as string);
      let followed = false;
      const followingUser = await selectFollowing(userId!);
      if (followingUser.length === 0) {
        followed = true;
      }
      const followerUser = await selectFollower(userId!);
      const sugFollower = await Promise.all(
        followerUser.map(async (follow) => {
          const check = await checkFollowed(userId!, follow.id);
          if (!check) {
            const result = { ...follow, message: '회원님을 팔로우합니다' };
            return result;
          }
        }),
      );
      console.log(sugFollower.filter(Boolean));
      const filter = sugFollower.filter(Boolean).map((user) => {
        return user.id;
      });
      limit = limit - sugFollower.filter(Boolean).length;
      console.log(filter);
      const suggestList = await suggestFollowers(userId!, limit, filter);
      const suggestFollowerList = [
        ...sugFollower.filter(Boolean),
        ...suggestList,
      ];
      console.log(suggestFollowerList);
      return res.status(200).json({ suggestFollowerList, followed });
    } catch (err) {}
  },
);

followRouter.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { query } = req.query as any;
  const { page } = req.query as any;
  const result = await selectFollowing(id, query, page);
  return res.status(200).json(result);
});
followRouter.get('/r/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { query } = req.query as any;
  const { page } = req.query as any;
  const result = await selectFollower(id, query, page);
  return res.status(200).json(result);
});
followRouter.get(
  '/check/:followUserId',
  checkJWT,
  async (req: IJwtRequest, res: Response) => {
    const userId = req.decoded?.id;
    const followUserId = parseInt(req.params.followUserId, 10);
    const check = await checkFollowed(userId!, followUserId);
    return res.status(200).json(check);
  },
);
export default followRouter;
