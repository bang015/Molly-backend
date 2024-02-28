import { Router, Request, Response, NextFunction } from "express";
import { checkJWT } from "../middleware/checkJwt";
import { IJwtRequest } from "../../interfaces/auth";
import { celebrate, Joi, Segments } from "celebrate";
import { addFollowing, checkFollowed, selectFollowing, suggestFollowers, unfollow } from "../../services/follow";

const followRouter = Router();

followRouter.post(
  '/',
  checkJWT,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      followUserId: Joi.number().required(),
    }),
  }),
  async (req:IJwtRequest, res: Response, next: NextFunction) => {
    try{
      const userId = req.decoded?.id;
      const {followUserId} = req.body;
      let check = await checkFollowed(userId!, followUserId);
      if(check){
        await unfollow(userId!, followUserId);
      }else{
        await addFollowing(userId!, followUserId);
      }
      check = await checkFollowed(userId!, followUserId);
      return res.status(200).json({check, followUserId});
    }catch{

    }
  }
)

followRouter.get(
  '/',
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try{
      const userId = req.decoded?.id;
      const limit = parseInt(req.query.limit as string);
      let followed = false;
      const followingUser = await selectFollowing(userId!);
      if(followingUser.length === 0){
        followed = true;
      }
      const suggestFollowerList = await suggestFollowers(
        userId!,
        limit
      );

      return res.status(200).json({suggestFollowerList, followed});
    }catch(err){

    }
  }
);

followRouter.get(
  '/:id',
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const {page} = req.query as any;
    const result = await selectFollowing(id, page);
    return res.status(200).json(result);
  }
);

followRouter.get(
  "/check/:followUserId",
  checkJWT,
  async(req: IJwtRequest, res: Response) => {
    const userId = req.decoded?.id;
    const followUserId = parseInt(req.params.followUserId, 10);
    const check = await checkFollowed(userId!, followUserId);
    return res.status(200).json(check);
  }
)
export default followRouter;