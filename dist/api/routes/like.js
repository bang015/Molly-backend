"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkJwt_1 = require("../middleware/checkJwt");
const like_1 = require("../../services/like");
const likeRouter = (0, express_1.Router)();
likeRouter.post("/", checkJwt_1.checkJWT, async (req, res) => {
    const userId = req.decoded?.id;
    if (userId) {
        const { postId } = req.body;
        const checkLiked = await (0, like_1.checkLikedPost)(postId, userId);
        if (checkLiked) {
            await (0, like_1.unLikePost)(postId, userId);
        }
        else {
            await (0, like_1.addLikePost)(postId, userId);
        }
        const result = await (0, like_1.checkLikedPost)(postId, userId);
        return res.status(200).json(result);
    }
});
exports.default = likeRouter;
likeRouter.get("/:postId", checkJwt_1.checkJWT, async (req, res) => {
    const userId = req.decoded?.id;
    if (userId) {
        const postId = parseInt(req.params.postId, 10);
        const count = await (0, like_1.postLikeCount)(postId);
        const checkLiked = await (0, like_1.checkLikedPost)(postId, userId);
        return res.status(200).json({ count, checkLiked });
    }
});
