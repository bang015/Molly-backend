import PostTag from "../models/post-tag";
import Tag from "../models/tag";

export const findOrCreateTag  =async (tagName:string) => {
  try{
    const existingTag  = await Tag.findOne({ where: {name: tagName}})
    if(existingTag) {
      return existingTag.id;
    }else{
      const newTag = await Tag.create({name: tagName});
      return newTag.id
    }
  }catch(err){
    throw new Error('Failed to find/create tag.');
  }
}

export const postTag =async (postTagData:{PostId:number, TagId: number}[]) => {
  try{
    PostTag.bulkCreate(postTagData)
  }catch(err){
    throw new Error("Failed to postTag")
  }
}