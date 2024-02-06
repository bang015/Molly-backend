import Comment from "../models/comment";
import ProfileImage from "../models/profile-image";
import User from "../models/user";

export const createComment = async (
  postId: number,
  commentId: number | null = null,
  userId: number,
  content: string
) => {
  await Comment.create({
    postId: postId,
    userId: userId,
    commentId: commentId,
    content: content,
  });
};

export const getComment = async (postId: number, page:number = 1, limit: number = 15) => {
  const offset = limit * (page - 1);
  const result = await Comment.findAll({
    where: {
      postId: postId,
      commentId: null,
    },
    include: {
      model: User,
      as: "user",
      attributes: ["nickname"],
      include: [{ model: ProfileImage, attributes: ["path"] }],
    },
    offset,
    limit,
    order: [['createdAt', 'DESC']],
  });
  const commentList = result.map((comment) => {
    const commentInfo = comment.dataValues;
    const userInfo = commentInfo.user.dataValues;
    const profileInfo = userInfo.ProfileImage.dataValues;
    // const crAt = new Date(commentInfo.createdAt);
    // const upAt = new Date(commentInfo.updatedAt);
    return {
      id: commentInfo.id,
      postId: commentInfo.postId,
      userId: commentInfo.userId,
      content: commentInfo.content,
      commentId: commentInfo.commentId,
      createdAt: commentInfo.createdAt,
      updatedAt: commentInfo.updatedAt,
      nickname: userInfo.nickname,
      profileImage: profileInfo.path,
    };
  });
  return commentList;
};
