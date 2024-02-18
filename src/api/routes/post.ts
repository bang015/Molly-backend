import { Router, Request, Response, NextFunction } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { checkJWT } from "../middleware/checkJwt";
import { uploadPostMedias } from "../middleware/multer";
import { IJwtRequest } from "../../interfaces/auth";
import User from "../../models/user";
import {
  getAllPost,
  getMainPost,
  getPostByPostId,
  postDelete,
  postUserCheck,
  uploadPost,
} from "../../services/post";
import { MediaDetil } from "../../interfaces/post";
import { postImage } from "../../services/image";
import { findOrCreateTag, postTag } from "../../services/tag";
import { selectFollowing } from "../../services/follow";

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
        if (req.body.hashtags) {
          const tagNames = req.body.hashtags;
          const postTagData = [];
          for (const tag of tagNames) {
            const tagId = await findOrCreateTag(tag);
            postTagData.push({ PostId: postId, TagId: tagId });
          }
          await postTag(postTagData);
        }
      }
      return res.status(200).json("게시물이 공유 되었습니다.");
    } catch {
      return res.status(401).json("게시물 업로드를 실패했습니다.");
    }
  }
);
postRouter.get(
  "/:userId",
  async(req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const {page} = req.query as any;
    const followedUsers = await selectFollowing(userId);
    let userIds = []
    if(followedUsers){
      userIds = followedUsers.map(follow => follow.userId);
    };
    userIds.push(userId);
    const response = await getMainPost(userIds, page);
    return res.status(200).json(response);
  }
)
postRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const { page } = req.query as any;
  try {
    const allPost = await getAllPost(page);
    if (allPost) {
      return res.status(200).json(allPost);
    }
  } catch (err) {
    throw err;
  }
});

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

postRouter.delete("/:id", checkJWT, async (req: IJwtRequest, res: Response) => {
  const userId = req.decoded?.id;
  const postId = parseInt(req.params.id, 10);
  console.log(userId, postId);
  if (userId) {
    const check = await postUserCheck(postId, userId);
    if (check) {
      postDelete(postId);
    }
  }
});
export default postRouter;
