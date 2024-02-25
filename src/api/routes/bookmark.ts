import { Router, Request, Response, NextFunction } from "express";
import { checkJWT } from "../middleware/checkJwt";
import { IJwtRequest } from "../../interfaces/auth";
import {
  bookmarkPost,
  checkPostBookmark,
  unBookmarkPost,
} from "../../services/bookmark";

const bookmarkRouter = Router();

bookmarkRouter.post("/", checkJWT, async (req: IJwtRequest, res: Response) => {
  const userId = req.decoded?.id;
  const { postId } = req.body;
  if (userId) {
    const check = await checkPostBookmark(postId, userId);
    if (check) {
      await unBookmarkPost(postId, userId);
    } else {
      await bookmarkPost(postId, userId);
    }
    const result = await checkPostBookmark(postId, userId);
    return res.status(200).json(result);
  }
});
bookmarkRouter.get(
  "/:postId",
  checkJWT,
  async (req: IJwtRequest, res: Response) => {
    const userId = req.decoded?.id;
    const postId = parseInt(req.params.postId, 10);
    if (userId) {
      const checkBookmark = await checkPostBookmark(postId, userId);
      return res.status(200).json(checkBookmark);
    }
  }
);

export default bookmarkRouter;
