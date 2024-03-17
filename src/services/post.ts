import { Op, Sequelize } from "sequelize";
import Post from "../models/post";
import PostMedia from "../models/post-media";
import ProfileImage from "../models/profile-image";
import User from "../models/user";
import PostTag from "../models/post-tag";

export const uploadPost = async (userId: number, content: string) => {
  const newPost = await Post.create({
    userId: userId,
    content: content,
  });
  return newPost.id;
};

export const getAllPost = async (
  userIds: number[],
  page: number = 1,
  limit: number = 30
) => {
  const offset = limit * (page - 1);
  const result = await Post.findAll({
    attributes: ["id", "createdAt"],
    where: {
      userId: {
        [Op.notIn]: userIds,
      },
    },
    include: [
      {
        model: PostMedia,
        attributes: ["id", "path"],
      },
    ],
    offset,
    limit,
    order: Sequelize.literal("RAND()"),
  });

  const postList = result.map((post) => {
    return post.toJSON();
  });

  return postList;
}; 

export const getMainPost = async (
  userIds: number[] | number,
  page: number = 1,
  limit: number = 5
) => {
  const offset = limit * (page - 1);

  const result = await Post.findAll({
    where: {
      userId: userIds,
    },
    include: [
      {
        model: PostMedia,
        attributes: ["id", "path"],
      },
      {
        model: User,
        attributes: ["nickname"],
        include: [{ model: ProfileImage, attributes: ["path"] }],
      },
    ],
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });
  if (result) {
    const totalPost = await Post.count({
      where: {
        userId: userIds,
      },
    });
    const totalPages = Math.ceil(totalPost / limit);
    const post = result.map((post) => {
      return post.toJSON();
    });
    return { post, totalPages };
  } else {
    return null;
  }
};

export const getPostByTag = async (
  tagId: number,
  page: number = 1,
  limit: number = 30
) => {
  const offset = limit * (page - 1);
  const result = await PostTag.findAll({
    attributes: [],
    where: { TagId: tagId },
    include: [
      {
        model: Post,
        include: [{ model: PostMedia, attributes: ["id", "path"] }],
      },
    ],
    offset,
    limit,
  });
  if (result) {
    const post = result.map((post) => {
      return post.toJSON().Post;
    });
    return post;
  } else {
    return null;
  }
};

export const getPostByPostId = async (id: number) => {
  const result = await Post.findOne({
    include: [
      {
        model: PostMedia,
        attributes: ["id", "path"],
      },
      {
        model: User,
        attributes: ["nickname"],
        include: [{ model: ProfileImage, attributes: ["path"] }],
      },
    ],
    where: { id: id },
  });
  if (result) {
    return result.toJSON();
  } else {
    return null;
  }
};

export const postUserCheck = async (postId: number, userId: number) => {
  const result = await Post.findOne({
    where: {
      id: postId,
      userId,
    },
  });
  return !!result;
};

export const postUpdate = async (postId: number, content: string) => {
  const [update] = await Post.update(
    { content: content },
    {
      where: {
        id: postId,
      },
    }
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

export const postDelete = async (postId: number) => {
  const result = await Post.destroy({
    where: {
      id: postId,
    },
  });
  return result;
};

export const postCount = async (userId: number) => {
  const result = await Post.count({
    where: {
      userId,
    },
  });
  return result;
};
