"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SocketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const config_1 = __importDefault(require("../../config"));
const chat_1 = require("../../services/chat");
const socket = (server, app) => {
    const io = SocketIO(server, {
        cors: {
            origin: "http://localhost:3000", // 허용할 클라이언트 주소
            methods: ["GET", "POST"], // 허용할 HTTP 메서드
        },
    });
    app.set("socket.io", io);
    io.on("connection", (socket) => {
        socket.on("create-room", async (data) => {
            const chatUser = [parseInt(data.chatUser)];
            const userId = verifyToken(data.token);
            if (userId) {
                chatUser.push(userId);
                const check = await (0, chat_1.findExistingChatRoom)(chatUser[0], userId);
                if (check) {
                    socket.emit("room-created-success", check);
                    return;
                }
                const roomId = await (0, chat_1.createChatRoom)();
                const roomExists = await (0, chat_1.verifyRoomExists)(roomId);
                if (roomExists) {
                    const joinRoom = await (0, chat_1.joinChatRoom)(chatUser, roomId);
                    if (joinRoom) {
                        socket.emit("room-created-success", roomId);
                    }
                }
            }
        });
        socket.on("joinChatRoom", async (data) => {
            socket.join(`room${data.roomId}`);
            const userId = verifyToken(data.token);
            if (userId) {
                const room = await (0, chat_1.getChatRoomMessage)(data.roomId);
                const user = await (0, chat_1.getJoinRoomUser)(data.roomId, userId);
                (0, chat_1.MessageRead)(data.roomId, userId);
                socket.emit("joinRoomSuccess", { room, user });
            }
        });
        socket.on("leaveRoom", (data) => {
            socket.leave(`room${data}`);
        });
        socket.on("messageRead", (data) => {
            const userId = verifyToken(data.token);
            (0, chat_1.MessageRead)(data.roomId, userId);
        });
        socket.on("sendMessage", async (data) => {
            const userId = verifyToken(data.token);
            if (userId) {
                const messageId = await (0, chat_1.sendMessage)(data.roomId, userId, data.message);
                if (messageId) {
                    const message = await (0, chat_1.getMessageById)(messageId);
                    io.to(`room${data.roomId}`).emit(`sendMessagesuccess`, message);
                    const user = await (0, chat_1.getJoinRoomUser)(data.roomId, userId);
                    io.emit("newMessage", user);
                }
            }
        });
        socket.on("getChatRoomList", async (data) => {
            const userId = verifyToken(data);
            if (userId) {
                const room = await (0, chat_1.getChatRoomList)(userId);
                socket.emit(`getChatRoomList${userId}`, room);
            }
        });
        socket.on("getRoomInfo", async (data) => {
            const userId = verifyToken(data.token);
            if (userId) {
                const user = await (0, chat_1.getJoinRoomUser)(data.roomId, userId);
                const _message = await (0, chat_1.getNotReadMessage)(data.roomId, userId);
                const latestMessage = await (0, chat_1.getLatestMessage)(data.roomId);
                socket.emit(`getRoomInfo${data.roomId}`, { user, _message, latestMessage });
            }
        });
        socket.on("getNotReadMessage", async (data) => {
            const userId = verifyToken(data);
            if (userId) {
                const rooms = await (0, chat_1.getChatRoomList)(userId);
                const counts = await Promise.all(rooms.map(async (room) => {
                    const _message = await (0, chat_1.getNotReadMessage)(room, userId);
                    return _message;
                }));
                const totalUnreadMessages = counts.reduce((acc, cur) => acc + cur, 0);
                socket.emit("allNotReadMessage", totalUnreadMessages);
            }
        });
    });
};
function verifyToken(token) {
    try {
        const payload = jwt.verify(token, config_1.default.toString());
        return payload.id;
    }
    catch {
        return null;
    }
}
exports.default = socket;
