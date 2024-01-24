import { Router, Request, Response, NextFunction } from "express";
import { checkJWT } from "../middleware/checkJwt";
import { IJwtRequest } from "../../interfaces/auth";
import { celebrate, Joi, Segments } from "celebrate";

const followRouter = Router();

export default followRouter;