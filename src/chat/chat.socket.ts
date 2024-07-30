const SocketIO = require('socket.io');
const jwt = require('jsonwebtoken');
import jwtKey from '../common/config';
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

const socket = (server: HTTPServer | HTTPSServer, app: Application) => {
  const io = SocketIO(server, {
    cors: {
      origin: 'http://localhost', // 허용할 클라이언트 주소
      methods: ['GET', 'POST'], // 허용할 HTTP 메서드
    },
  });
  app.set('socket.io', io);
  io.on('connection', (socket: Socket) => {
    // 채팅방 생성
    socket.on('create-room', async (data): Promise<void> => {
      const chatUser = [parseInt(data.chatUser)];
      const userId = verifyToken(data.token);
      if (userId) {
        chatUser.push(userId);
        const check = await findExistingChatRoom(chatUser[0], userId);
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
      const userId = verifyToken(data.token);
      if (userId) {
        const room = await getChatRoomMessage(data.roomId);
        const user = await getJoinRoomUser(data.roomId, userId);
        MessageRead(data.roomId, userId);
        socket.emit('joinRoomSuccess', { room, user });
      }
    });

    socket.on('leaveRoom', (data) => {
      socket.leave(`room${data}`);
    });

    // 메시지 읽음
    socket.on('messageRead', (data) => {
      const userId = verifyToken(data.token);
      MessageRead(data.roomId, userId);
    });

    // 메시지 보내기
    socket.on('sendMessage', async (data): Promise<void> => {
      const userId = verifyToken(data.token);
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
      const userId = verifyToken(data);
      if (userId) {
        const room = await getChatRoomList(userId);
        socket.emit(`getChatRoomList${userId}`, room);
      }
    });

    // 채팅방 정보
    socket.on('getRoomInfo', async (data): Promise<void> => {
      const userId = verifyToken(data.token);
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
    socket.on('getNotReadMessage', async (data) => {
      const userId = verifyToken(data);
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
    // 토큰 확인
    function verifyToken(token: string) {
      try {
        const payload = jwt.verify(token, jwtKey.toString());
        return payload.id;
      } catch (e) {
        socket.emit('auth_error')
        return null;
      }
    }
  });
};

export default socket;
