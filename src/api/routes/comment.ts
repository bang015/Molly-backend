import { Router, Request, Response, NextFunction } from "express";
import { checkJWT } from "../middleware/checkJwt";
import { IJwtRequest } from "../../interfaces/auth";
import { Joi, Segments, celebrate } from "celebrate";
import { createComment, getComment, getSubComment } from "../../services/comment";

const commentRouter = Router();

commentRouter.post(
  "/",
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
  }
);

commentRouter.get(
  "/:postId",
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = parseInt(req.params.postId, 10);
    const { page } = req.query as any;
    const response = await getComment(postId, page);
    if (response) {
      return res.status(200).json(response);
    }
  }
);

commentRouter.get(
  "/:postId/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = parseInt(req.params.postId, 10);
    const id = parseInt(req.params.id, 10);
    const {page} = req.query as any;
    const response = await getSubComment(postId, id, page);
    if(response) {
      return res.status(200).json(response);
    }
  }
)
export default commentRouter;
