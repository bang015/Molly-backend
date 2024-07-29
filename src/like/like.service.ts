import Like from "../models/like"


export const isPostLiked  = async(postId: number, userId: number) => {
  const result = await Like.findOne({
    where: {
      postId,
      userId
    }
  });
  return !!result;
};

export const likePost  = async(postId: number, userId: number) => {
  await Like.create({
    postId,
    userId
  });
};

export const unlikePost  = async(postId: number, userId: number) => {
  await Like.destroy({
    where: {
      postId,
      userId
    }
  });
};

export const getPostLikeCount  = async( postId: number) => {
  const count = await Like.count({
    where: {
      postId
    }
  });
  return count;
};
