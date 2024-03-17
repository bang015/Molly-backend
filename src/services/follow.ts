import { Op, Sequelize } from "sequelize";
import Follow from "../models/follow";
import ProfileImage from "../models/profile-image";
import User from "../models/user";

export const selectFollowing = async (
  userId: number,
  query?: string,
  page: number = 1,
  limit: number = 12
) => {
  const offset = limit * (page - 1);
  const whereCondition: { [Op.or]?: any } = {};
  if (query) {
    whereCondition[Op.or] = [
      { name: { [Op.like]: `%${query}%` } },
      { nickname: { [Op.like]: `%${query}%` } },
    ];
  }
  const result = await Follow.findAll({
    attributes: ["followingId"],

    where: {
      followerId: userId,
    },
    include: [
      {
        model: User,
        as: "following",
        attributes: ["name", "nickname"],
        where: whereCondition,
        include: [
          {
            model: ProfileImage,
            attributes: ["path"],
          },
        ],
      },
    ],
    offset,
    limit,
  });
  const cleanedResult = result.map((follow) => {
    const result = {
      id: follow.toJSON().followingId,
      ...follow.toJSON().following,
    };
    return result;
  });
  return cleanedResult;
};
export const followCount = async (userId: number) => {
  const result = await Follow.count({
    where: {
      followerId: userId,
    },
  });
  return result;
};
export const selectFollower = async (
  userId: number,
  query?: string,
  page: number = 1,
  limit: number = 12
) => {
  const offset = limit * (page - 1);
  const whereCondition: { [Op.or]?: any } = {};
  if (query) {
    whereCondition[Op.or] = [
      { name: { [Op.like]: `%${query}%` } },
      { nickname: { [Op.like]: `%${query}%` } },
    ];
  }
  const result = await Follow.findAll({
    attributes: ["followerId"],
    where: {
      followingId: userId,
    },
    include: [
      {
        model: User,
        as: "follower",
        where: whereCondition,
        attributes: ["name", "nickname"],
        include: [
          {
            model: ProfileImage,
            attributes: ["path"],
          },
        ],
      },
    ],
    offset,
    limit,
  });

  const cleanedResult = result.map((follow) => {
    const result = {
      id: follow.toJSON().followerId,
      ...follow.toJSON().follower,
    };
    return result;
  });
  return cleanedResult;
};
export const followerCount = async (userId: number) => {
  const result = await Follow.count({
    where: {
      followingId: userId,
    },
  });
  return result;
};

export const suggestFollowers = async (
  userId: number,
  limit: number,
  filter: number[]
) => {
  const userIdConditions = filter.map((userId) => ({
    id: {
      [Op.not]: userId, // userId와 다른 경우를 나타내는 조건
    },
  }));
  const result = await User.findAll({
    where: {
      [Op.and]: [
        {
          id: {
            [Op.not]: userId,
          },
        },
        userIdConditions,
        {
          id: {
            [Op.notIn]: Sequelize.literal(
              `(SELECT followingId FROM Follow WHERE followerId = ${userId})`
            ),
          },
        },
      ],
    },
    attributes: ["id", "name", "nickname"],
    include: { model: ProfileImage, attributes: ["path"] },
    order: Sequelize.literal("RAND()"),
    limit: limit,
  });
  const cleanedResult = result.map((user) => {
    const result = { ...user.toJSON(), message: "회원님을 위한 추천" };
    return result;
  });

  return cleanedResult;
};

export const addFollowing = async (userId: number, followUserId: number) => {
  await Follow.create({
    followerId: userId,
    followingId: followUserId,
  });
  return followUserId;
};

export const unfollow = async (userId: number, followUserId: number) => {
  await Follow.destroy({
    where: {
      followerId: userId,
      followingId: followUserId,
    },
  });
};

export const checkFollowed = async (userId: number, followUserId: number) => {
  const result = await Follow.findOne({
    where: {
      followerId: userId,
      followingId: followUserId,
    },
  });
  return !!result;
};
