"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLikeCount = exports.unLikePost = exports.addLikePost = exports.checkLikedPost = void 0;
const like_1 = __importDefault(require("../models/like"));
const checkLikedPost = async (postId, userId) => {
    const result = await like_1.default.findOne({
        where: {
            postId,
            userId
        }
    });
    return !!result;
};
exports.checkLikedPost = checkLikedPost;
const addLikePost = async (postId, userId) => {
    await like_1.default.create({
        postId,
        userId
    });
};
exports.addLikePost = addLikePost;
const unLikePost = async (postId, userId) => {
    await like_1.default.destroy({
        where: {
            postId,
            userId
        }
    });
};
exports.unLikePost = unLikePost;
const postLikeCount = async (postId) => {
    const count = await like_1.default.count({
        where: {
            postId
        }
    });
    return count;
};
exports.postLikeCount = postLikeCount;
