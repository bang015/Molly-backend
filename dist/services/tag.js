"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUnusedTag = exports.checkUsedTagByPost = exports.postTagRemove = exports.getPostTag = exports.postTag = exports.findTagId = exports.findOrCreateTag = void 0;
const post_tag_1 = __importDefault(require("../models/post-tag"));
const tag_1 = __importDefault(require("../models/tag"));
const findOrCreateTag = async (tagName) => {
    const existingTag = await tag_1.default.findOne({ where: { name: tagName } });
    if (existingTag) {
        return existingTag.id;
    }
    else {
        const newTag = await tag_1.default.create({ name: tagName });
        return newTag.id;
    }
};
exports.findOrCreateTag = findOrCreateTag;
const findTagId = async (tagName) => {
    const existingTag = await tag_1.default.findOne({ where: { name: tagName } });
    return existingTag?.id;
};
exports.findTagId = findTagId;
const postTag = async (postTagData) => {
    post_tag_1.default.bulkCreate(postTagData);
};
exports.postTag = postTag;
const getPostTag = async (postId) => {
    const result = await post_tag_1.default.findAll({
        where: {
            PostId: postId,
        },
    });
    return result;
};
exports.getPostTag = getPostTag;
const postTagRemove = async (postId) => {
    const result = await post_tag_1.default.destroy({
        where: {
            PostId: postId,
        },
    });
    return result;
};
exports.postTagRemove = postTagRemove;
const checkUsedTagByPost = async (postId) => {
    const tag = await post_tag_1.default.findAll({
        attributes: ["TagId"],
        where: {
            PostId: postId
        }
    });
    const result = tag.map((t) => t.dataValues.TagId);
    return result;
};
exports.checkUsedTagByPost = checkUsedTagByPost;
const deleteUnusedTag = async (tags) => {
    tags.forEach(async (tag) => {
        const check = await post_tag_1.default.findOne({ where: { TagId: tag } });
        if (!check) {
            await tag_1.default.destroy({
                where: {
                    id: tag
                }
            });
        }
    });
};
exports.deleteUnusedTag = deleteUnusedTag;
