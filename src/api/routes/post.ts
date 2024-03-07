import { Router, Request, Response, NextFunction } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { checkJWT } from "../middleware/checkJwt";
import { uploadPostMedias } from "../middleware/multer";
import { IJwtRequest } from "../../interfaces/auth";
import client from "../../config/redis";
import User from "../../models/user";
import {
  getAllPost,
  getMainPost,
  getPostByPostId,
  getPostByTag,
  postDelete,
  postUpdate,
  postUserCheck,
  uploadPost,
} from "../../services/post";
import { MediaDetil } from "../../interfaces/post";
import { deletePostImage, postImage } from "../../services/image";
import {
  checkUsedTagByPost,
  deleteUnusedTag,
  findOrCreateTag,
  findTagId,
  getPostTag,
  postTag,
  postTagRemove,
} from "../../services/tag";
import { selectFollowing } from "../../services/follow";
import { getBookmarkPost } from "../../services/bookmark";

const postRouter = Router();

postRouter.post(
  "/",
  checkJWT,
  uploadPostMedias,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded?.id;
      if (userId) {
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        const { content } = req.body;
        const postId = await uploadPost(userId, content);
        const medias: MediaDetil[] = (req.files as Express.Multer.File[]).map(
          (file: Express.Multer.File) => {
            return {
              postId: postId,
              name: file.filename,
              path: file.path,
              type: file.mimetype,
            };
          }
        );
        const postMedias = await postImage(medias);
        if (postMedias.length < 0) {
          postDelete(postId);
          return res.status(401).json("게시물 업로드를 실패했습니다.");
        }
        const post = await getPostByPostId(postId);
        if (req.body.hashtags) {
          const tagNames = req.body.hashtags;
          const postTagData = [];
          for (const tag of tagNames) {
            const tagId = await findOrCreateTag(tag);
            postTagData.push({ PostId: postId, TagId: tagId });
          }
          await postTag(postTagData);
        }
        return res
          .status(200)
          .json({ post, message: "게시물이 공유 되었습니다." });
      }
    } catch {
      return res.status(401).json("게시물 업로드를 실패했습니다.");
    }
  }
);
postRouter.patch(
  "/",
  checkJWT,
  uploadPostMedias,
  async (req: IJwtRequest, res: Response) => {
    try {
      const userId = req.decoded?.id;
      const postId = parseInt(req.body.postId);
      const { content } = req.body;
      const { hashtags } = req.body;
      let updatedPost;
      if (userId) {
        const checkUser = await postUserCheck(postId, userId);
        if (checkUser) {
          updatedPost = await postUpdate(postId, content);
          const tags = await checkUsedTagByPost(postId);
          const del =await postTagRemove(postId); 
          if(del > 0){
            deleteUnusedTag(tags);
          }
          if (hashtags) {
            const tagNames = hashtags;
            const postTagData = [];
            for (const tag of tagNames) {
              const tagId = await findOrCreateTag(tag);
              postTagData.push({ PostId: postId, TagId: tagId });
            }
            await postTag(postTagData);
          }
        } else {
          return res.status(401).json("권한이 부족합니다.");
        }
      }
      return res.status(200).json({ postId, updatedPost });
    } catch {
      return res.status(401).json("게시물 수정를 실패했습니다.");
    }
  }
);
postRouter.get("/main/", checkJWT, async (req: IJwtRequest, res: Response) => {
  const userId = req.decoded?.id;
  const { page } = req.query as any;
  if (userId) {
    const followedUsers = await selectFollowing(userId);
    let userIds = [];
    if (followedUsers) {
      userIds = followedUsers.map((follow) => follow.userId);
    }
    userIds.push(userId);
    const response = await getMainPost(userIds, page);
    return res.status(200).json(response);
  }
});
postRouter.get(
  "/",
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded?.id;
      const { page } = req.query as any;
      if (userId) {
        const followedUsers = await selectFollowing(userId);
        let userIds = [];
        if (followedUsers) {
          userIds = followedUsers.map((follow) => follow.userId);
        }
        userIds.push(userId);
        const allPost = await getAllPost(userIds, page);
        if (allPost) {
          return res.status(200).json(allPost);
        }
      }
    } catch (err) {
      throw err;
    }
  }
);

postRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = parseInt(req.params.id, 10);
    try {
      if (postId) {
        const onePost = await getPostByPostId(postId);
        res.status(200).json(onePost);
      }
    } catch (err) {
      return err;
    }
  }
);

postRouter.get(
  "/my/:userId",
  async (req: Request, res: Response )=> {
    const userId = parseInt(req.params.userId, 10);
    const { page } = req.query as any;
    try{
      const post = await getMainPost(userId, page, 12);
      res.status(200).json(post);
    }catch{

    }
  }
);

postRouter.get(
  "/bookmark/:userId",
  async (req: Request, res: Response )=> {
    const userId = parseInt(req.params.userId, 10);
    const { page } = req.query as any;
    try{
      const post = await getBookmarkPost(userId, page, 12);
      res.status(200).json(post);
    }catch{

    }
  }
);
postRouter.get(
  "/tags/:tagName",
  async(req:Request, res: Response) => {
    const {tagName} = req.params;
    const { page } = req.query as any;
    const tagId = await findTagId(tagName);
    if( !tagId ){
      return res.status(401).json({message:"태그를 찾을 수 없습니다."});
    }
    const post = await getPostByTag(tagId, page);
    return res.status(200).json(post);
  }
)
postRouter.delete("/:id", checkJWT, async (req: IJwtRequest, res: Response) => {
  const userId = req.decoded?.id;
  const postId = parseInt(req.params.id, 10);
  if (userId) {
    const check = await postUserCheck(postId, userId);
    if (check) {
      await deletePostImage(postId);
      const response = await postDelete(postId);
      if (response > 0) {
        return res.status(200).json({postId, message: "게시물이 삭제되었습니다."});
      }
    }
  }
});
export default postRouter;
