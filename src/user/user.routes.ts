import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { GetUserInput } from '../interfaces/user';
import { getUser, getAllUsers, modifyUser } from './user.service';
import { checkJWT } from '../common/middleware/checkJwt';
import { IJwtRequest } from '../interfaces/auth';
import { uploadProfileImage } from '../common/middleware/multer';
import { deleteProfileImage, createprofileImage } from '../services/image';

const userRouter = Router();

userRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.number().integer(),
      email: Joi.string().email(),
      nickname: Joi.string(),
    },
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, email, nickname } = req.query;
    try {
      if (!id && !email && !nickname) {
        const allUser = await getAllUsers();
        return res.status(200).json(allUser);
      }
      const user = await getUser(req.query as GetUserInput);
      if (!user) {
        return res.status(204).end();
      }
      return res.status(200).json(user);
    } catch (e) {
      return next(e);
    }
  },
);

userRouter.patch(
  '/',
  checkJWT,
  uploadProfileImage,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      nickname: Joi.string(),
      password: Joi.string(),
      name: Joi.string(),
      introduce: Joi.string().allow('', null),
    }),
  }),
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded.id;
      let modifyDetail = { id: userId, ...req.body };
      let message = '';
      const user = await getUser({ id: modifyDetail.id });
      if (!user) {
        return res.status(204).end();
      }
      if (req.file) {
        const imageDetail = {
          name: req.file.filename,
          type: req.file.mimetype,
          path: req.file.path,
        };
        if (user.profileImageId) {
          await deleteProfileImage(user.profileImageId);
        }
        const newImage = await createprofileImage(imageDetail);
        modifyDetail = { ...modifyDetail, profileImageId: newImage?.id };
      }

      const updatedUser = await modifyUser(modifyDetail);
      message = '프로필이 수정되었습니다.';
      console.log(updatedUser);
      if (updatedUser) {
        const result = await getUser({ id: updatedUser.id });
        return res.status(200).json({ result, message });
      }
    } catch (e) {
      console.log(e);
      return next(e);
    }
  },
);
export default userRouter;
