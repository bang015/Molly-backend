import PostTag from "../models/post-tag";
import Tag from "../models/tag";

export const findOrCreateTag = async (tagName: string) => {
  const existingTag = await Tag.findOne({ where: { name: tagName } });
  if (existingTag) {
    return existingTag.id;
  } else {
    const newTag = await Tag.create({ name: tagName });
    return newTag.id;
  }
};

export const postTag = async (
  postTagData: { PostId: number; TagId: number }[]
) => {
  PostTag.bulkCreate(postTagData);
};
