import { Router, Request, Response, NextFunction } from "express";
import { checkJWT } from "../middleware/checkJwt";
import { IJwtRequest } from "../../interfaces/auth";
import { celebrate, Joi, Segments } from "celebrate";
import { addFollowing, selectFollowing, suggestFollowers, unfollow } from "../../services/follow";

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

followRouter.get(
  '/',
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try{
      const userId = req.decoded?.id;
      let followed = false;
      const followingUser = await selectFollowing(userId!);
      const followingUserIdList = followingUser.map(
        (follow) => follow.userId
      );
      if(followingUserIdList.length === 0){
        followed = true;
      }
      const suggestFollowerList = await suggestFollowers(
        userId!,
        followingUserIdList
      );

      return res.status(200).json({suggestFollowerList, followingUser, followed});
    }catch(err){

    }
  }
)
export default followRouter;