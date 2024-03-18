"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFollowed = exports.unfollow = exports.addFollowing = exports.suggestFollowers = exports.followerCount = exports.selectFollower = exports.followCount = exports.selectFollowing = void 0;
const sequelize_1 = require("sequelize");
const follow_1 = __importDefault(require("../models/follow"));
const profile_image_1 = __importDefault(require("../models/profile-image"));
const user_1 = __importDefault(require("../models/user"));
const selectFollowing = async (userId, query, page = 1, limit = 12) => {
    const offset = limit * (page - 1);
    const whereCondition = {};
    if (query) {
        whereCondition[sequelize_1.Op.or] = [
            { name: { [sequelize_1.Op.like]: `%${query}%` } },
            { nickname: { [sequelize_1.Op.like]: `%${query}%` } },
        ];
    }
    const result = await follow_1.default.findAll({
        attributes: ["followingId"],
        where: {
            followerId: userId,
        },
        include: [
            {
                model: user_1.default,
                as: "following",
                attributes: ["name", "nickname"],
                where: whereCondition,
                include: [
                    {
                        model: profile_image_1.default,
                        attributes: ["path"],
                    },
                ],
            },
        ],
        offset,
        limit,
    });
    const cleanedResult = result.map((follow) => {
        const result = {
            id: follow.toJSON().followingId,
            ...follow.toJSON().following,
        };
        return result;
    });
    return cleanedResult;
};
exports.selectFollowing = selectFollowing;
const followCount = async (userId) => {
    const result = await follow_1.default.count({
        where: {
            followerId: userId,
        },
    });
    return result;
};
exports.followCount = followCount;
const selectFollower = async (userId, query, page = 1, limit = 12) => {
    const offset = limit * (page - 1);
    const whereCondition = {};
    if (query) {
        whereCondition[sequelize_1.Op.or] = [
            { name: { [sequelize_1.Op.like]: `%${query}%` } },
            { nickname: { [sequelize_1.Op.like]: `%${query}%` } },
        ];
    }
    const result = await follow_1.default.findAll({
        attributes: ["followerId"],
        where: {
            followingId: userId,
        },
        include: [
            {
                model: user_1.default,
                as: "follower",
                where: whereCondition,
                attributes: ["name", "nickname"],
                include: [
                    {
                        model: profile_image_1.default,
                        attributes: ["path"],
                    },
                ],
            },
        ],
        offset,
        limit,
    });
    const cleanedResult = result.map((follow) => {
        const result = {
            id: follow.toJSON().followerId,
            ...follow.toJSON().follower,
        };
        return result;
    });
    return cleanedResult;
};
exports.selectFollower = selectFollower;
const followerCount = async (userId) => {
    const result = await follow_1.default.count({
        where: {
            followingId: userId,
        },
    });
    return result;
};
exports.followerCount = followerCount;
const suggestFollowers = async (userId, limit, filter) => {
    const userIdConditions = filter.map((userId) => ({
        id: {
            [sequelize_1.Op.not]: userId, // userId와 다른 경우를 나타내는 조건
        },
    }));
    const result = await user_1.default.findAll({
        where: {
            [sequelize_1.Op.and]: [
                {
                    id: {
                        [sequelize_1.Op.not]: userId,
                    },
                },
                userIdConditions,
                {
                    id: {
                        [sequelize_1.Op.notIn]: sequelize_1.Sequelize.literal(`(SELECT followingId FROM Follow WHERE followerId = ${userId})`),
                    },
                },
            ],
        },
        attributes: ["id", "name", "nickname"],
        include: { model: profile_image_1.default, attributes: ["path"] },
        order: sequelize_1.Sequelize.literal("RAND()"),
        limit: limit,
    });
    const cleanedResult = result.map((user) => {
        const result = { ...user.toJSON(), message: "회원님을 위한 추천" };
        return result;
    });
    return cleanedResult;
};
exports.suggestFollowers = suggestFollowers;
const addFollowing = async (userId, followUserId) => {
    await follow_1.default.create({
        followerId: userId,
        followingId: followUserId,
    });
    return followUserId;
};
exports.addFollowing = addFollowing;
const unfollow = async (userId, followUserId) => {
    await follow_1.default.destroy({
        where: {
            followerId: userId,
            followingId: followUserId,
        },
    });
};
exports.unfollow = unfollow;
const checkFollowed = async (userId, followUserId) => {
    const result = await follow_1.default.findOne({
        where: {
            followerId: userId,
            followingId: followUserId,
        },
    });
    return !!result;
};
exports.checkFollowed = checkFollowed;
