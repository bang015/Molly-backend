const SocketIO = require('socket.io');
const jwt = require('jsonwebtoken');
import config from '../common/config';
import { Server as HTTPServer } from 'http';
import { Server as HTTPSServer } from 'https';
import { Application } from 'express';
import { Socket } from 'socket.io';
import {
  MessageRead,
  createChatRoom,
  findExistingChatRoom,
  getChatRoomList,
  getChatRoomMessage,
  getJoinRoomUser,
  getLatestMessage,
  getMessageById,
  getNotReadMessage,
  joinChatRoom,
  sendMessage,
  verifyRoomExists,
} from './chat.service';
import { CustomSocket } from './chat.interfaces';

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
    console.log(token)
    if (!token) {
      return next(new Error('Token not provided'));
    }
    jwt.verify(token, config.jwtAccessKey.toString(), (err, decoded) => {
      if (err) {
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
    // 채팅방 생성
    socket.on('create-room', async (data): Promise<void> => {
      const chatUser = [parseInt(data.chatUser)];
      const userId = socket.userId;
      if (userId) {
        chatUser.push(userId);
        const check = await findExistingChatRoom(chatUser[0], userId);
        console.log(check);
        if (check) {
          socket.emit('room-created-success', check);
          return;
        }
        const roomId = await createChatRoom();
        const roomExists = await verifyRoomExists(roomId);
        if (roomExists) {
          const joinRoom = await joinChatRoom(chatUser, roomId);
          if (joinRoom) {
            socket.emit('room-created-success', roomId);
          }
        }
      }
    });

    // 채팅방 참여
    socket.on('joinChatRoom', async (data): Promise<void> => {
      socket.join(`room${data.roomId}`);
      const userId = socket.userId;
      if (userId) {
        const message = await getChatRoomMessage(data.roomId);
        const user = await getJoinRoomUser(data.roomId, userId);
        MessageRead(data.roomId, userId);
        socket.emit('joinRoomSuccess', { message, user });
      }
    });

    socket.on('leaveRoom', (data) => {
      socket.leave(`room${data}`);
    });

    // 메시지 읽음
    socket.on('messageRead', (data) => {
      const userId = socket.userId;
      MessageRead(data.roomId, userId);
    });

    // 메시지 보내기
    socket.on('sendMessage', async (data): Promise<void> => {
      const userId = socket.userId;
      if (userId) {
        const messageId = await sendMessage(data.roomId, userId, data.message);
        if (messageId) {
          const message = await getMessageById(messageId);
          io.to(`room${data.roomId}`).emit(`sendMessagesuccess`, message);
          const user = await getJoinRoomUser(data.roomId, userId);
          io.emit('newMessage', { user, sendUser: userId });
        }
      }
    });

    // 채팅방 목록
    socket.on('getChatRoomList', async (data): Promise<void> => {
      const userId = socket.userId;
      if (userId) {
        const room = await getChatRoomList(userId);
        socket.emit(`getChatRoomList${userId}`, room);
      }
    });

    // 채팅방 정보
    socket.on('getRoomInfo', async (data): Promise<void> => {
      const userId = socket.userId;
      if (userId) {
        const user = await getJoinRoomUser(data.roomId, userId);
        const _message = await getNotReadMessage(data.roomId, userId);
        const latestMessage = await getLatestMessage(data.roomId);
        socket.emit(`getRoomInfo${data.roomId}`, {
          user,
          _message,
          latestMessage,
        });
      }
    });

    // 읽지 않은 메시지
    socket.on('getNotReadMessage', async () => {
      const userId = socket.userId;
      if (userId) {
        const rooms = await getChatRoomList(userId);
        const counts = await Promise.all(
          rooms.map(async (room): Promise<number> => {
            const _message = await getNotReadMessage(room, userId);
            return _message;
          }),
        );
        const totalUnreadMessages = counts.reduce((acc, cur) => acc + cur, 0);
        socket.emit('allNotReadMessage', totalUnreadMessages);
      }
    });
  });
};

export default socket;
