import { Router, Response, NextFunction } from 'express';
import { checkJWT } from '../common/middleware/checkJwt';
import { JwtRequest } from '../auth/auth.interfaces';
import {
  allUnreadMessageCounts,
  getChatRoomList,
  getJoinRoomUser,
  getMessageList,
  verifyRoomExists,
} from './chat.service';

const chatRouter = Router();

chatRouter.get(
  '/',
  checkJWT,
  async (req: JwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded.id;
      const { page } = req.query as any;
      const rooms = await getChatRoomList(userId, page);
      return res.status(200).json(rooms);
    } catch (e) {
      return next(e);
    }
  },
);

chatRouter.get(
  '/details/:id',
  checkJWT,
  async (req: JwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded.id;
      const roomId = parseInt(req.params.id);
      verifyRoomExists(roomId);
      const messages = await getMessageList(roomId);
      const members = await getJoinRoomUser(roomId, userId);
      return res.status(200).json({ messages, members });
    } catch (e) {
      return next(e);
    }
  },
);

chatRouter.get(
  '/unread/',
  checkJWT,
  async (req: JwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded.id;
      const count = await allUnreadMessageCounts(userId);
      return res.status(200).json(count);
    } catch (e) {
      return next(e);
    }
  },
);

export default chatRouter;
