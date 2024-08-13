import { Op, Sequelize, where } from 'sequelize';
import sequelize from '../common/config/database';
import { v2 as cloudinary } from 'cloudinary';
import Post from './models/post.model';
import PostMedia from './models/post-media.model';
import Tag from './models/tag.model';
import PostTag from './models/post-tag.model';
import User from '../user/models/user.model';
import ProfileImage from '../user/models/profile-image.model';
import Bookmark from '../bookmark/models/bookmark.model';
import { CreatePostInput, MediaType } from './post.interfaces';

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
    return newPost.get();
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
  try {
    const result = await Post.findAndCountAll({
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
    const totalPages = Math.ceil(result.count / limit);
    const postList = result.rows.map((post) => {
      return post.toJSON();
    });
    return { postList, totalPages };
  } catch (e) {
    throw Error('게시물을 가져오는데 실패했습니다.');
  }
};

// 게시물
export const postList = async (
  userIds: number[] | number,
  page: number = 1,
  limit: number = 5,
) => {
  const offset = limit * (page - 1);
  try {
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
    const postList = result.rows.map((post) => {
      return post.toJSON();
    });
    return { postList, totalPages };
  } catch (e) {
    throw Error('게시물을 가져오는데 실패했습니다.');
  }
};

// 게시물 태그 검색
export const getPostByTag = async (
  tagName: string,
  page: number = 1,
  limit: number = 20,
) => {
  const offset = limit * (page - 1);
  const result = await Tag.findAndCountAll({
    attributes: [],
    where: { name: tagName },
    include: [
      {
        model: Post,
        as: 'posts',
        through: { attributes: [] },
        include: [{ model: PostMedia, attributes: ['id', 'path'] }],
      },
    ],
    offset,
    limit,
  });
  if (!result) {
    throw Error('게시물이 존재하지않습니다.');
  }
  const totalPages = Math.ceil(result.count / limit);

  const postList = result.rows.flatMap((post) => {
    return post.get('posts').map((p) => p.toJSON());
  });
  console.log(postList)
  return { postList, totalPages, tagCount: result.count };
};

// 북마크
export const bookmarkPostList = async (
  userId: number,
  page: number = 1,
  limit: number = 12,
) => {
  const offset = limit * (page - 1);
  try {
    const result = await Bookmark.findAndCountAll({
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
    const totalPages = Math.ceil(result.count / limit);
    const postList = result.rows.map((post) => {
      return post.toJSON();
    });
    return { postList, totalPages };
  } catch (e) {
    throw Error('게시물을 가져오는데 실패했습니다.');
  }
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
export const postUpdate = async (
  postId: number,
  content: string,
  hashtags: string[],
) => {
  const transaction = await sequelize.transaction();
  try {
    const [updatedPost] = await Post.update(
      { content },
      { where: { id: postId }, transaction },
    );
    const existingTag = await PostTag.findAll({
      where: { postId },
      attributes: ['tagId'],
    }).then((tags) => tags.map((t) => t.toJSON().tagId));
    await PostTag.destroy({
      where: { postId },
      transaction,
    });
    await deleteUnusedTag(existingTag);
    const newTags = await Promise.all(
      hashtags.map((tagName) =>
        Tag.findOrCreate({
          where: { name: tagName },
          defaults: { name: tagName },
          transaction,
        }).then(([tag, created]) => tag),
      ),
    );
    await PostTag.bulkCreate(
      newTags.map((tag) => ({
        postId,
        tagId: tag.dataValues.id,
      })),
      { transaction },
    );
    await transaction.commit();
    if (updatedPost > 0) {
      return await Post.findOne({
        where: { id: postId },
        attributes: ['id', 'content'],
      }).then((post) => post.get());
    }
  } catch (e) {
    await transaction.rollback();
    throw Error('게시물 수정을 실패했습니다.');
  }
};

// 게시물 삭제
export const postDelete = async (postId: number) => {
  try {
    const existingTag = await PostTag.findAll({
      where: { postId },
      attributes: ['tagId'],
    }).then((tags) => tags.map((t) => t.toJSON().tagId));
    const result = await Post.destroy({
      where: {
        id: postId,
      },
    });
    if (result > 0) {
      await deleteUnusedTag(existingTag);
    }
    return result;
  } catch (e) {
    throw Error('게시물 삭제를 실패했습니다.');
  }
};

// 미사용 태그 삭제
export const deleteUnusedTag = async (tags: number[]) => {
  tags.forEach(async (tag) => {
    const tagExists = await PostTag.findOne({ where: { TagId: tag } });
    if (!tagExists) {
      await Tag.destroy({
        where: {
          id: tag,
        },
      });
    }
  });
};

// 게시물 이미지 삭제
export const deletePostImage = async (postId: number) => {
  const media = await PostMedia.findAll({
    where: { postId: postId },
  });
  media.map((media) => {
    cloudinary.uploader.destroy(
      media.dataValues.name,
      function (result: any) {},
    );
  });
};
