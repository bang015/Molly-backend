import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import jwtKey from "../../config";
import { IJwtRequest, IJwtInfo } from "../../interfaces/auth";

const checkJWT = (req: IJwtRequest, res: Response, next: NextFunction) => {
  const token = <string>req.headers["x-access-token"];

  if (!token) {
    res.status(401).json({ error: "error401" });
  } else {
    const decoded: jwt.JwtPayload = jwt.verify(
      token,
      jwtKey.toString()
    ) as jwt.JwtPayload;
    const convertedDecoded: IJwtInfo = {
      id: decoded.id,
      email: decoded.email,
      // 이 외에 필요한 정보 추가
    };

    req.decoded = convertedDecoded;
  }
};
