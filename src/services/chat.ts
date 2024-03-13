import { Op, Sequelize } from "sequelize";
import ChatRoom from "../models/chat-room";
import ChatUsers from "../models/chat-users";
import ChatMessage from "../models/chat-message";
import User from "../models/user";
import ProfileImage from "../models/profile-image";

export const createChatRoom = async () => {
  // 채팅방 생성
  const result = await ChatRoom.create();
  return result.dataValues.id;
};
export const verifyRoomExists = async (roomId: number) => {
  const result = await ChatRoom.findByPk(roomId);
  return result;
};
export const findExistingChatRoom = async (
  // 이미 만들어진 채팅방이있는지 확인
  user1Id: number,
  user2Id: number
) => {
  const result = await ChatUsers.findAll({
    where: {
      userId: {
        [Op.or]: [user1Id, user2Id],
      },
    },
    attributes: ["roomId"],
    group: "roomId",
    having: Sequelize.literal("COUNT(*) = 2"),
  });
  if (result.length > 0) {
    return result[0].dataValues.roomId;
  } else {
    return null;
  }
};
export const joinChatRoom = async (users: number[], roomId: number) => {
  // 생성된 채팅방에 유저 참여
  try {
    users.forEach((user) => {
      ChatUsers.create({
        userId: user,
        roomId: roomId,
      });
    });
    return true;
  } catch {
    return false;
  }
};
export const getJoinRoomUser = async (roomId: number, userId: number) => {
  // 채팅방 참여유저 정보(본인 제외)
  const result = await ChatUsers.findOne({
    where: { roomId: roomId, userId: { [Op.not]: userId } },
    attributes: [],
    include: [
      {
        model: User,
        as: "cUsers",
        attributes: ["name", "nickname", "id"],
        include: [{ model: ProfileImage, attributes: ["path"] }],
      },
    ],
  });
  if (result) {
    return result.toJSON();
  } else {
    return null;
  }
};
export const getChatRoomMessage = async (roomId: number) => {
  // 채팅방 메시지
  const result = await ChatMessage.findAll({
    where: { roomId: roomId },
    include: [
      {
        model: User,
        as: "userMessage",
        attributes: ["name", "id"],
        include: [{ model: ProfileImage, attributes: ["path"] }],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  const message = result.map((msg) => {
    return msg.toJSON();
  });
  return message;
};

export const sendMessage = async (
  // 메시지 저장
  roomId: number,
  userId: number,
  message: string
) => {
  const result = await ChatMessage.create({
    userId,
    roomId,
    message,
  });
  return result.dataValues.id;
};

export const getMessageById = async (id: number) => {
  // 저장한 메시지 가공된 정보 보내기
  const result = await ChatMessage.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: "userMessage",
        attributes: ["name", "id"],
        include: [{ model: ProfileImage, attributes: ["path"] }],
      },
    ],
  });
  if (result) {
    return result.toJSON();
  } else {
    return null;
  }
};

export const getChatRoomList = async (userId: number) => {
  // 채팅방 리스트
  const rooms = await ChatUsers.findAll({
    where: { userId: userId },
    attributes: ["roomId"],
  });
  if (!rooms) {
    return [];
  }
  const roomIds = rooms.map((room) => {
    return room.dataValues.roomId;
  });
  const roomsWithMessages: number[] = [];
  for (const roomId of roomIds) {
    const messageCount = await ChatMessage.count({ where: { roomId } });
    if (messageCount > 0) {
      roomsWithMessages.push(roomId);
    }
  }
  return roomsWithMessages;
};
export const MessageRead = async(roomId: number, userId: number) => {
  ChatMessage.update(
    {isRead: true},
    {
      where: {
        roomId: roomId,
        userId: { [Op.ne] : userId}
      }
    }
  );
}
export const getNotReadMessage = async (roomId: number, userId: number) => {
  //채팅방의 읽지않은 메시지 카운트
  const result = await ChatMessage.count({
    where: {
      roomId: roomId,
      userId: {
        [Op.not]: userId,
      },
      isRead: false
    },
  });
  return result;
};

export const getLatestMessage = async (roomId: number) => {
  // 최근 메시지
  const result = await ChatMessage.findOne({
    where: { roomId },
    attributes: ["message", "createdAt"],
    order: [["createdAt", "DESC"]],
  });
  return result?.toJSON();
};
