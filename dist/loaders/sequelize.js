"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const user_1 = __importDefault(require("../models/user"));
const profile_image_1 = __importDefault(require("../models/profile-image"));
const post_1 = __importDefault(require("../models/post"));
const post_media_1 = __importDefault(require("../models/post-media"));
const tag_1 = __importDefault(require("../models/tag"));
const post_tag_1 = __importDefault(require("../models/post-tag"));
const follow_1 = __importDefault(require("../models/follow"));
const comment_1 = __importDefault(require("../models/comment"));
const like_1 = __importDefault(require("../models/like"));
const chat_room_1 = __importDefault(require("../models/chat-room"));
const chat_users_1 = __importDefault(require("../models/chat-users"));
const chat_message_1 = __importDefault(require("../models/chat-message"));
exports.default = async () => {
    const db = {
        sequelize: database_1.default,
        Sequelize: sequelize_1.Sequelize,
        User: user_1.default,
        Image: profile_image_1.default,
        Post: post_1.default,
        PostMedias: post_media_1.default,
        Tag: tag_1.default,
        PostTag: post_tag_1.default,
        Follow: follow_1.default,
        Comment: comment_1.default,
        Like: like_1.default,
        ChatRoom: chat_room_1.default,
        ChatUsers: chat_users_1.default,
        ChatMessage: chat_message_1.default,
    };
    const connection = await db.sequelize.sync();
    // Seeder();
    return connection;
};
