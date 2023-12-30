import { Router, Request, Response, NextFunction } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { IUserforSignUp, IUserInfo } from "../../interfaces/user";
import { createUser, getUserByUserInfo } from "../../services/user";
const userRouter = Router();

userRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      nickname: Joi.string().required(),
      name: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, nickname, name, password } = req.body;
    try {
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

export default userRouter;
