import { Op, Sequelize } from 'sequelize';
import Post from '../models/post';
import PostMedia from '../models/post-media';
import ProfileImage from '../models/profile-image';
import User from '../models/user';
import PostTag from '../models/post-tag';
import sequelize from '../common/config/database';
import { CreatePostInput, MediaType } from '../interfaces/post';
import Tag from '../models/tag';
import Bookmark from '../models/bookmark.modal';
// 게시물 생성
export const createPost = async (
  postData: CreatePostInput,
  mediaDatas: MediaType[],
  tagNames: string[],
) => {
  const transaction = await sequelize.transaction();
  try {
    const newPost = await Post.create({ ...postData }, { transaction });
    const mediaPromises = mediaDatas.map((media) => {
      return PostMedia.create(
        { ...media, postId: newPost.id },
        { transaction },
      );
    });
    await Promise.all(mediaPromises);
    const tagPromises = tagNames.map(async (tagName) => {
      const [tag, created] = await Tag.findOrCreate({
        where: { name: tagName },
        defaults: { name: tagName },
        transaction,
      });
      return tag;
    });
    const tags = await Promise.all(tagPromises);
    const postTagPromises = tags.map((tag) => {
      return PostTag.create(
        { postId: newPost.id, tagId: tag.id },
        { transaction },
      );
    });
    await Promise.all(postTagPromises);
    await transaction.commit();
    return newPost;
  } catch (e) {
    await transaction.rollback();
    throw Error('게시물 업로드를 실패했습니다.');
  }
};

// 추천 게시물
export const explorePostList = async (
  userIds: number[],
  page: number = 1,
  limit: number = 30,
) => {
  const offset = limit * (page - 1);
  const result = await Post.findAll({
    attributes: ['id', 'createdAt'],
    where: {
      userId: {
        [Op.notIn]: userIds,
      },
    },
    include: [
      {
        model: PostMedia,
        attributes: ['id', 'path'],
      },
    ],
    offset,
    limit,
    order: Sequelize.literal('RAND()'),
  });

  const postList = result.map((post) => {
    return post.toJSON();
  });

  return postList;
};
// 게시물
export const postList = async (
  userIds: number[] | number,
  page: number = 1,
  limit: number = 5,
) => {
  const offset = limit * (page - 1);
  const result = await Post.findAndCountAll({
    where: {
      userId: userIds,
    },
    include: [
      {
        model: PostMedia,
        attributes: ['id', 'path'],
      },
      {
        model: User,
        as: 'user',
        attributes: ['nickname'],
        include: [{ model: ProfileImage, attributes: ['path'] }],
      },
    ],
    offset,
    limit,
    order: [['createdAt', 'DESC']],
  });
  if (!result) {
    return null;
  }
  const totalPages = Math.ceil(result.count / limit);
  const post = result.rows.map((post) => {
    return post.toJSON();
  });
  return { post, totalPages };
};
// 게시물 태그 검색
export const getPostByTag = async (
  tagName: string,
  page: number = 1,
  limit: number = 20,
) => {
  const offset = limit * (page - 1);
  const result = await Tag.findAll({
    attributes: [],
    where: { name: tagName },
    include: [
      {
        model: Post,
        as: 'posts',
        include: [{ model: PostMedia, attributes: ['id', 'path'] }],
      },
    ],
    offset,
    limit,
  });
  if (!result) {
    throw Error('게시물이 존재하지않습니다.');
  }
  const post = result.map((post) => {
    return post.toJSON().Post;
  });
  return post;
};

export const bookmarkPostList = async (
  userId: number,
  page: number = 1,
  limit: number = 12,
) => {
  const offset = limit * (page - 1);
  const result = await Bookmark.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: Post,
        attributes: ['id', 'createdAt'],
        include: [
          {
            model: PostMedia,
            attributes: ['id', 'path'],
          },
        ],
      },
    ],
    offset,
    limit,
    order: [['createdAt', 'DESC']],
  });
  if (!result) {
    throw Error('게시물이 존재하지않습니다.');
  }
  const bookmarkList = result.map((bookmark) => {
    return bookmark.toJSON().Post;
  });
  return bookmarkList;
};
// 게시물 상세정보
export const getPost = async (id: number) => {
  const result = await Post.findOne({
    where: { id: id },
    include: [
      {
        model: PostMedia,
        attributes: ['id', 'path'],
      },
      {
        model: User,
        as: 'user',
        attributes: ['nickname'],
        include: [{ model: ProfileImage, attributes: ['path'] }],
      },
    ],
  });
  if (!result) {
    throw Error('존재하지 않는 게시물입니다.');
  }
  return result.toJSON();
};
// 게시물 권한 확인
export const verifyPostUser = async (postId: number, userId: number) => {
  const post = await Post.findOne({
    where: {
      id: postId,
      userId,
    },
  });
  if (!post) {
    throw Error('권한이 없습니다.');
  }
};
// 게시물 수정
export const postUpdate = async (postId: number, content: string) => {
  const [update] = await Post.update(
    { content: content },
    {
      where: {
        id: postId,
      },
    },
  );
  if (update === 1) {
    const result = await Post.findOne({
      where: {
        id: postId,
      },
    });
    return result?.dataValues.content;
  }
};
// 게시물 삭제
export const postDelete = async (postId: number) => {
  const result = await Post.destroy({
    where: {
      id: postId,
    },
  });
  return result;
};
