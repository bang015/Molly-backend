"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineRelationships = void 0;
const user_1 = __importDefault(require("./user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const comment_1 = __importDefault(require("./comment"));
const post_1 = __importDefault(require("./post"));
const profile_image_1 = __importDefault(require("./profile-image"));
const post_media_1 = __importDefault(require("./post-media"));
const follow_1 = __importDefault(require("./follow"));
const like_1 = __importDefault(require("./like"));
const bookmark_1 = __importDefault(require("./bookmark"));
const post_tag_1 = __importDefault(require("./post-tag"));
const tag_1 = __importDefault(require("./tag"));
const chat_room_1 = __importDefault(require("./chat-room"));
const chat_message_1 = __importDefault(require("./chat-message"));
const chat_users_1 = __importDefault(require("./chat-users"));
function defineRelationships() {
    //User
    user_1.default.hasMany(comment_1.default, { foreignKey: "userId", as: "comments" });
    user_1.default.hasMany(bookmark_1.default, { foreignKey: "userId", as: "bookmark" });
    user_1.default.hasMany(follow_1.default, { foreignKey: "followerId", as: "follower" });
    user_1.default.hasMany(follow_1.default, { foreignKey: "followingId", as: "following" });
    user_1.default.hasMany(chat_message_1.default, { foreignKey: "userId", as: "userMessage" });
    user_1.default.hasMany(chat_users_1.default, { foreignKey: "userId", as: "chatUsers1" });
    user_1.default.belongsTo(profile_image_1.default, { foreignKey: "profile_image" });
    user_1.default.beforeCreate(async (user) => {
        const encryptedPw = await bcrypt_1.default.hash(user.password, 10);
        user.password = encryptedPw;
    });
    //Post
    post_1.default.belongsTo(user_1.default, {
        foreignKey: "userId",
    });
    post_1.default.hasMany(post_media_1.default, { foreignKey: "postId" });
    post_1.default.hasMany(comment_1.default, { foreignKey: "postId" });
    post_1.default.hasMany(bookmark_1.default, { foreignKey: "postId" });
    post_1.default.hasMany(post_tag_1.default, { foreignKey: "PostId" });
    //Comment
    comment_1.default.belongsTo(user_1.default, { as: "user" });
    comment_1.default.belongsTo(post_1.default, { foreignKey: "postId", as: "post" });
    //PostMedia
    post_media_1.default.belongsTo(post_1.default, {
        foreignKey: "postId",
    });
    //Follow
    follow_1.default.belongsTo(user_1.default, { foreignKey: "followerId", as: "follower" });
    follow_1.default.belongsTo(user_1.default, { foreignKey: "followingId", as: "following" });
    //Like
    like_1.default.belongsTo(post_1.default, { foreignKey: "postId" });
    like_1.default.belongsTo(user_1.default, { foreignKey: "userId" });
    //bookmark
    bookmark_1.default.belongsTo(post_1.default, { foreignKey: "postId" });
    bookmark_1.default.belongsTo(user_1.default, { foreignKey: "userId" });
    //tag
    tag_1.default.hasMany(post_tag_1.default, { foreignKey: "TagId" });
    post_tag_1.default.belongsTo(post_1.default, { foreignKey: "PostId" });
    //chat
    chat_room_1.default.hasMany(chat_message_1.default, { foreignKey: "roomId", as: "chatMessage" });
    chat_room_1.default.hasMany(chat_users_1.default, { foreignKey: "roomId", as: "chat" });
    chat_message_1.default.belongsTo(user_1.default, { foreignKey: "userId", as: "userMessage" });
    chat_message_1.default.belongsTo(chat_room_1.default, { foreignKey: "roomId", as: "chatMessage" });
    chat_users_1.default.belongsTo(user_1.default, { foreignKey: "userId", as: "cUsers" });
    chat_users_1.default.belongsTo(chat_room_1.default, { foreignKey: "roomId", as: "chat" });
}
exports.defineRelationships = defineRelationships;
