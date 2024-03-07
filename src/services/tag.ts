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
export const findTagId = async (tagName: string) => {
  const existingTag = await Tag.findOne({ where: { name: tagName } });
  return existingTag?.id;
};

export const postTag = async (
  postTagData: { PostId: number; TagId: number }[]
) => {
  PostTag.bulkCreate(postTagData);
};

export const getPostTag = async (postId: number) => {
  const result = await PostTag.findAll({
    where: {
      PostId: postId,
    },
  });
  return result;
};

export const postTagRemove = async (postId: number) => {
  const result= await PostTag.destroy({
    where: {
      PostId: postId,
    },
  });
  return result;
};

export const checkUsedTagByPost = async(postId: number) => {
  const tag = await PostTag.findAll({
    attributes:["TagId"],
    where: {
      PostId: postId
    }
  });
  const result = tag.map((t) => t.dataValues.TagId);
  return result;
}

export const deleteUnusedTag = async(tags: number[]) => {
  tags.forEach(async (tag) => {
    const check = await PostTag.findOne({where: {TagId: tag}});
    if(!check){
      await Tag.destroy({
        where: {
          id: tag
        }
      });
    }
  })
}