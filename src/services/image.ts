import ProfileImage from '../models/profile-image';
import { IImageDetail } from '../interfaces/image';
import { v2 as cloudinary } from 'cloudinary';
import { MediaType } from '../interfaces/post';
import PostMedia from '../models/post-media';

export const createprofileImage = async (
  imageInfo: IImageDetail,
): Promise<ProfileImage | null> => {
  try {
    const result = await ProfileImage.create({
      name: imageInfo.name,
      type: imageInfo.type,
      path: imageInfo.path,
    });
    return result.get().id;
  } catch (e) {
    console.log(e);
    throw Error('프로필 수정을 실패했습니다.');
  }
};
export const deleteProfileImage = async (profileimgId: number) => {
  const profileImage = await ProfileImage.findByPk(profileimgId);
  const imgId = profileImage?.dataValues.name;
  cloudinary.uploader.destroy(imgId, function (result: any) {
    console.log(result)
  });
  await ProfileImage.destroy({
    where: {
      id: profileimgId,
    },
  });
};

export const postImage = async (mediaInfo: MediaType[]) => {
  const postData = mediaInfo.map((info) => ({
    name: info.name,
    path: info.path,
    type: info.type,
  }));
  const result = await PostMedia.bulkCreate(postData);
  return result;
};

// 게시물 이미지 삭제
export const deletePostImage = async (postId: number) => {
  const media = await PostMedia.findAll({
    where: { postId: postId },
  });
  media.map((media) => {
    cloudinary.uploader.destroy(
      media.dataValues.name,
      function (result: any) {},
    );
  });
};
