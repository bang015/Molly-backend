import { Op, Sequelize } from 'sequelize';
import ChatMembers from './models/chat-members.model';
import ChatRoom from './models/chat-room.model';
import User from '../user/models/user.model';
import ProfileImage from '../user/models/profile-image.model';
import ChatMessage from './models/chat-message.model';

// 채팅방 생성
export const createChatRoom = async () => {
  const result = await ChatRoom.create();
  return result.dataValues.id;
};

// 해당 채팅방이 존재하는 지 확인
export const verifyRoomExists = async (roomId: number) => {
  const result = await ChatRoom.findByPk(roomId);
  return result;
};

// 이미 만들어진 채팅방이있는지 확인
export const findExistingChatRoom = async (
  user1Id: number,
  user2Id: number,
) => {
  const result = await ChatMembers.findAll({
    where: {
      userId: {
        [Op.or]: [user1Id, user2Id],
      },
    },
    attributes: ['roomId'],
    group: 'roomId',
    having: Sequelize.literal('COUNT(*) = 2'),
  });
  if (result.length > 0) {
    return result[0].dataValues.roomId;
  } else {
    return null;
  }
};

// 생성된 채팅방에 유저 참여
export const joinChatRoom = async (users: number[], roomId: number) => {
  try {
    users.forEach((user) => {
      ChatMembers.create({
        userId: user,
        roomId: roomId,
      });
    });
    return true;
  } catch {
    return false;
  }
};

// 채팅방 참여유저 정보(본인 제외)
export const getJoinRoomUser = async (roomId: number, userId: number) => {
  const result = await ChatMembers.findOne({
    where: { roomId: roomId, userId: { [Op.not]: userId } },
    attributes: [],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['name', 'nickname', 'id'],
        include: [{ model: ProfileImage, attributes: ['path'] }],
      },
    ],
  });
  if (result) {
    return result.toJSON().user;
  } else {
    return null;
  }
};

// 채팅방 메시지
export const getChatRoomMessage = async (roomId: number) => {
  const result = await ChatMessage.findAll({
    where: { roomId: roomId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['name', 'id'],
        include: [{ model: ProfileImage, attributes: ['path'] }],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
  const message = result.map((msg) => {
    return msg.toJSON();
  });
  return message;
};

// 메시지 저장
export const sendMessage = async (
  roomId: number,
  userId: number,
  message: string,
) => {
  const result = await ChatMessage.create({
    userId,
    roomId,
    message,
  });
  return result.dataValues.id;
};

// 저장한 메시지 가공된 정보 보내기
export const getMessageById = async (id: number) => {
  const result = await ChatMessage.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['name', 'id'],
        include: [{ model: ProfileImage, attributes: ['path'] }],
      },
    ],
  });
  if (result) {
    return result.toJSON();
  } else {
    return null;
  }
};

// 채팅방 리스트
export const getChatRoomList = async (userId: number) => {
  const rooms = await ChatMembers.findAll({
    where: { userId: userId },
    attributes: ['roomId'],
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

// 메시지 읽음 처리
export const MessageRead = async (roomId: number, userId: number) => {
  ChatMessage.update(
    { isRead: true },
    {
      where: {
        roomId: roomId,
        userId: { [Op.ne]: userId },
      },
    },
  );
};

//채팅방의 읽지않은 메시지 카운트
export const getNotReadMessage = async (roomId: number, userId: number) => {
  const result = await ChatMessage.count({
    where: {
      roomId: roomId,
      userId: {
        [Op.not]: userId,
      },
      isRead: false,
    },
  });
  return result;
};

// 최근 메시지
export const getLatestMessage = async (roomId: number) => {
  const result = await ChatMessage.findOne({
    where: { roomId },
    attributes: ['message', 'createdAt'],
    order: [['createdAt', 'DESC']],
  });
  return result?.toJSON();
};
