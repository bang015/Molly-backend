import { Router, Request, Response, NextFunction } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { checkJWT } from "../middleware/checkJwt";
import { uploadPostMedias } from "../middleware/multer";
import { IJwtRequest } from "../../interfaces/auth";
import User from "../../models/user";
import { findOrCreateTag, postTag, uploadPost } from "../../services/post";
import { MediaDetil } from "../../interfaces/post";
import { postImage } from "../../services/image";

const postRouter = Router();

postRouter.post(
  "/",
  checkJWT,
  uploadPostMedias,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId: number = req.decoded?.id!;
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
      postImage(medias);
      if (req.body.hashtags) {
        const tagNames = req.body.hashtags;
        const postTagData = [];
        for (const tag of tagNames) {
          const tagId = await findOrCreateTag(tag);
          postTagData.push({ PostId: postId, TagId: tagId });
        };
        await postTag(postTagData);
      } 
    } catch {}
  }
);

export default postRouter;
