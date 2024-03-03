import ProfileImage from "../models/profile-image";
import { IImageDetail } from "../interfaces/image";
import { v2 as cloudinary } from "cloudinary";
import { MediaDetil } from "../interfaces/post";
import PostMedia from "../models/post-media";

export const profileImage = async (
  imageInfo: IImageDetail
): Promise<ProfileImage | null> => {
  await ProfileImage.create({
    name: imageInfo.name,
    type: imageInfo.type,
    path: imageInfo.path,
  });
  const imageid = await ProfileImage.findOne({
    where: { name: imageInfo.name },
    attributes: ["id"],
  });
  return imageid;
};
export const deleteProfileImage = async (profileimgId: number) => {
  const profileImage = await ProfileImage.findByPk(profileimgId);
  const imgId = profileImage?.dataValues.name;
  cloudinary.uploader.destroy(imgId, function (result: any) {
    console.log(result);
  });
  await ProfileImage.destroy({
    where: {
      id: profileimgId,
    },
  });
};

export const postImage = async (mediaInfo: MediaDetil[]) => {
  const postData = mediaInfo.map((info) => ({
    postId: info.postId,
    name: info.name,
    path: info.path,
    type: info.type,
  }));
  const result = await PostMedia.bulkCreate(postData);
  return result;
};
export const deletePostImage = async (postId: number) => {
  const postImg = await PostMedia.findAll({
    where: { postId: postId },
  });
  postImg.map((media) => {
    cloudinary.uploader.destroy(media.dataValues.name, function (result: any) {
      console.log(result);
    });
  })
};
