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
    const followInfo = follow.dataValues;
    const userInfo = followInfo.following.dataValues;
    const profileInfo = userInfo.ProfileImage;
    return {
      userId: followInfo.followingId,
      userName: userInfo.name,
      userNickname: userInfo.nickname,
      profileImagePath: profileInfo ? profileInfo.dataValues.path : null,
    };
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
    const followInfo = follow.dataValues;
    const userInfo = followInfo.follower.dataValues;
    const profileInfo = userInfo.ProfileImage;
    return {
      userId: followInfo.followerId,
      userName: userInfo.name,
      userNickname: userInfo.nickname,
      profileImagePath: profileInfo ? profileInfo.dataValues.path : null,
    };
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

export const suggestFollowers = async (userId: number, limit: number) => {
  const result = await User.findAll({
    where: {
      [Op.and]: [
        {
          id: {
            [Op.not]: userId,
          },
        },
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
    limit: limit,
  });
  const cleanedResult = result.map((user) => {
    const userInfo = user.dataValues;
    console.log(userInfo.ProfileImage);
    return {
      userId: userInfo.id,
      userName: userInfo.name,
      userNickname: userInfo.nickname,
      profileImagePath: userInfo.ProfileImage
        ? userInfo.ProfileImage.dataValues.path
        : null,
    };
  });

  return cleanedResult;
};

export const addFollowing = async (userId: number, followUserId: number) => {
  const followedUserId = await Follow.create({
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
