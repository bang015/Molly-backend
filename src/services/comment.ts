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

export const getComment = async (postId: number) => {
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
  });
  console.log(result);
};
