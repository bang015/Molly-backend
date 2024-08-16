import { Op } from 'sequelize';
import Comment from './models/comment.model';
import { Sequelize } from 'sequelize-typescript';
import User from '../user/models/user.model';
import ProfileImage from '../user/models/profile-image.model';

// 댓글 생성
export const createComment = async (
  postId: number,
  commentId: number | null = null,
  userId: number,
  content: string,
) => {
  try {
    const newComment = await Comment.create({
      postId: postId,
      userId: userId,
      commentId: commentId,
      content: content,
    });
    return newComment.get();
  } catch (e) {
    throw Error('댓글 생성을 실패했습니다.');
  }
};

// 댓글 상세 정보
export const getComment = async (id: number) => {
  try {
    const result = await Comment.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['nickname'],
          include: [{ model: ProfileImage, attributes: ['path'] }],
        },
        {
          model: Comment,
          as: 'subComments',
          attributes: [],
        },
      ],
      subQuery: false,
      attributes: {
        include: [
          [
            Sequelize.fn('COUNT', Sequelize.col('subComments.id')),
            'subCommentsCount',
          ],
        ],
      },
      group: ['Comment.id', 'user.id'],
    });
    return result.get();
  } catch (e) {
    throw Error('댓글 정보를 가져오는데 실패했습니다.');
  }
};

// 댓글 목록
export const commentList = async (
  postId: number,
  userId: number,
  page: number = 1,
  limit: number = 15,
) => {
  const offset = limit * (page - 1);
  try {
    const result = await Comment.findAndCountAll({
      where: {
        postId: postId,
        userId: { [Op.ne]: userId },
        commentId: null,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['nickname'],
          include: [{ model: ProfileImage, attributes: ['path'] }],
        },
        {
          model: Comment,
          as: 'subComments',
          attributes: [],
        },
      ],
      subQuery: false,
      attributes: {
        include: [
          [
            Sequelize.fn('COUNT', Sequelize.col('subComments.id')),
            'subCommentsCount',
          ],
        ],
      },
      group: ['Comment.id', 'user.id', 'user->ProfileImage.id'],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
      distinct: true,
    });
    const totalPages = Math.ceil(result.count.length / limit);
    const commentList = result.rows.map((comment) => ({
      ...comment.toJSON(),
    }));
    return { commentList, totalPages };
  } catch (e) {
    throw Error('댓글을 가져오는데 실패했습니다.');
  }
};

// 본인이 작성한 댓글목록
export const getMyCommentByPost = async (userId: number, postId: number) => {
  try {
    const result = await Comment.findAll({
      where: {
        postId: postId,
        userId: userId,
        commentId: null,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['nickname'],
          include: [{ model: ProfileImage, attributes: ['path'] }],
        },
        {
          model: Comment,
          as: 'subComments',
          attributes: [],
        },
      ],
      subQuery: false,
      attributes: {
        include: [
          [
            Sequelize.fn('COUNT', Sequelize.col('subComments.id')),
            'subCommentsCount',
          ],
        ],
      },
      group: ['Comment.id', 'user.id', 'user->ProfileImage.id'],
      order: [['createdAt', 'DESC']],
    });
    const comment = result.map((comment) => {
      return comment.toJSON();
    });
    return comment;
  } catch (e) {
    throw Error('댓글을 가져오는데 실패했습니다.');
  }
};

// 대댓글 목록
export const getSubComment = async (
  id: number,
  page: number = 1,
  limit: number = 3,
) => {
  const offset = limit * (page - 1);
  try {
    const result = await Comment.findAll({
      where: {
        commentId: id,
      },
      include: {
        model: User,
        as: 'user',
        attributes: ['nickname'],
        include: [{ model: ProfileImage, attributes: ['path'] }],
      },
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    const comment = result.map((comment) => {
      return comment.toJSON();
    });
    return comment;
  } catch (e) {
    throw Error('대댓글을 가져오는데 실패했습니다.');
  }
};

// 권한 확인
export const verifyCommentUser = async (id: number, userId: number) => {
  const result = await Comment.findOne({
    where: {
      id,
      userId,
    },
  });
  if (!result) {
    throw Error('권한이 없습니다.');
  }
};

// 댓글 삭제
export const deleteComment = async (id: number) => {
  try {
    const result = await Comment.destroy({
      where: {
        id: id,
      },
    });
    return result;
  } catch (e) {
    throw Error('댓글 삭제를 실패했습니다.');
  }
};

// 댓글 수정
export const updateComment = async (id: number, content: string) => {
  try {
    const result = await Comment.update(
      { content: content },
      { where: { id: id } },
    );
    return result[0];
  } catch (e) {
    throw Error('댓글 수정를 실패했습니다.');
  }
};
