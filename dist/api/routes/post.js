"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkJwt_1 = require("../middleware/checkJwt");
const multer_1 = require("../middleware/multer");
const user_1 = __importDefault(require("../../models/user"));
const post_1 = require("../../services/post");
const image_1 = require("../../services/image");
const tag_1 = require("../../services/tag");
const follow_1 = require("../../services/follow");
const bookmark_1 = require("../../services/bookmark");
const postRouter = (0, express_1.Router)();
postRouter.post("/", checkJwt_1.checkJWT, multer_1.uploadPostMedias, async (req, res, next) => {
    try {
        const userId = req.decoded?.id;
        if (userId) {
            const user = await user_1.default.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const { content } = req.body;
            const postId = await (0, post_1.uploadPost)(userId, content);
            const medias = req.files.map((file) => {
                return {
                    postId: postId,
                    name: file.filename,
                    path: file.path,
                    type: file.mimetype,
                };
            });
            const postMedias = await (0, image_1.postImage)(medias);
            if (postMedias.length < 0) {
                (0, post_1.postDelete)(postId);
                return res.status(401).json("게시물 업로드를 실패했습니다.");
            }
            const post = await (0, post_1.getPostByPostId)(postId);
            if (req.body.hashtags) {
                const tagNames = req.body.hashtags;
                const postTagData = [];
                for (const tag of tagNames) {
                    const tagId = await (0, tag_1.findOrCreateTag)(tag);
                    postTagData.push({ PostId: postId, TagId: tagId });
                }
                await (0, tag_1.postTag)(postTagData);
            }
            return res
                .status(200)
                .json({ post, message: "게시물이 공유 되었습니다." });
        }
    }
    catch {
        return res.status(401).json("게시물 업로드를 실패했습니다.");
    }
});
postRouter.patch("/", checkJwt_1.checkJWT, multer_1.uploadPostMedias, async (req, res) => {
    try {
        const userId = req.decoded?.id;
        const postId = parseInt(req.body.postId);
        const { content } = req.body;
        const { hashtags } = req.body;
        let updatedPost;
        if (userId) {
            const checkUser = await (0, post_1.postUserCheck)(postId, userId);
            if (checkUser) {
                updatedPost = await (0, post_1.postUpdate)(postId, content);
                const tags = await (0, tag_1.checkUsedTagByPost)(postId);
                const del = await (0, tag_1.postTagRemove)(postId);
                if (hashtags) {
                    const tagNames = hashtags;
                    const postTagData = [];
                    for (const tag of tagNames) {
                        const tagId = await (0, tag_1.findOrCreateTag)(tag);
                        postTagData.push({ PostId: postId, TagId: tagId });
                    }
                    await (0, tag_1.postTag)(postTagData);
                }
                if (del > 0) {
                    await (0, tag_1.deleteUnusedTag)(tags);
                }
            }
            else {
                return res.status(401).json("권한이 부족합니다.");
            }
        }
        return res.status(200).json({ postId, updatedPost });
    }
    catch {
        return res.status(401).json("게시물 수정를 실패했습니다.");
    }
});
postRouter.get("/main/", checkJwt_1.checkJWT, async (req, res) => {
    const userId = req.decoded?.id;
    const { page } = req.query;
    if (userId) {
        const followedUsers = await (0, follow_1.selectFollowing)(userId);
        let userIds = [];
        if (followedUsers) {
            userIds = followedUsers.map((follow) => follow.id);
        }
        userIds.push(userId);
        const response = await (0, post_1.getMainPost)(userIds, page);
        return res.status(200).json(response);
    }
});
postRouter.get("/", checkJwt_1.checkJWT, async (req, res, next) => {
    try {
        const userId = req.decoded?.id;
        const { page } = req.query;
        if (userId) {
            const followedUsers = await (0, follow_1.selectFollowing)(userId);
            let userIds = [];
            if (followedUsers) {
                userIds = followedUsers.map((follow) => follow.id);
            }
            userIds.push(userId);
            const allPost = await (0, post_1.getAllPost)(userIds, page);
            if (allPost) {
                return res.status(200).json(allPost);
            }
        }
    }
    catch (err) {
        throw err;
    }
});
postRouter.get("/:id", async (req, res, next) => {
    const postId = parseInt(req.params.id, 10);
    try {
        if (postId) {
            const onePost = await (0, post_1.getPostByPostId)(postId);
            res.status(200).json(onePost);
        }
    }
    catch (err) {
        return err;
    }
});
postRouter.get("/my/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const { page } = req.query;
    try {
        const post = await (0, post_1.getMainPost)(userId, page, 12);
        res.status(200).json(post);
    }
    catch { }
});
postRouter.get("/bookmark/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const { page } = req.query;
    try {
        const post = await (0, bookmark_1.getBookmarkPost)(userId, page, 12);
        res.status(200).json(post);
    }
    catch { }
});
postRouter.get("/tags/:tagName", async (req, res) => {
    const { tagName } = req.params;
    const { page } = req.query;
    const tagId = await (0, tag_1.findTagId)(tagName);
    if (!tagId) {
        return res.status(401).json({ message: "태그를 찾을 수 없습니다." });
    }
    const post = await (0, post_1.getPostByTag)(tagId, page);
    return res.status(200).json(post);
});
postRouter.delete("/:id", checkJwt_1.checkJWT, async (req, res) => {
    const userId = req.decoded?.id;
    const postId = parseInt(req.params.id, 10);
    if (userId) {
        const check = await (0, post_1.postUserCheck)(postId, userId);
        if (check) {
            const tags = await (0, tag_1.checkUsedTagByPost)(postId);
            const del = await (0, tag_1.postTagRemove)(postId);
            if (del > 0) {
                await (0, tag_1.deleteUnusedTag)(tags);
            }
            await (0, image_1.deletePostImage)(postId);
            const response = await (0, post_1.postDelete)(postId);
            if (response > 0) {
                return res
                    .status(200)
                    .json({ postId, message: "게시물이 삭제되었습니다." });
            }
        }
    }
});
exports.default = postRouter;
