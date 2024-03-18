"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestMessage = exports.getNotReadMessage = exports.MessageRead = exports.getChatRoomList = exports.getMessageById = exports.sendMessage = exports.getChatRoomMessage = exports.getJoinRoomUser = exports.joinChatRoom = exports.findExistingChatRoom = exports.verifyRoomExists = exports.createChatRoom = void 0;
const sequelize_1 = require("sequelize");
const chat_room_1 = __importDefault(require("../models/chat-room"));
const chat_users_1 = __importDefault(require("../models/chat-users"));
const chat_message_1 = __importDefault(require("../models/chat-message"));
const user_1 = __importDefault(require("../models/user"));
const profile_image_1 = __importDefault(require("../models/profile-image"));
const createChatRoom = async () => {
    // 채팅방 생성
    const result = await chat_room_1.default.create();
    return result.dataValues.id;
};
exports.createChatRoom = createChatRoom;
const verifyRoomExists = async (roomId) => {
    const result = await chat_room_1.default.findByPk(roomId);
    return result;
};
exports.verifyRoomExists = verifyRoomExists;
const findExistingChatRoom = async (
// 이미 만들어진 채팅방이있는지 확인
user1Id, user2Id) => {
    const result = await chat_users_1.default.findAll({
        where: {
            userId: {
                [sequelize_1.Op.or]: [user1Id, user2Id],
            },
        },
        attributes: ["roomId"],
        group: "roomId",
        having: sequelize_1.Sequelize.literal("COUNT(*) = 2"),
    });
    if (result.length > 0) {
        return result[0].dataValues.roomId;
    }
    else {
        return null;
    }
};
exports.findExistingChatRoom = findExistingChatRoom;
const joinChatRoom = async (users, roomId) => {
    // 생성된 채팅방에 유저 참여
    try {
        users.forEach((user) => {
            chat_users_1.default.create({
                userId: user,
                roomId: roomId,
            });
        });
        return true;
    }
    catch {
        return false;
    }
};
exports.joinChatRoom = joinChatRoom;
const getJoinRoomUser = async (roomId, userId) => {
    // 채팅방 참여유저 정보(본인 제외)
    const result = await chat_users_1.default.findOne({
        where: { roomId: roomId, userId: { [sequelize_1.Op.not]: userId } },
        attributes: [],
        include: [
            {
                model: user_1.default,
                as: "cUsers",
                attributes: ["name", "nickname", "id"],
                include: [{ model: profile_image_1.default, attributes: ["path"] }],
            },
        ],
    });
    if (result) {
        return result.toJSON();
    }
    else {
        return null;
    }
};
exports.getJoinRoomUser = getJoinRoomUser;
const getChatRoomMessage = async (roomId) => {
    // 채팅방 메시지
    const result = await chat_message_1.default.findAll({
        where: { roomId: roomId },
        include: [
            {
                model: user_1.default,
                as: "userMessage",
                attributes: ["name", "id"],
                include: [{ model: profile_image_1.default, attributes: ["path"] }],
            },
        ],
        order: [["createdAt", "DESC"]],
    });
    const message = result.map((msg) => {
        return msg.toJSON();
    });
    return message;
};
exports.getChatRoomMessage = getChatRoomMessage;
const sendMessage = async (
// 메시지 저장
roomId, userId, message) => {
    const result = await chat_message_1.default.create({
        userId,
        roomId,
        message,
    });
    return result.dataValues.id;
};
exports.sendMessage = sendMessage;
const getMessageById = async (id) => {
    // 저장한 메시지 가공된 정보 보내기
    const result = await chat_message_1.default.findOne({
        where: { id },
        include: [
            {
                model: user_1.default,
                as: "userMessage",
                attributes: ["name", "id"],
                include: [{ model: profile_image_1.default, attributes: ["path"] }],
            },
        ],
    });
    if (result) {
        return result.toJSON();
    }
    else {
        return null;
    }
};
exports.getMessageById = getMessageById;
const getChatRoomList = async (userId) => {
    // 채팅방 리스트
    const rooms = await chat_users_1.default.findAll({
        where: { userId: userId },
        attributes: ["roomId"],
    });
    if (!rooms) {
        return [];
    }
    const roomIds = rooms.map((room) => {
        return room.dataValues.roomId;
    });
    const roomsWithMessages = [];
    for (const roomId of roomIds) {
        const messageCount = await chat_message_1.default.count({ where: { roomId } });
        if (messageCount > 0) {
            roomsWithMessages.push(roomId);
        }
    }
    return roomsWithMessages;
};
exports.getChatRoomList = getChatRoomList;
const MessageRead = async (roomId, userId) => {
    chat_message_1.default.update({ isRead: true }, {
        where: {
            roomId: roomId,
            userId: { [sequelize_1.Op.ne]: userId }
        }
    });
};
exports.MessageRead = MessageRead;
const getNotReadMessage = async (roomId, userId) => {
    //채팅방의 읽지않은 메시지 카운트
    const result = await chat_message_1.default.count({
        where: {
            roomId: roomId,
            userId: {
                [sequelize_1.Op.not]: userId,
            },
            isRead: false
        },
    });
    return result;
};
exports.getNotReadMessage = getNotReadMessage;
const getLatestMessage = async (roomId) => {
    // 최근 메시지
    const result = await chat_message_1.default.findOne({
        where: { roomId },
        attributes: ["message", "createdAt"],
        order: [["createdAt", "DESC"]],
    });
    return result?.toJSON();
};
exports.getLatestMessage = getLatestMessage;
