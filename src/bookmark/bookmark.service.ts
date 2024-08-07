import Bookmark from './models/bookmark.model';

// 북마크 추가
export const addBookmark = async (postId: number, userId: number) => {
  try {
    await Bookmark.create({
      postId,
      userId,
    });
  } catch (e) {
    throw Error('북마크 설정에 실패했습니다.');
  }
};

// 북마크 삭제
export const removeBookmark = async (postId: number, userId: number) => {
  try {
    await Bookmark.destroy({
      where: {
        postId,
        userId,
      },
    });
  } catch (e) {
    throw Error('북마크 설정에 실패했습니다.');
  }
};

// 북마크 상태 확인
export const isBookmarked = async (postId: number, userId: number) => {
  try {
    const result = await Bookmark.findOne({
      where: {
        postId,
        userId,
      },
    });
    return !!result;
  } catch (e) {
    throw Error('북마크 상태를 가져오는데 실패했습니다.');
  }
};
