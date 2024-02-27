import { Op } from "sequelize";
import Post from "../models/post";
import PostMedia from "../models/post-media";
import ProfileImage from "../models/profile-image";
import User from "../models/user";

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
    order: [["createdAt", "DESC"]],
  });

  const postList = result.map((post) => {
    const postInfo = post.dataValues;
    const mediaInfo = post.dataValues.PostMedia;
    const mediaList = mediaInfo.map((media: any) => {
      return {
        mediaId: media.id,
        mediaPath: media.path,
      };
    });
    return {
      id: postInfo.id,
      mediaList: mediaList,
    };
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
      const data = post.dataValues;
      const mediaList = data.PostMedia.map((media: any) => {
        return {
          mediaId: media.dataValues.id,
          mediaPath: media.dataValues.path,
        };
      });
      return {
        id: data.id,
        userId: data.userId,
        content: data.content,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        nickname: data.User.dataValues.nickname,
        profileImage: data.User.ProfileImage,
        mediaList: mediaList,
      };
    });
    return { post, totalPages };
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
    const data = result.dataValues;

    const mediaList = data.PostMedia.map((media: any) => {
      return {
        mediaId: media.dataValues.id,
        mediaPath: media.dataValues.path,
      };
    });
    const post = {
      id: data.id,
      userId: data.userId,
      content: data.content,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      nickname: data.User.dataValues.nickname,
      profileImage: data.User.ProfileImage,
      mediaList: mediaList,
    };
    return post;
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

export const postCount = async(userId: number) => {
  const result = await Post.count({
    where: {
      userId
    }
  });
  return result;
}