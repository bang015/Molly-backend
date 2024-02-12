import Comment from "../models/comment";
import ProfileImage from "../models/profile-image";
import User from "../models/user";

export const createComment = async (
  postId: number,
  commentId: number | null = null,
  userId: number,
  content: string
) => {
  const newComment = await Comment.create({
    postId: postId,
    userId: userId,
    commentId: commentId,
    content: content,
  });
  const result = await Comment.findOne({
    where: { id: newComment.id },
    include: {
      model: User,
      as: "user",
      attributes: ["nickname"],
      include: [{ model: ProfileImage, attributes: ["path"] }],
    },
  });
  if (result) {
    const commentInfo = result.dataValues;
    const userInfo = commentInfo.user.dataValues;
    const profileInfo = userInfo.ProfileImage.dataValues;
    const subcommentCount = await Comment.count({
      where: {
        commentId: commentInfo.id,
      },
    });
    const comment = {
      id: commentInfo.id,
      postId: commentInfo.postId,
      userId: commentInfo.userId,
      content: commentInfo.content,
      commentId: commentInfo.commentId,
      createdAt: commentInfo.createdAt,
      updatedAt: commentInfo.updatedAt,
      nickname: userInfo.nickname,
      profileImage: profileInfo.path,
      subcommentCount: subcommentCount,
    };
    return comment;
  } else {
    return null;
  }
};

export const getComment = async (
  postId: number,
  page: number = 1,
  limit: number = 15
) => {
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
    order: [["createdAt", "DESC"]],
  });
  const totalComments = await Comment.count({
    where: {
      postId: postId,
      commentId: null,
    },
  });
  const totalPages = Math.ceil(totalComments / limit);
  const commentList = await Promise.all(
    result.map(async (comment) => {
      const commentInfo = comment.dataValues;
      const userInfo = commentInfo.user.dataValues;
      const profileInfo = userInfo.ProfileImage.dataValues;
      const subcommentCount = await Comment.count({
        where: {
          commentId: commentInfo.id,
        },
      });
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
        subcommentCount: subcommentCount,
      };
    })
  );
  return { commentList, totalPages };
};

export const getSubComment = async (
  postId: number,
  id: number,
  page: number = 1,
  limit: number = 3
) => {
  const offset = limit * (page - 1);
  const result = await Comment.findAll({
    where: {
      postId: postId,
      commentId: id,
    },
    include: {
      model: User,
      as: "user",
      attributes: ["nickname"],
      include: [{ model: ProfileImage, attributes: ["path"] }],
    },
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });
  const comment = result.map((comment) => {
    const commentInfo = comment.dataValues;
    const userInfo = commentInfo.user.dataValues;
    const profileInfo = userInfo.ProfileImage.dataValues;
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
  return comment;
};

export const checkCommentUser = async(id: number, userId: number) => {
  const result = await Comment.findByPk(id)
  if(result){
    if(result.dataValues.userId === userId){
      return true;
    }else{
      return false;
    }
  }
  return false
};

export const deleteComment = async(id: number) => {
  const result = await Comment.destroy({
    where: {
      id: id
    }
  });
  return result;
}
