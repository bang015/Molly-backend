const SocketIO = require("socket.io");
import { Server as HTTPServer } from "http";
import { Server as HTTPSServer } from "https";
import { Application } from "express";
import { Socket } from "socket.io";

const socket = (server: HTTPServer | HTTPSServer, app: Application) => {
  const io = SocketIO(server, {
    cors: {
      origin: "http://localhost:3000", // 허용할 클라이언트 주소
      methods: ["GET", "POST"], // 허용할 HTTP 메서드
    },
  });
  app.set('socket.io',io);
  io.on("connection", (socket: Socket) => {
    console.log("접속했습니다."); 
  });
};

export default socket;
