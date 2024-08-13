import { literal, Op, Sequelize } from 'sequelize';
import ChatMembers from './models/chat-members.model';
import ChatRoom from './models/chat-room.model';
import User from '../user/models/user.model';
import ProfileImage from '../user/models/profile-image.model';
import ChatMessage, { MessageType } from './models/chat-message.model';
import sequelize from '../common/config/database';
import MessageReadStatus from './models/message-read.model';

// 채팅방 생성
export const createChatRoom = async (
  users: number[],
  isActive: boolean = false,
) => {
  const transaction = await sequelize.transaction();
  try {
    const result = await ChatRoom.create(
      {
        isGroupChat: users.length > 2 ? true : false,
      },
      { transaction },
    );
    const roomId = result.get('id');
    const chatMembers = users.map((user) => ({
      userId: user,
      roomId: roomId,
      isActive,
    }));

    await ChatMembers.bulkCreate(chatMembers, { transaction });

    await transaction.commit();
    return roomId;
  } catch (e) {
    await transaction.rollback();
    throw Error('채팅방 생성에 실패했습니다.');
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
// 해당 채팅방이 존재하는 지 확인
export const verifyRoomExists = async (roomId: number) => {
  const result = await ChatRoom.findByPk(roomId);
  if (!result) {
    throw Error('존재하지 않는 채팅방입니다.');
  }
  return result;
};

// 이미 만들어진 채팅방이있는지 확인
export const doesChatRoomExist = async (user1Id: number, user2Id: number) => {
  const result = await ChatMembers.findOne({
    attributes: ['roomId'],
    where: {
      userId: {
        [Op.in]: [user1Id, user2Id],
      },
    },
    group: 'roomId',
    having: literal(`COUNT(DISTINCT userId) = 2`),
  });
  return result;
};

// 채팅방 참여유저 정보(본인 제외)
export const getJoinRoomUser = async (roomId: number, userId: number) => {
  const result = await ChatMembers.findAll({
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
  const members = result.map((member) => member.user);
  return members;
};

//채팅방의 읽지않은 메시지 카운트
export const getUnreadMessageCounts = async (
  roomId: number,
  userId: number,
) => {
  const result = await MessageReadStatus.count({
    where: { userId, isRead: false },
    include: [
      {
        model: ChatMessage,
        where: { roomId },
      },
    ],
  });
  return result;
};

// 전체 읽지 않은 메시지 카운트
export const allUnreadMessageCounts = async (userId: number) => {
  try {
    const result = await MessageReadStatus.count({
      where: { userId, isRead: false },
    });
    return result;
  } catch (e) {
    return 0; // 오류 발생 시 0을 반환하도록 설정
  }
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

// 채팅방 메시지
export const getMessageList = async (roomId: number) => {
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
  const messages = result.map((msg) => msg.toJSON());
  return messages;
};

// 메시지 저장
export const sendMessage = async (
  roomId: number,
  userId: number,
  message: string,
) => {
  const transaction = await sequelize.transaction();
  try {
    const result = await ChatMessage.create(
      { userId, roomId, message },
      { transaction },
    );
    const members = await getJoinRoomUser(roomId, userId);
    const messageReadStatusList = members.map((member) => ({
      userId: member.id,
      messageId: result.get('id'),
    }));
    await MessageReadStatus.bulkCreate(messageReadStatusList, { transaction });
    await ChatMembers.update(
      { isActive: true },
      { where: { roomId }, transaction },
    );
    const newMessage = await ChatMessage.findOne({
      where: { id: result.get('id') },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'id'],
          include: [{ model: ProfileImage, attributes: ['path'] }],
        },
      ],
      transaction,
    });
    await transaction.commit();
    return newMessage.toJSON();
  } catch (error) {
    await transaction.rollback();
    throw Error('메시지 저장에 실패했습니다.');
  }
};

// 채팅방 리스트
export const getChatRoomList = async (
  userId: number,
  page: number = 1,
  limit: number = 30,
) => {
  try {
    const offset = limit * (page - 1);
    const rooms = await ChatMembers.findAndCountAll({
      where: { userId: userId, isActive: true },
      attributes: ['roomId'],
      offset,
      limit,
    });
    const roomList = await Promise.all(
      rooms.rows.map(async (room) => {
        const roomId = room.get('roomId');
        const unReadCount = await getUnreadMessageCounts(roomId, userId);
        const latestMessage = await getLatestMessage(roomId);
        const members = await getJoinRoomUser(roomId, userId);
        return { roomId, unReadCount, latestMessage, members };
      }),
    );
    const totalPages = Math.ceil(rooms.count / limit);
    return { roomList, totalPages };
  } catch (e) {
    throw Error('채팅방 목록을 가져오는데 실패했습니다.');
  }
};

// 메시지 읽음 처리
export const MessageRead = async (roomId: number, userId: number) => {
  const messageIds = (
    await ChatMessage.findAll({
      attributes: ['id'],
      where: {
        roomId,
      },
    })
  ).map((message) => message.id);

  await MessageReadStatus.update(
    { isRead: true },
    {
      where: {
        messageId: messageIds,
        userId,
        isRead: false,
      },
    },
  );
};

// 시스템 메시지 저장
export const createSystemMessage = async (roomId: number, message: string) => {
  const sysMessage = await ChatMessage.create({
    roomId,
    type: MessageType.SYSTEM,
    message,
    isRead: true,
  });
  return sysMessage.toJSON();
};

// 채팅방 나가기
export const leaveChatRoom = async (roomId: number, userId: number) => {
  const room = await ChatRoom.findOne({
    where: { id: roomId },
    attributes: ['isGroupChat'],
  });
  if (room.get('isGroupChat')) {
    await ChatMembers.destroy({
      where: { roomId, userId },
    });
  } else {
    await ChatMembers.update(
      { isActive: false },
      {
        where: {
          roomId,
          userId,
        },
      },
    );
  }
  const members = await getJoinRoomUser(roomId, userId);
  return members;
};

// 채팅방 삭제
export const deleteChatRoom = async (roomId: number) => {
  const room = await ChatRoom.findOne({
    where: { id: roomId },
    attributes: ['isGroupChat'],
  });
  if (room.get('isGroupChat')) {
    await ChatRoom.destroy({ where: { id: roomId } });
  }
};
