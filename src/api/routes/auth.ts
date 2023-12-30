import { Router, Request, Response, NextFunction } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { IAuthUser, IJwtRequest } from '../../interfaces/auth';
import { authenticate, authorize } from '../../services/auth'
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
  if(!user){
    return res.status(401).json({status : false});
  }
  const token = await authorize(user);
  return res.status(200).json({user, token, status:true});
}
);

export default authRouter;
