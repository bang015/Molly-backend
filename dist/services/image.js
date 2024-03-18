"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostImage = exports.postImage = exports.deleteProfileImage = exports.profileImage = void 0;
const profile_image_1 = __importDefault(require("../models/profile-image"));
const cloudinary_1 = require("cloudinary");
const post_media_1 = __importDefault(require("../models/post-media"));
const profileImage = async (imageInfo) => {
    await profile_image_1.default.create({
        name: imageInfo.name,
        type: imageInfo.type,
        path: imageInfo.path,
    });
    const imageid = await profile_image_1.default.findOne({
        where: { name: imageInfo.name },
        attributes: ["id"],
    });
    return imageid;
};
exports.profileImage = profileImage;
const deleteProfileImage = async (profileimgId) => {
    const profileImage = await profile_image_1.default.findByPk(profileimgId);
    const imgId = profileImage?.dataValues.name;
    cloudinary_1.v2.uploader.destroy(imgId, function (result) {
        console.log(result);
    });
    await profile_image_1.default.destroy({
        where: {
            id: profileimgId,
        },
    });
};
exports.deleteProfileImage = deleteProfileImage;
const postImage = async (mediaInfo) => {
    const postData = mediaInfo.map((info) => ({
        postId: info.postId,
        name: info.name,
        path: info.path,
        type: info.type,
    }));
    const result = await post_media_1.default.bulkCreate(postData);
    return result;
};
exports.postImage = postImage;
const deletePostImage = async (postId) => {
    const postImg = await post_media_1.default.findAll({
        where: { postId: postId },
    });
    postImg.map((media) => {
        cloudinary_1.v2.uploader.destroy(media.dataValues.name, function (result) {
            console.log(result);
        });
    });
};
exports.deletePostImage = deletePostImage;
