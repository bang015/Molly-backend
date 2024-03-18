"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookmarkPost = exports.checkPostBookmark = exports.unBookmarkPost = exports.bookmarkPost = void 0;
const bookmark_1 = __importDefault(require("../models/bookmark"));
const post_1 = __importDefault(require("../models/post"));
const post_media_1 = __importDefault(require("../models/post-media"));
const bookmarkPost = async (postId, userId) => {
    await bookmark_1.default.create({
        postId,
        userId,
    });
};
exports.bookmarkPost = bookmarkPost;
const unBookmarkPost = async (postId, userId) => {
    await bookmark_1.default.destroy({
        where: {
            postId,
            userId,
        },
    });
};
exports.unBookmarkPost = unBookmarkPost;
const checkPostBookmark = async (postId, userId) => {
    const result = await bookmark_1.default.findOne({
        where: {
            postId,
            userId,
        },
    });
    return !!result;
};
exports.checkPostBookmark = checkPostBookmark;
const getBookmarkPost = async (userId, page = 1, limit = 12) => {
    const offset = limit * (page - 1);
    const result = await bookmark_1.default.findAll({
        where: {
            userId,
        },
        include: [
            {
                model: post_1.default,
                attributes: ["id", "createdAt"],
                include: [
                    {
                        model: post_media_1.default,
                        attributes: ["id", "path"],
                    },
                ],
            },
        ],
        offset,
        limit,
        order: [["createdAt", "DESC"]],
    });
    const bookmarkList = result.map((bookmark) => {
        return bookmark.toJSON().Post;
    });
    return bookmarkList;
};
exports.getBookmarkPost = getBookmarkPost;
