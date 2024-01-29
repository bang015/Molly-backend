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

export const postImage = async (mediaInfo: MediaDetil[]) => {
  try {
    const postData = mediaInfo.map(info => ({
      postId: info.postId,
      name: info.name,
      path: info.path,
      type: info.type,
    }));
    PostMedia.bulkCreate(postData);
  } catch (err) {
    console.error('Failed to save images:', err);
    throw new Error('Failed to save images.');
  }
};