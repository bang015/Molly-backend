import { Router, Request, Response, NextFunction } from 'express';
import { addBookmark, isBookmarked, removeBookmark } from './bookmark.service';
import { checkJWT } from '../common/middleware/checkJwt';
import { getUser } from '../user/user.service';
import { JwtRequest } from '../auth/auth.interfaces';

const bookmarkRouter = Router();

// 북마크 생성 / 삭제
bookmarkRouter.post(
  '/',
  checkJWT,
  async (req: JwtRequest, res: Response, next: NextFunction) => {
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

// 현재 북마크 상태 확인
bookmarkRouter.get(
  '/:postId',
  checkJWT,
  async (req: JwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded?.id;
      const postId = parseInt(req.params.postId, 10);
      const bookmark = await isBookmarked(postId, userId);
      return res.status(200).json(bookmark);
    } catch (e) {
      return next(e);
    }
  },
);

export default bookmarkRouter;
