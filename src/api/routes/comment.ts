import { Router, Request, Response, NextFunction } from 'express';
import { checkJWT } from '../../common/middleware/checkJwt';
import { IJwtRequest } from '../../interfaces/auth';
import { Joi, Segments, celebrate } from 'celebrate';
import {
  checkCommentUser,
  createComment,
  deleteComment,
  getComment,
  getCommentById,
  getMyCommentByPost,
  getSubComment,
  updateComment,
} from '../../services/comment';

const commentRouter = Router();
// post comment
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
    const userId = req.decoded?.id;
    const { postId, commentId, content } = req.body;
    const newComment = await createComment(postId, commentId, userId!, content);
    res.status(200).json(newComment);
  },
);
//get comment
commentRouter.get(
  '/:userId/:postId',
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId, 10);
    const postId = parseInt(req.params.postId, 10);
    const { page } = req.query as any;

    const response = await getComment(postId, userId, page);
    if (response) {
      return res.status(200).json(response);
    }
  },
);
//get subComment
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
//get myCommentbyPost
commentRouter.get(
  '/my/:userId/:postId',
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const postId = parseInt(req.params.postId, 10);
    const response = await getMyCommentByPost(userId, postId);
    return res.status(200).json(response);
  },
);
// edit comment
commentRouter.patch(
  '/:id',
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    const userId = req.decoded?.id;
    const id = parseInt(req.params.id, 10);
    const { content } = req.body;
    if (userId) {
      const checkUserId = await checkCommentUser(id, userId);
      if (checkUserId) {
        const update = await updateComment(id, content);
        if (update > 0) {
          const response = await getCommentById(id);
          return res.status(200).json(response);
        }
      }
    }
  },
);
// delete comment
commentRouter.delete(
  '/:id',
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    const userId = req.decoded?.id;
    const id = parseInt(req.params.id, 10);
    if (userId) {
      const checkUserId = await checkCommentUser(id, userId);
      if (checkUserId) {
        const delet = await deleteComment(id);
        if (delet > 0) {
          return res.status(200).json(id);
        }
      }
    }
    return res.status(401).json(null);
  },
);
export default commentRouter;
