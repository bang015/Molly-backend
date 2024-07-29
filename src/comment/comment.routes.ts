import { Router, Request, Response, NextFunction } from 'express';
import { Joi, Segments, celebrate } from 'celebrate';
import {
  verifyCommentUser,
  createComment,
  deleteComment,
  commentList,
  getMyCommentByPost,
  getSubComment,
  updateComment,
  getComment,
} from './comment.service';
import { IJwtRequest } from '../interfaces/auth';
import { checkJWT } from '../common/middleware/checkJwt';
import { getUser } from '../user/user.service';

const commentRouter = Router();

// 댓글 생성
commentRouter.post(
  '/',
  checkJWT,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      postId: Joi.number().required(),
      commentId: Joi.number().allow(null),
      content: Joi.string().required(),
    }),
  }),
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded?.id;
      const user = getUser({ id: userId });
      if (!user) {
        return res.status(404).json({ error: '권한이 없습니다.' });
      }
      const { postId, commentId, content } = req.body;
      const newComment = await createComment(
        postId,
        commentId,
        userId,
        content,
      );
      const post = await getComment(newComment.id);
      res.status(200).json(post);
    } catch (e) {
      return next(e);
    }
  },
);

// 게시물 댓글 목록
commentRouter.get(
  '/:postId',
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    const userId = req.decoded.id;
    const postId = parseInt(req.params.postId, 10);
    const { page } = req.query as any;
    const response = await commentList(postId, userId, page);
    if (response) {
      return res.status(200).json(response);
    }
  },
);

// 대댓글 목록
commentRouter.get(
  '/sub/:postId/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = parseInt(req.params.postId, 10);
    const id = parseInt(req.params.id, 10);
    const { page } = req.query as any;
    const response = await getSubComment(postId, id, page);
    if (response) {
      return res.status(200).json(response);
    }
  },
);

// 본인이 작성한 댓글
commentRouter.get(
  '/my/:postId',
  checkJWT,
  async (req: IJwtRequest, res: Response) => {
    const userId = req.decoded.id;
    const postId = parseInt(req.params.postId, 10);
    const comment = await getMyCommentByPost(userId, postId);
    console.log(comment);
    return res.status(200).json(comment);
  },
);

// 댓글 수정
commentRouter.patch(
  '/:id',
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded?.id;
      const id = parseInt(req.params.id, 10);
      const { content } = req.body;
      await verifyCommentUser(id, userId);
      const update = await updateComment(id, content);
      if (update > 0) {
        const response = await getComment(id);
        return res.status(200).json(response);
      }
    } catch (e) {
      return next(e);
    }
  },
);

// 댓글 삭제
commentRouter.delete(
  '/:id',
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded?.id;
      const id = parseInt(req.params.id, 10);
      await verifyCommentUser(id, userId);
      const delet = await deleteComment(id);
      if (delet > 0) {
        return res.status(200).json(id);
      }
    } catch (e) {
      return next(e);
    }
  },
);
export default commentRouter;
