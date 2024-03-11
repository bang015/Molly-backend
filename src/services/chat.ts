import { Op, Sequelize } from "sequelize";
import ChatRoom from "../models/chat-room";
import ChatUsers from "../models/chat-users";
import ChatMessage from "../models/chat-message";
import User from "../models/user";
import ProfileImage from "../models/profile-image";

export const createChatRoom = async () => {
  const result = await ChatRoom.create();
  return result.dataValues.id;
};
export const verifyRoomExists = async (roomId: number) => {
  const result = await ChatRoom.findByPk(roomId);
  return result;
};
export const findExistingChatRoom = async (
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
export const getJoinRoomUser = async(roomId: number, userId: number) => {
  const result = await ChatUsers.findOne({
    where:{ roomId: roomId, userId: {[Op.not] : userId}},
    attributes:[],
    include: [
      {
        model: User,
        as: "cUsers",
        attributes: ["name","nickname", "id"],
        include: [{ model: ProfileImage, attributes: ["path"] }],
      },
    ],
  })
  if(result){
    return result.toJSON();
  }else{
    return null;
  }
}
export const getChatRoomMessage = async (roomId: number) => {
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
    order: [['createdAt', 'DESC']]
  });
  const message = result.map((msg) => {
    return msg.toJSON();
  })
  return message;
};

export const sendMessage = async (
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
  if(result){
    return result.toJSON();
  }else{
    return null;
  }
};
