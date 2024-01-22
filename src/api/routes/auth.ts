import { Router, Request, Response, NextFunction } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { IAuthUser, IJwtRequest } from "../../interfaces/auth";
import { authenticate, authorize, getUserById } from "../../services/auth";
import { checkJWT } from "../middleware/checkJwt";
const authRouter = Router();

authRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await authenticate(req.body as IAuthUser);
    if (!user) {
      return res.status(401).json({ status: false });
    }
    const token = authorize(user);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ token, status: true });
  }
);

authRouter.get(
  "/",
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const user = await getUserById(req.decoded?.id);
      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  }
);

export default authRouter;
