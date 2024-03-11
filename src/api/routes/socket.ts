const SocketIO = require("socket.io");
const jwt = require("jsonwebtoken");
import jwtKey from "../../config";
import { Server as HTTPServer } from "http";
import { Server as HTTPSServer } from "https";
import { Application } from "express";
import { Socket } from "socket.io";
import {
  createChatRoom,
  findExistingChatRoom,
  getChatRoomMessage,
  getJoinRoomUser,
  getMessageById,
  joinChatRoom,
  sendMessage,
  verifyRoomExists,
} from "../../services/chat";

const socket = (server: HTTPServer | HTTPSServer, app: Application) => {
  const io = SocketIO(server, {
    cors: {
      origin: "http://localhost:3000", // 허용할 클라이언트 주소
      methods: ["GET", "POST"], // 허용할 HTTP 메서드
    },
  });
  app.set("socket.io", io);
  io.on("connection", (socket: Socket) => {
    console.log("접속했습니다.");
    socket.on("create-room", async (data): Promise<void> => {
      const chatUser = [parseInt(data.chatUser)];
      const userId = verifyToken(data.token);
      if (userId) {
        chatUser.push(userId);
        const check = await findExistingChatRoom(chatUser[0], userId);
        if(check){
          socket.emit("room-created-success",check);
          return;
        }
        const roomId = await createChatRoom();
        const roomExists = await verifyRoomExists(roomId);
        if (roomExists) {
          const joinRoom = await joinChatRoom(chatUser, roomId);
          if(joinRoom){
            socket.emit("room-created-success",roomId);
          }
        }
      }
    });
    socket.on("joinChatRoom",async (data):Promise<void> => {
      socket.join(`room${data.roomId}`);
      const userId = verifyToken(data.token);
      if(userId){
        const room = await getChatRoomMessage(data.roomId);
        const user = await getJoinRoomUser(data.roomId, userId);
        socket.emit("joinRoomSuccess",{room, user});
      }
    })
    socket.on("sendMessage", async(data):Promise<void> => {
      const userId = verifyToken(data.token);
      if(userId){
        const messageId = await sendMessage(data.roomId, userId, data.message);
        if(messageId){
          const message = await getMessageById(messageId);
          io.to(`room${data.roomId}`).emit("sendMessageSuccess" , message);
        }
      }
    })
  });
};

function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, jwtKey.toString());
    return payload.id;
  } catch {
    return null;
  }
}

export default socket;
