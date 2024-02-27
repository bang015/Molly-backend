import Bookmark from "../models/bookmark";
import Post from "../models/post";
import PostMedia from "../models/post-media";

export const bookmarkPost = async (postId: number, userId: number) => {
  await Bookmark.create({
    postId,
    userId,
  });
};
export const unBookmarkPost = async (postId: number, userId: number) => {
  await Bookmark.destroy({
    where: {
      postId,
      userId,
    },
  });
};
export const checkPostBookmark = async (postId: number, userId: number) => {
  const result = await Bookmark.findOne({
    where: {
      postId,
      userId,
    },
  });
  return !!result;
};

export const getBookmarkPost = async (
  userId: number,
  page: number = 1,
  limit: number = 12
) => {
  const offset = limit * (page - 1);
  const result = await Bookmark.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: Post,
        attributes: ["id", "createdAt"],
        include: [
          {
            model: PostMedia,
            attributes: ["id", "path"],
          },
        ],
      },
    ],
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });
  const bookmarkList = result.map((bookmark) => {
    const bookmarkInfo = bookmark.dataValues;
    const postInfo = bookmarkInfo.Post.dataValues;
    const mediaInfo = postInfo.PostMedia
    const mediaList = mediaInfo.map((media: any) => {
      return {
        mediaId: media.id,
        mediaPath: media.path,
      };
    })
    return {
      id: postInfo.id,
      mediaList: mediaList,
    };
  });
  return bookmarkList;
};
