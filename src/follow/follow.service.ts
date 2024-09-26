import { Op, Sequelize } from 'sequelize';
import Follow from './models/follow.model';
import User from '../user/models/user.model';
import ProfileImage from '../user/models/profile-image.model';

// 팔로윙 목록 / 검색
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
  try {
    const result = await Follow.findAndCountAll({
      attributes: ['followingId'],

      where: {
        followerId: userId,
      },
      include: [
        {
          model: User,
          as: 'following',
          attributes: ['id', 'name', 'nickname'],
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
    const totalPages = Math.ceil(result.count / limit);
    const followings = result.rows.map((follow) => {
      return {
        ...follow.toJSON().following,
      };
    });
    return { followings, totalPages };
  } catch (e) {
    throw Error('팔로우 목록을 가져오는데 실패했습니다.');
  }
};

// 팔로워 목록 / 검색
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
  try {
    const result = await Follow.findAndCountAll({
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
    const totalPages = Math.ceil(result.count / limit);
    const followers = result.rows.map((follow) => {
      return {
        id: follow.toJSON().followerId,
        ...follow.toJSON().follower,
      };
    });
    return { followers, totalPages };
  } catch (e) {
    throw Error('팔로워 목록을 가져오는데 실패했습니다.');
  }
};

// 유저 추천
export const suggestFollowers = async (userId: number, limit: number) => {
  try {
    const followers = await selectFollower(userId);
    const suggestionPromises = followers.followers.map(async (follow) => {
      const isFollowingUser = await isFollowing({
        userId,
        targetId: follow.id,
      });
      if (!isFollowingUser) {
        return {
          ...follow,
          message: '회원님을 팔로우합니다',
          isFollowed: false,
        };
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
      return {
        ...user.toJSON(),
        message: '회원님을 위한 추천',
        isFollowed: false,
      };
    });
    return [...suggestedFollowers, ...formattedFollowers];
  } catch (e) {
    throw Error('추천 팔로우 목록을 가져오는데 실패했습니다.');
  }
};

// 팔로우
export const follow = async (payload: { userId: number; targetId: number }) => {
  try {
    const result = await Follow.create({
      followerId: payload.userId,
      followingId: payload.targetId,
    });
    return result.get();
  } catch (e) {
    throw Error('팔로우 실패했습니다.');
  }
};

// 언팔로우
export const unfollow = async (payload: {
  userId: number;
  targetId: number;
}) => {
  try {
    await Follow.destroy({
      where: {
        followerId: payload.userId,
        followingId: payload.targetId,
      },
    });
  } catch (e) {
    throw Error('언팔로우 실패했습니다.');
  }
};

// 현재 팔로우 상태 확인
export const isFollowing = async (payload: {
  userId: number;
  targetId: number;
}) => {
  try {
    const result = await Follow.findOne({
      where: {
        followerId: payload.userId,
        followingId: payload.targetId,
      },
    });
    return !!result;
  } catch (e) {
    throw Error('팔로워 상태를 확인하는데 실패했습니다.');
  }
};
