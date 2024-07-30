import Like from './models/like.model';

// 현재 좋아요 상태 확인
export const isPostLiked = async (postId: number, userId: number) => {
  const result = await Like.findOne({
    where: {
      postId,
      userId,
    },
  });
  return !!result;
};

// 좋아요
export const likePost = async (postId: number, userId: number) => {
  await Like.create({
    postId,
    userId,
  });
};

// 좋아요 해제
export const unlikePost = async (postId: number, userId: number) => {
  await Like.destroy({
    where: {
      postId,
      userId,
    },
  });
};

// 해당 게시물 좋아요 수
export const getPostLikeCount = async (postId: number) => {
  const count = await Like.count({
    where: {
      postId,
    },
  });
  return count;
};
