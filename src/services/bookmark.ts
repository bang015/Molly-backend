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
    return bookmark.toJSON().Post;
  });
  return bookmarkList;
};
