import { Router, Response, NextFunction } from 'express';
import { checkJWT } from '../common/middleware/checkJwt';
import { JwtRequest } from '../auth/auth.interfaces';
import {
  allUnreadMessageCounts,
  createChatRoom,
  createSystemMessage,
  doesChatRoomExist,
  getChatRoomList,
  getJoinRoomUser,
  getMessageList,
  verifyRoomExists,
} from './chat.service';
import { getUser } from '../user/user.service';

const chatRouter = Router();
chatRouter.post(
  '/',
  checkJWT,
  async (req: JwtRequest, res: Response, next: NextFunction) => {
    const userId = req.decoded.id;
    const { chatMembers } = req.body;
    try {
      const user = await getUser({ id: userId });
      if (!user) {
        return res.status(404).json({ error: '권한이 없습니다.' });
      }
      const updatedChatMembers = chatMembers.map((member) => member.id);
      if (!updatedChatMembers.includes(userId)) {
        updatedChatMembers.push(userId);
      }
      if (chatMembers.length === 1) {
        const exist = await doesChatRoomExist(userId, chatMembers[0].id);
        if (exist) {
          return res.status(200).json(exist.get('roomId'));
        }
        const room = await createChatRoom(updatedChatMembers);
        return res.status(200).json(room);
      }
      const room = await createChatRoom(updatedChatMembers, true);
      const memberNames = chatMembers.map((member) => member.name).join(', ');
      await createSystemMessage(
        room,
        `${user.name}님이 ${memberNames}님을 초대했습니다.`,
      );
      return res.status(200).json(room);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  },
);

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
