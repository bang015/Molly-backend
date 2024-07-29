import { Router, Request, Response, NextFunction } from 'express';
import { addBookmark, isBookmarked, removeBookmark } from './bookmark.service';
import { checkJWT } from '../common/middleware/checkJwt';
import { IJwtRequest } from '../interfaces/auth';
import { getUser } from '../user/user.service';

const bookmarkRouter = Router();

bookmarkRouter.post(
  '/',
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    const userId = req.decoded?.id;
    const { postId } = req.body;
    try {
      const user = await getUser({ id: userId });
      if (!user) {
        return res.status(404).json({ error: '권한이 없습니다.' });
      }
      const bookmark = await isBookmarked(postId, userId);
      if (bookmark) {
        await removeBookmark(postId, userId);
      } else {
        await addBookmark(postId, userId);
      }
      const result = await isBookmarked(postId, userId);
      return res.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  },
);
bookmarkRouter.get(
  '/:postId',
  checkJWT,
  async (req: IJwtRequest, res: Response) => {
    const userId = req.decoded?.id;
    const postId = parseInt(req.params.postId, 10);
    const bookmark = await isBookmarked(postId, userId);
    return res.status(200).json(bookmark);
  },
);

export default bookmarkRouter;
