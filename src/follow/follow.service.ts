import { Op, Sequelize } from 'sequelize';
import Follow from '../models/follow';
import ProfileImage from '../models/profile-image';
import User from '../models/user';

export const selectFollowing = async (
  userId: number,
  query?: string,
  page: number = 1,
  limit: number = 12,
) => {
  const offset = limit * (page - 1);
  const searchCondition: { [Op.or]?: any } = {};
  if (query) {
    searchCondition[Op.or] = [
      { name: { [Op.like]: `%${query}%` } },
      { nickname: { [Op.like]: `%${query}%` } },
    ];
  }
  const followings = await Follow.findAll({
    attributes: ['followingId'],

    where: {
      followerId: userId,
    },
    include: [
      {
        model: User,
        as: 'following',
        attributes: ['name', 'nickname'],
        where: searchCondition,
        include: [
          {
            model: ProfileImage,
            attributes: ['path'],
          },
        ],
      },
    ],
    offset,
    limit,
  });
  const formattedFollowings = followings.map((follow) => {
    return {
      id: follow.toJSON().followingId,
      ...follow.toJSON().following,
    };
  });
  return formattedFollowings;
};

export const selectFollower = async (
  userId: number,
  query?: string,
  page: number | null = null,
  limit: number | null = null,
) => {
  const offset = limit && page ? limit * (page - 1) : undefined;
  const searchCondition: { [Op.or]?: any } = {};
  if (query) {
    searchCondition[Op.or] = [
      { name: { [Op.like]: `%${query}%` } },
      { nickname: { [Op.like]: `%${query}%` } },
    ];
  }
  const followers = await Follow.findAll({
    attributes: ['followerId'],
    where: {
      followingId: userId,
    },
    include: [
      {
        model: User,
        as: 'follower',
        where: searchCondition,
        attributes: ['name', 'nickname'],
        include: [
          {
            model: ProfileImage,
            attributes: ['path'],
          },
        ],
      },
    ],
    offset,
    limit,
  });
  const formattedFollowers = followers.map((follow) => {
    return {
      id: follow.toJSON().followerId,
      ...follow.toJSON().follower,
    };
  });
  return formattedFollowers;
};

export const suggestFollowers = async (userId: number, limit: number) => {
  const followers = await selectFollower(userId);
  const suggestionPromises = followers.map(async (follow) => {
    const isFollowingUser = await isFollowing({
      userId,
      targetId: follow.id,
    });
    if (!isFollowingUser) {
      return { ...follow, message: '회원님을 팔로우합니다' };
    }
  });
  const suggestedResults = await Promise.all(suggestionPromises);
  const suggestedFollowers = suggestedResults.filter(Boolean);
  const excludedUserIds = [
    userId,
    ...suggestedFollowers.map((user) => user.id),
  ];
  const additionalFollowers = await User.findAll({
    where: {
      [Op.and]: [
        {
          id: {
            [Op.not]: excludedUserIds,
          },
        },
        {
          id: {
            [Op.notIn]: Sequelize.literal(
              `(SELECT followingId FROM Follow WHERE followerId = ${userId})`,
            ),
          },
        },
      ],
    },
    attributes: ['id', 'name', 'nickname'],
    include: { model: ProfileImage, attributes: ['path'] },
    order: Sequelize.literal('RAND()'),
    limit: limit - suggestedFollowers.length,
  });
  const formattedFollowers = additionalFollowers.map((user) => {
    return { ...user.toJSON(), message: '회원님을 위한 추천' };
  });

  return [...suggestedFollowers, ...formattedFollowers];
};

export const follow = async (payload: { userId: number; targetId: number }) => {
  const result = await Follow.create({
    followerId: payload.userId,
    followingId: payload.targetId,
  });
  return result.get();
};

export const unfollow = async (payload: {
  userId: number;
  targetId: number;
}) => {
  await Follow.destroy({
    where: {
      followerId: payload.userId,
      followingId: payload.targetId,
    },
  });
};

export const isFollowing = async (payload: {
  userId: number;
  targetId: number;
}) => {
  const result = await Follow.findOne({
    where: {
      followerId: payload.userId,
      followingId: payload.targetId,
    },
  });
  return !!result;
};
