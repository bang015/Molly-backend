import { Router, Response, NextFunction } from 'express';

import {
  likePost,
  isPostLiked,
  getPostLikeCount,
  unlikePost,
} from './like.service';
import { IJwtRequest } from '../interfaces/auth';
import { checkJWT } from '../common/middleware/checkJwt';

const likeRouter = Router();

likeRouter.post(
  '/',
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded?.id;
      const { postId } = req.body;
      const checkLiked = await isPostLiked(postId, userId);
      if (checkLiked) {
        await unlikePost(postId, userId);
        return res.status(200).json(false);
      } else {
        await likePost(postId, userId);
        return res.status(200).json(true);
      }
    } catch (e) {
      return next(e);
    }
  },
);
export default likeRouter;

likeRouter.get(
  '/:postId',
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded?.id;
      const postId = parseInt(req.params.postId, 10);
      const count = await getPostLikeCount(postId);
      const checkLiked = await isPostLiked(postId, userId);
      return res.status(200).json({ count, checkLiked });
    } catch (e) {
      return next(e);
    }
  },
);
