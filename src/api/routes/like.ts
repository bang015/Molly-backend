import { Router, Request, Response, NextFunction } from 'express';
import { checkJWT } from '../../common/middleware/checkJwt';
import { IJwtRequest } from '../../interfaces/auth';
import {
  addLikePost,
  checkLikedPost,
  postLikeCount,
  unLikePost,
} from '../../services/like';

const likeRouter = Router();

likeRouter.post('/', checkJWT, async (req: IJwtRequest, res: Response) => {
  const userId = req.decoded?.id;
  if (userId) {
    const { postId } = req.body;
    const checkLiked = await checkLikedPost(postId, userId);
    if (checkLiked) {
      await unLikePost(postId, userId);
    } else {
      await addLikePost(postId, userId);
    }
    const result = await checkLikedPost(postId, userId);
    return res.status(200).json(result);
  }
});
export default likeRouter;

likeRouter.get(
  '/:postId',
  checkJWT,
  async (req: IJwtRequest, res: Response) => {
    const userId = req.decoded?.id;
    if (userId) {
      const postId = parseInt(req.params.postId, 10);
      const count = await postLikeCount(postId);
      const checkLiked = await checkLikedPost(postId, userId);
      return res.status(200).json({ count, checkLiked });
    }
  },
);
