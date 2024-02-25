import Bookmark from "../models/bookmark";

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
