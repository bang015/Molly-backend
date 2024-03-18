"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCount = exports.postDelete = exports.postUpdate = exports.postUserCheck = exports.getPostByPostId = exports.getPostByTag = exports.getMainPost = exports.getAllPost = exports.uploadPost = void 0;
const sequelize_1 = require("sequelize");
const post_1 = __importDefault(require("../models/post"));
const post_media_1 = __importDefault(require("../models/post-media"));
const profile_image_1 = __importDefault(require("../models/profile-image"));
const user_1 = __importDefault(require("../models/user"));
const post_tag_1 = __importDefault(require("../models/post-tag"));
const uploadPost = async (userId, content) => {
    const newPost = await post_1.default.create({
        userId: userId,
        content: content,
    });
    return newPost.id;
};
exports.uploadPost = uploadPost;
const getAllPost = async (userIds, page = 1, limit = 30) => {
    const offset = limit * (page - 1);
    const result = await post_1.default.findAll({
        attributes: ["id", "createdAt"],
        where: {
            userId: {
                [sequelize_1.Op.notIn]: userIds,
            },
        },
        include: [
            {
                model: post_media_1.default,
                attributes: ["id", "path"],
            },
        ],
        offset,
        limit,
        order: sequelize_1.Sequelize.literal("RAND()"),
    });
    const postList = result.map((post) => {
        return post.toJSON();
    });
    return postList;
};
exports.getAllPost = getAllPost;
const getMainPost = async (userIds, page = 1, limit = 5) => {
    const offset = limit * (page - 1);
    const result = await post_1.default.findAll({
        where: {
            userId: userIds,
        },
        include: [
            {
                model: post_media_1.default,
                attributes: ["id", "path"],
            },
            {
                model: user_1.default,
                attributes: ["nickname"],
                include: [{ model: profile_image_1.default, attributes: ["path"] }],
            },
        ],
        offset,
        limit,
        order: [["createdAt", "DESC"]],
    });
    if (result) {
        const totalPost = await post_1.default.count({
            where: {
                userId: userIds,
            },
        });
        const totalPages = Math.ceil(totalPost / limit);
        const post = result.map((post) => {
            return post.toJSON();
        });
        return { post, totalPages };
    }
    else {
        return null;
    }
};
exports.getMainPost = getMainPost;
const getPostByTag = async (tagId, page = 1, limit = 30) => {
    const offset = limit * (page - 1);
    const result = await post_tag_1.default.findAll({
        attributes: [],
        where: { TagId: tagId },
        include: [
            {
                model: post_1.default,
                include: [{ model: post_media_1.default, attributes: ["id", "path"] }],
            },
        ],
        offset,
        limit,
    });
    if (result) {
        const post = result.map((post) => {
            return post.toJSON().Post;
        });
        return post;
    }
    else {
        return null;
    }
};
exports.getPostByTag = getPostByTag;
const getPostByPostId = async (id) => {
    const result = await post_1.default.findOne({
        include: [
            {
                model: post_media_1.default,
                attributes: ["id", "path"],
            },
            {
                model: user_1.default,
                attributes: ["nickname"],
                include: [{ model: profile_image_1.default, attributes: ["path"] }],
            },
        ],
        where: { id: id },
    });
    if (result) {
        return result.toJSON();
    }
    else {
        return null;
    }
};
exports.getPostByPostId = getPostByPostId;
const postUserCheck = async (postId, userId) => {
    const result = await post_1.default.findOne({
        where: {
            id: postId,
            userId,
        },
    });
    return !!result;
};
exports.postUserCheck = postUserCheck;
const postUpdate = async (postId, content) => {
    const [update] = await post_1.default.update({ content: content }, {
        where: {
            id: postId,
        },
    });
    if (update === 1) {
        const result = await post_1.default.findOne({
            where: {
                id: postId,
            },
        });
        return result?.dataValues.content;
    }
};
exports.postUpdate = postUpdate;
const postDelete = async (postId) => {
    const result = await post_1.default.destroy({
        where: {
            id: postId,
        },
    });
    return result;
};
exports.postDelete = postDelete;
const postCount = async (userId) => {
    const result = await post_1.default.count({
        where: {
            userId,
        },
    });
    return result;
};
exports.postCount = postCount;
