import { Op } from "sequelize";
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
    const subcommentCount = await Comment.count({
      where: {
        commentId: commentInfo.id,
      },
    });
    const modifiedComment = {
      ...result.toJSON(),
      subcommentCount: subcommentCount,
    };
    return modifiedComment;
  } else {
    return null;
  }
};

export const getComment = async (
  postId: number,
  userId: number,
  page: number = 1,
  limit: number = 15
) => {
  const offset = limit * (page - 1);
  const result = await Comment.findAll({
    where: {
      postId: postId,
      userId: { [Op.ne]: userId },
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
      const subcommentCount = await Comment.count({
        where: {
          commentId: commentInfo.id,
        },
      });
      const modifiedComment = {
        ...comment.toJSON(),
        subcommentCount: subcommentCount,
      };
      return modifiedComment;
    })
  );
  return { commentList, totalPages };
};
export const getMyCommentByPost = async (userId: number, postId: number) => {
  const result = await Comment.findAll({
    where: {
      postId: postId,
      userId: userId,
      commentId: null,
    },
    include: {
      model: User,
      as: "user",
      attributes: ["nickname"],
      include: [{ model: ProfileImage, attributes: ["path"] }],
    },
    order: [["createdAt", "DESC"]],
  });
  if (result) {
    const commentList = await Promise.all(
      result.map(async (comment) => {
        const commentInfo = comment.dataValues;
        const subcommentCount = await Comment.count({
          where: {
            commentId: commentInfo.id,
          },
        });
        const modifiedComment = {
          ...comment.toJSON(),
          subcommentCount: subcommentCount,
        };
        return modifiedComment;
      })
    );
    return { commentList };
  }
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
    return comment.toJSON();
  });
  return comment;
};

export const checkCommentUser = async (id: number, userId: number) => {
  const result = await Comment.findByPk(id);
  if (result) {
    if (result.dataValues.userId === userId) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

export const getCommentById = async (id: number) => {
  const comment = await Comment.findOne({
    where: {
      id: id,
    },
    include: {
      model: User,
      as: "user",
      attributes: ["nickname"],
      include: [{ model: ProfileImage, attributes: ["path"] }],
    },
  });

  if (comment) {
    const subcommentCount = await Comment.count({
      where: {
        commentId: id,
      },
    });
    
    const modifiedComment = {
      ...comment.toJSON(),
      subcommentCount: subcommentCount,
    };
    
    return modifiedComment;
  }
};

export const deleteComment = async (id: number) => {
  const result = await Comment.destroy({
    where: {
      id: id,
    },
  });
  return result;
};

export const updateComment = async (id: number, content: string) => {
  const result = await Comment.update(
    { content: content },
    { where: { id: id } }
  );
  return result[0];
};
