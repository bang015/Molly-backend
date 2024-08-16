const SocketIO = require('socket.io');
const jwt = require('jsonwebtoken');
import config from '../common/config';
import { Server as HTTPServer } from 'http';
import { Server as HTTPSServer } from 'https';
import { Application } from 'express';
import {
  createChatRoom,
  createSystemMessage,
  deleteChatRoom,
  doesChatRoomExist,
  getJoinRoomUser,
  getUnreadMessageCounts,
  leaveChatRoom,
  MessageRead,
  sendMessage,
  verifyRoomExists,
} from './chat.service';
import { CustomSocket } from './chat.interfaces';
import { getUser } from '../user/user.service';

const socket = (server: HTTPServer | HTTPSServer, app: Application) => {
  const io = SocketIO(server, {
    cors: {
      origin: 'http://localhost', // 허용할 클라이언트 주소
      methods: ['GET', 'POST'], // 허용할 HTTP 메서드
    },
  });
  app.set('socket.io', io);
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Token not provided'));
    }
    jwt.verify(token, config.jwtAccessKey.toString(), (err, decoded) => {
      if (err) {
        console.log(err);
        if (err.name === 'TokenExpiredError') {
          return next(new Error('Token expired'));
        }
        return next(new Error('Authentication error'));
      }
      socket.userId = decoded.userId;
      next();
    });
  });
  io.on('connection', (socket: CustomSocket) => {
    const userId = socket.userId;
    socket.join(`user-${userId}`);
    // 채팅방 참여
    socket.on('joinChatRoom', async (data): Promise<void> => {
      if (socket.currentRoom) {
        socket.leave(socket.currentRoom);
      }
      socket.join(`room${data.roomId}`);
      socket.currentRoom = `room${data.roomId}`;
      MessageRead(data.roomId, userId);
    });

    //채팅방 생성
    socket.on('createChatRoom', async (data) => {
      try {
        const chatMembers = data.chatMembers;
        const user = await getUser({ id: userId });
        if (!user) {
          return;
        }
        const updatedChatMembers = chatMembers.map((member) => member.id);
        if (!updatedChatMembers.includes(userId)) {
          updatedChatMembers.push(userId);
        }
        if (chatMembers.length === 1) {
          const exist = await doesChatRoomExist(userId, chatMembers[0].id);
          if (exist) {
            return socket.emit('newChatRoom', { roomId: exist.get('roomId') });
          }
          const room = await createChatRoom(updatedChatMembers);
          return socket.emit('newChatRoom', { roomId: room });
        }
        const room = await createChatRoom(updatedChatMembers, true);
        const memberNames = chatMembers.map((member) => member.name).join(', ');
        const sysMessage = await createSystemMessage(
          room,
          `${user.name}님이 ${memberNames}님을 초대했습니다.`,
        );
        chatMembers.push({ id: userId });
        chatMembers.forEach(async (user) => {
          io.to(`user-${user.id}`).emit('newMessage', {
            latestMessage: sysMessage,
            unReadCount: 0,
            roomId: room,
            members: chatMembers,
          });
        });
        socket.emit('newChatRoom', { roomId: room });
      } catch (e) {
        socket.emit('messageError', '채팅방 생성에 실패했습니다.');
      }
    });

    // 메시지 읽음
    socket.on('messageRead', (data) => {
      MessageRead(data.roomId, userId);
    });

    // 메시지 보내기
    socket.on('sendMessage', async (data): Promise<void> => {
      if (!userId) {
        return;
      }
      try {
        const message = await sendMessage(data.roomId, userId, data.message);
        io.to(`room${data.roomId}`).emit(`sendMessagesuccess`, message);
        const members = await getJoinRoomUser(data.roomId, userId);
        const unReadCount = await getUnreadMessageCounts(data.roomId, userId);
        io.to(`user-${userId}`).emit('newMessage', {
          latestMessage: message,
          unReadCount,
          roomId: data.roomId,
          members: members,
        });
        members.forEach(async (user) => {
          const unReadCount = await getUnreadMessageCounts(
            data.roomId,
            user.get('id'),
          );
          io.to(`user-${user.get('id')}`).emit('newMessage', {
            latestMessage: message,
            unReadCount,
            roomId: data.roomId,
            members: members,
          });
          io.to(`user-${user.get('id')}`).emit('updateCount', {});
        });
      } catch (e) {
        socket.emit('messageError', '메시지 전송에 실패했습니다.');
      }
    });

    // 채팅방 나가기
    socket.on('leaveChatRoom', async (data) => {
      const roomId = data.roomId;
      const room = await verifyRoomExists(roomId);
      const user = await getUser({ id: userId });
      const updateMembers = await leaveChatRoom(roomId, userId);
      socket.leave(`room${roomId}`);
      if (updateMembers.length == 0) {
        return await deleteChatRoom(roomId);
      }
      if (room.get('isGroupChat')) {
        const sysMessage = await createSystemMessage(
          roomId,
          `${user.name}님이 채팅방을 나갔습니다.`,
        );
        updateMembers.forEach(async (member) => {
          const members = await getJoinRoomUser(roomId, member.get('id'));
          io.to(`user-${member.get('id')}`).emit(`userLeft`, {
            roomId,
            sysMessage,
            members,
          });
        });
      }
    });
  });
};

export default socket;
