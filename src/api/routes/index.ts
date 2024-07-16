import { Router } from "express";
import users from "../../user/user.routes";
import auth from "../../auth/auth.routes";
import post from "../../post/post.routes";
import follow from "./follow";
import comment from "./comment";
import like from "./like";
import bookmark from "./bookmark";
import search from "./search";
const router = Router();

router.use("/users", users);
router.use("/auth", auth);
router.use("/post", post);
router.use("/follow", follow);
router.use("/comment", comment);
router.use("/like", like);
router.use("/Bookmark", bookmark);
router.use("/search", search);
export default router;
