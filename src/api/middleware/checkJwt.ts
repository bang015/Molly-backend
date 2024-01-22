import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import jwtKey from "../../config";
import { IJwtRequest, IJwtInfo } from "../../interfaces/auth";

export const checkJWT = (req: IJwtRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "error401" });
  } else {
    const decoded: jwt.JwtPayload = jwt.verify(
      token,
      jwtKey.toString()
    ) as jwt.JwtPayload;
    const convertedDecoded: IJwtInfo = {
      id: decoded.id,
    };
    req.decoded = convertedDecoded;
    next();
  }
};
