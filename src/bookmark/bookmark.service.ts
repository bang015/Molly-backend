import Bookmark from './models/bookmark.model';

// 북마크 추가
export const addBookmark = async (postId: number, userId: number) => {
  await Bookmark.create({
    postId,
    userId,
  });
};

// 북마크 삭제
export const removeBookmark = async (postId: number, userId: number) => {
  await Bookmark.destroy({
    where: {
      postId,
      userId,
    },
  });
};

// 북마크 상태 확인
export const isBookmarked = async (postId: number, userId: number) => {
  const result = await Bookmark.findOne({
    where: {
      postId,
      userId,
    },
  });
  return !!result;
};
