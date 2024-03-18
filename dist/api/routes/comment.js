"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkJwt_1 = require("../middleware/checkJwt");
const celebrate_1 = require("celebrate");
const comment_1 = require("../../services/comment");
const commentRouter = (0, express_1.Router)();
// post comment
commentRouter.post("/", checkJwt_1.checkJWT, (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        postId: celebrate_1.Joi.number().required(),
        commentId: celebrate_1.Joi.number().allow(null),
        content: celebrate_1.Joi.string().required(),
    }),
}), async (req, res, next) => {
    const userId = req.decoded?.id;
    const { postId, commentId, content } = req.body;
    const newComment = await (0, comment_1.createComment)(postId, commentId, userId, content);
    res.status(200).json(newComment);
});
//get comment
commentRouter.get("/:userId/:postId", async (req, res, next) => {
    const userId = parseInt(req.params.userId, 10);
    const postId = parseInt(req.params.postId, 10);
    const { page } = req.query;
    const response = await (0, comment_1.getComment)(postId, userId, page);
    if (response) {
        return res.status(200).json(response);
    }
});
//get subComment
commentRouter.get("/sub/:postId/:id", async (req, res, next) => {
    const postId = parseInt(req.params.postId, 10);
    const id = parseInt(req.params.id, 10);
    const { page } = req.query;
    const response = await (0, comment_1.getSubComment)(postId, id, page);
    if (response) {
        return res.status(200).json(response);
    }
});
//get myCommentbyPost
commentRouter.get("/my/:userId/:postId", async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const postId = parseInt(req.params.postId, 10);
    const response = await (0, comment_1.getMyCommentByPost)(userId, postId);
    return res.status(200).json(response);
});
// edit comment
commentRouter.patch("/:id", checkJwt_1.checkJWT, async (req, res, next) => {
    const userId = req.decoded?.id;
    const id = parseInt(req.params.id, 10);
    const { content } = req.body;
    if (userId) {
        const checkUserId = await (0, comment_1.checkCommentUser)(id, userId);
        if (checkUserId) {
            const update = await (0, comment_1.updateComment)(id, content);
            if (update > 0) {
                const response = await (0, comment_1.getCommentById)(id);
                return res.status(200).json(response);
            }
        }
    }
});
// delete comment
commentRouter.delete("/:id", checkJwt_1.checkJWT, async (req, res, next) => {
    const userId = req.decoded?.id;
    const id = parseInt(req.params.id, 10);
    if (userId) {
        const checkUserId = await (0, comment_1.checkCommentUser)(id, userId);
        if (checkUserId) {
            const delet = await (0, comment_1.deleteComment)(id);
            if (delet > 0) {
                return res.status(200).json(id);
            }
        }
    }
    return res.status(401).json(null);
});
exports.default = commentRouter;
