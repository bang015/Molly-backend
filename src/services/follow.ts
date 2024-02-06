import { Op } from "sequelize";
import Follow from "../models/follow";
import ProfileImage from "../models/profile-image";
import User from "../models/user";

export const selectFollowing = async (userId: number) => {
  const result = await Follow.findAll({
    attributes: ["followingId"],
    where: {
      followerId: userId,
    },
    include: [
      {
        model: User,
        attributes: ["name", "nickname"],
        include: [
          {
            model: ProfileImage,
            attributes: ["path"],
          },
        ],
      },
    ],
  });
  const cleanedResult = result.map((follow) => {
    const followInfo = follow.dataValues;
    const userInfo = followInfo.User.dataValues;
    const profileInfo = userInfo.ProfileImage;

    return {
      userId: followInfo.followingId,
      userName: userInfo.name,
      userNickname: userInfo.nickname,
      profileImagePath: profileInfo
        ? profileInfo.dataValues.path
        : null,
    };
  });

  return cleanedResult;
};

export const selectFollower = async (userId: number) => {
  const result = await Follow.findAll({
    attributes: ["followerId"],
    where: {
      followingId: userId,
    },
    include: [
      {
        model: User,
        attributes: ["name", "nickname"],
        include: [
          {
            model: ProfileImage,
            attributes: ["path"],
          },
        ],
      },
    ],
  });
  const cleanedResult = result.map((follow) => {
    const followInfo = follow.dataValues;
    const userInfo = followInfo.User.dataValues;
    const profileInfo = userInfo.ProfileImage;
    return {
      userId: followInfo.followerId,
      userName: userInfo.name,
      userNickname: userInfo.nickname,
      profileImagePath: profileInfo
        ? profileInfo.dataValues.path
        : null,
    };
  });

  return cleanedResult;
};

export const suggestFollowers = async (
  userId: number,
  followedUserIdList: number[],
  limit: number
) => {
  const result = await User.findAll({
    where: {
      id: {
        [Op.notIn]: [...followedUserIdList, userId],
      },
    },
    attributes: ["id", "name", "nickname"],
    include: { model: ProfileImage, attributes: ["path"] },
    limit: limit,
  });
  const cleanedResult = result.map((user) => {
    const userInfo = user.dataValues;
    return {
      userId: userInfo.id,
      userName: userInfo.name,
      userNickname: userInfo.nickname,
      profileImagePath: userInfo.profileImage
        ? userInfo.profileImage.dataValues.path
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
