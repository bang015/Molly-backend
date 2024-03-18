"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComment = exports.deleteComment = exports.getCommentById = exports.checkCommentUser = exports.getSubComment = exports.getMyCommentByPost = exports.getComment = exports.createComment = void 0;
const sequelize_1 = require("sequelize");
const comment_1 = __importDefault(require("../models/comment"));
const profile_image_1 = __importDefault(require("../models/profile-image"));
const user_1 = __importDefault(require("../models/user"));
const createComment = async (postId, commentId = null, userId, content) => {
    const newComment = await comment_1.default.create({
        postId: postId,
        userId: userId,
        commentId: commentId,
        content: content,
    });
    const result = await comment_1.default.findOne({
        where: { id: newComment.id },
        include: {
            model: user_1.default,
            as: "user",
            attributes: ["nickname"],
            include: [{ model: profile_image_1.default, attributes: ["path"] }],
        },
    });
    if (result) {
        const commentInfo = result.dataValues;
        const subcommentCount = await comment_1.default.count({
            where: {
                commentId: commentInfo.id,
            },
        });
        const modifiedComment = {
            ...result.toJSON(),
            subcommentCount: subcommentCount,
        };
        return modifiedComment;
    }
    else {
        return null;
    }
};
exports.createComment = createComment;
const getComment = async (postId, userId, page = 1, limit = 15) => {
    const offset = limit * (page - 1);
    const result = await comment_1.default.findAll({
        where: {
            postId: postId,
            userId: { [sequelize_1.Op.ne]: userId },
            commentId: null,
        },
        include: {
            model: user_1.default,
            as: "user",
            attributes: ["nickname"],
            include: [{ model: profile_image_1.default, attributes: ["path"] }],
        },
        offset,
        limit,
        order: [["createdAt", "DESC"]],
    });
    const totalComments = await comment_1.default.count({
        where: {
            postId: postId,
            commentId: null,
        },
    });
    const totalPages = Math.ceil(totalComments / limit);
    const commentList = await Promise.all(result.map(async (comment) => {
        const commentInfo = comment.dataValues;
        const subcommentCount = await comment_1.default.count({
            where: {
                commentId: commentInfo.id,
            },
        });
        const modifiedComment = {
            ...comment.toJSON(),
            subcommentCount: subcommentCount,
        };
        return modifiedComment;
    }));
    return { commentList, totalPages };
};
exports.getComment = getComment;
const getMyCommentByPost = async (userId, postId) => {
    const result = await comment_1.default.findAll({
        where: {
            postId: postId,
            userId: userId,
            commentId: null,
        },
        include: {
            model: user_1.default,
            as: "user",
            attributes: ["nickname"],
            include: [{ model: profile_image_1.default, attributes: ["path"] }],
        },
        order: [["createdAt", "DESC"]],
    });
    if (result) {
        const commentList = await Promise.all(result.map(async (comment) => {
            const commentInfo = comment.dataValues;
            const subcommentCount = await comment_1.default.count({
                where: {
                    commentId: commentInfo.id,
                },
            });
            const modifiedComment = {
                ...comment.toJSON(),
                subcommentCount: subcommentCount,
            };
            return modifiedComment;
        }));
        return { commentList };
    }
};
exports.getMyCommentByPost = getMyCommentByPost;
const getSubComment = async (postId, id, page = 1, limit = 3) => {
    const offset = limit * (page - 1);
    const result = await comment_1.default.findAll({
        where: {
            postId: postId,
            commentId: id,
        },
        include: {
            model: user_1.default,
            as: "user",
            attributes: ["nickname"],
            include: [{ model: profile_image_1.default, attributes: ["path"] }],
        },
        offset,
        limit,
        order: [["createdAt", "DESC"]],
    });
    const comment = result.map((comment) => {
        return comment.toJSON();
    });
    return comment;
};
exports.getSubComment = getSubComment;
const checkCommentUser = async (id, userId) => {
    const result = await comment_1.default.findByPk(id);
    if (result) {
        if (result.dataValues.userId === userId) {
            return true;
        }
        else {
            return false;
        }
    }
    return false;
};
exports.checkCommentUser = checkCommentUser;
const getCommentById = async (id) => {
    const comment = await comment_1.default.findOne({
        where: {
            id: id,
        },
        include: {
            model: user_1.default,
            as: "user",
            attributes: ["nickname"],
            include: [{ model: profile_image_1.default, attributes: ["path"] }],
        },
    });
    if (comment) {
        const subcommentCount = await comment_1.default.count({
            where: {
                commentId: id,
            },
        });
        const modifiedComment = {
            ...comment.toJSON(),
            subcommentCount: subcommentCount,
        };
        return modifiedComment;
    }
};
exports.getCommentById = getCommentById;
const deleteComment = async (id) => {
    const result = await comment_1.default.destroy({
        where: {
            id: id,
        },
    });
    return result;
};
exports.deleteComment = deleteComment;
const updateComment = async (id, content) => {
    const result = await comment_1.default.update({ content: content }, { where: { id: id } });
    return result[0];
};
exports.updateComment = updateComment;
