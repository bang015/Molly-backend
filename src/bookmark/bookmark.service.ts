import Bookmark from '../models/bookmark.modal';

export const addBookmark = async (postId: number, userId: number) => {
  await Bookmark.create({
    postId,
    userId,
  });
};
export const removeBookmark = async (postId: number, userId: number) => {
  await Bookmark.destroy({
    where: {
      postId,
      userId,
    },
  });
};
export const isBookmarked = async (postId: number, userId: number) => {
  const result = await Bookmark.findOne({
    where: {
      postId,
      userId,
    },
  });
  return !!result;
};
