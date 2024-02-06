import { Router, Request, Response, NextFunction } from "express";
import { checkJWT } from "../middleware/checkJwt";
import { IJwtRequest } from "../../interfaces/auth";
import { Joi, Segments, celebrate } from "celebrate";
import { createComment, getComment } from "../../services/comment";

const commentRouter = Router();

commentRouter.post(
  '/',
  checkJWT,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      postId: Joi.number().required(),
      commentId: Joi.number(),
      content: Joi.string().required(),
    }),
  }),
  async(req: IJwtRequest, res: Response, next: NextFunction) => {
    try{
      const userId = req.decoded?.id;
      const {postId, commentId, content} = req.body;
      if(userId)
      await createComment(postId, commentId, userId, content)
    }catch(err){

    }
  }
)

commentRouter.get(
  '/:postId',
  async (req:Request, res: Response, next: NextFunction) => {
    const postId = parseInt(req.params.postId, 10);
    const {page} = req.query as any;
    const response = await getComment(postId, page);
    if(response){
      return res.status(200).json(response);
    }
  }
)
export default commentRouter;