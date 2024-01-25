import { Router, Request, Response, NextFunction } from "express";
import { checkJWT } from "../middleware/checkJwt";
import { IJwtRequest } from "../../interfaces/auth";
import { celebrate, Joi, Segments } from "celebrate";
import { addFollowing, selectFollowing, unfollow } from "../../services/follow";

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
      let followedUserList = await selectFollowing(userId!);
      const followedChekc = followedUserList.some((user) => user.userId === followUserId);
      if(followedChekc){
        await unfollow(userId!, followUserId);
        followedUserList = await selectFollowing(userId!);
      }else{
        await addFollowing(userId!, followUserId);
        followedUserList = await selectFollowing(userId!);
      }
      return res.status(200).json(followedUserList);
    }catch{

    }
  }
)
export default followRouter;