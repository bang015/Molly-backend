import Like from "../models/like"


export const checkLikedPost = async(postId: number, userId: number) => {
  const result = await Like.findOne({
    where: {
      postId,
      userId
    }
  });
  return !!result;
};

export const addLikePost = async(postId: number, userId: number) => {
  await Like.create({
    postId,
    userId
  });
};

export const unLikePost = async(postId: number, userId: number) => {
  await Like.destroy({
    where: {
      postId,
      userId
    }
  });
};

export const postLikeCount = async( postId: number) => {
  const count = await Like.count({
    where: {
      postId
    }
  });
  return count;
};
