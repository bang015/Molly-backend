import { Router, Request, Response, NextFunction, response } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { IUserforSignUp, IUserInfo } from "../../interfaces/user";
import {
  createUser,
  getUserByUserInfo,
  getAllUser,
  modifyUser,
} from "../../services/user";
import { checkJWT } from "../middleware/checkJwt";
import { IJwtRequest } from "../../interfaces/auth";
import { uploadProfile } from "../middleware/multer";
import { deleteProfileImage, profileImage } from "../../services/image";
import { postCount } from "../../services/post";
import { followCount, followerCount } from "../../services/follow";
const userRouter = Router();

userRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      nickname: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const { email, nickname } = req.body;
    try {
      console.log(req.body);
      const existUser = await getUserByUserInfo({ email, nickname });
      if (existUser) {
        return res.status(409).json({ error: "User already exists" });
      }
      await createUser(req.body as IUserforSignUp);
      return res.status(200).json({ message: "user crearted success" });
    } catch (err) {
      return next(err);
    }
  }
);

userRouter.get(
  "/:nickname",
  async (req: Request, res: Response, next: NextFunction) => {
    const nickname = req.params.nickname;
    try {
      const user = await getUserByUserInfo({nickname});
      if (user) {
        const { password, ...userInfo} = user.dataValues;
        const postCnt = await postCount(user.dataValues.id);
        const followCnt = await followCount(user.dataValues.id);
        const followerCnt = await followerCount(user.dataValues.id);
        userInfo.postCount = postCnt;
        userInfo.followCount = followCnt;
        userInfo.followerCount = followerCnt;

        return res.status(200).json(userInfo);
      }
    } catch (err) {
      return next(err);
    }
  }
);

userRouter.patch(
  "/",
  checkJWT,
  uploadProfile,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      nickname: Joi.string(),
      password: Joi.string(),
      name: Joi.string(),
      introduce: Joi.string().allow("", null),
    }),
  }),
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    const userId: number = req.decoded?.id!;
    let modifyDetail = { id: userId, ...req.body };
    const exisUser = await getUserByUserInfo({ id: modifyDetail.id });
    try {
      if (exisUser) {
        if (req.file) {
          const imageDetail = {
            name: req.file.filename,
            type: req.file.mimetype,
            path: req.file.path,
          };
          console.log(exisUser.dataValues.profile_image);
          const profileimageId = exisUser.dataValues.profile_image;
          if(profileimageId){
            await deleteProfileImage(profileimageId)
          }
          const newImage = await profileImage(imageDetail);
          modifyDetail = { ...modifyDetail, profile_image: newImage?.id };
          const user = await modifyUser(modifyDetail);
          if (user) {
            return res.status(200).json({user, message: "프로필 사진이 수정되었습니다."});
          }
        }
      }
    } catch (e) {
      return next(e);
    }
  }
);
export default userRouter;
