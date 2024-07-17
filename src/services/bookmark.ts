import Bookmark from '../models/bookmark.modal';
import Post from '../models/post';
import PostMedia from '../models/post-media';

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


