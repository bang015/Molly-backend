import Post from "../models/post";
import PostMedia from "../models/post-media";
import User from "../models/user";

export const uploadPost = async (userId: number, content: string) => {
  try {
    const newPost = await Post.create({
      userId: userId,
      content: content,
    });
    return newPost.id;
  } catch (err) {
    throw new Error("Failed to upload post.");
  }
};

export const getAllPost = async (page: number = 1, limit: number = 30) => {
  try {
    const offset = limit * (page - 1);
    const result = await Post.findAll({
      attributes: ["id", "userId", "content", "createdAt", "updatedAt"],
      include: [
        {
          model: PostMedia,
          attributes: ["id", "path"],
        },
        {
          model: User,
          attributes: ["nickname"],
        },
      ],
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    const postList = result.map((post) => {
      const userInfo = post.dataValues.User.dataValues;
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
        userId: postInfo.userId,
        nickname: userInfo.nickname,
        content: postInfo.content,
        createdAt: postInfo.createdAt,
        updatedAt: postInfo.updatedAt,
        mediaList: mediaList
      }
    });
    
    return postList;
  } catch (err) {
    throw err;
  }
};

export const getMainPost = async (userId: number) => {
  try {
  } catch (err) {}
};
