import { Op } from "sequelize";
import Follow from "../models/follow";
import ProfileImage from "../models/profile-image";
import User from "../models/user";

export const selectFollowing = async (userId: number) => {
  try {
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
      return {
        userId: follow.dataValues.followingId,
        userName: follow.User.dataValues.name,
        userNickname: follow.User.dataValues.nickname,
        profileImagePath: follow.User.ProfileImage
          ? follow.User.ProfileImage.dataValues.path
          : null,
      };
    });

    return cleanedResult;
  } catch (err) {
    throw err;
  }
};

export const selectFollower = async (userId: number) => {
  try {
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
      return {
        userId: follow.dataValues.followerId,
        userName: follow.User.dataValues.name,
        userNickname: follow.User.dataValues.nickname,
        profileImagePath: follow.User.ProfileImage
          ? follow.User.ProfileImage.dataValues.path
          : null,
      };
    });

    return cleanedResult;
  } catch (err) {
    throw err;
  }
};

export const suggestFollowers = async (
  userId: number,
  followedUserIdList: number[]
) => {
  try {
    const result = await User.findAll({
      where: {
        id: {
          [Op.notIn]: [...followedUserIdList, userId],
        },
      },
      attributes: ["id", "name", "nickname"],
      include: { model: ProfileImage, attributes: ["path"] },
    });
    const cleanedResult = result.map((user) => {
      return {
        userId: user.dataValues.id,
        userName: user.dataValues.name,
        userNickname: user.dataValues.nickname,
        profileImagePath: user.ProfileImage
          ? user.ProfileImage.dataValues.path
          : null,
      };
    });

    return cleanedResult;
  } catch (err) {
    throw err;
  }
};

export const addFollowing = async (userId: number, followUserId: number) => {
  try{
    const followedUserId = await Follow.create(
      {
        followerId: userId,
        followingId: followUserId
      }
    )
    return followUserId;
  }catch(err){
    throw err;
  }
}

export const unfollow =async (userId:number, followUserId : number) => {
  try{
    await Follow.destroy({
      where: {
        followerId: userId,
        followingId: followUserId,
      },
    });
  }catch(err){
    throw err
  }
}