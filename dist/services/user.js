"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyUser = exports.getUserByUserInfo = exports.getAllUser = exports.createUser = void 0;
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("../models/user"));
const profile_image_1 = __importDefault(require("../models/profile-image"));
const createUser = async (userInfo) => {
    await user_1.default.create({
        email: userInfo.email,
        nickname: userInfo.nickname,
        password: userInfo.password,
        name: userInfo.name,
    });
};
exports.createUser = createUser;
const getAllUser = async () => {
    const allUser = await user_1.default.findAll({
        include: [
            {
                model: profile_image_1.default,
                attributes: ["id", "path"],
            },
        ],
    });
    return allUser;
};
exports.getAllUser = getAllUser;
const getUserByUserInfo = async (userInfo) => {
    const user = await user_1.default.findOne({
        where: {
            [sequelize_1.Op.or]: [
                { id: userInfo.id || null },
                { email: userInfo.email || null },
                { nickname: userInfo.nickname || null },
            ],
        },
        include: [
            {
                model: profile_image_1.default,
                attributes: ["id", "path"],
            },
        ],
    });
    return user;
};
exports.getUserByUserInfo = getUserByUserInfo;
const modifyUser = async (userInfo) => {
    const existUser = await user_1.default.findByPk(userInfo.id);
    if (!existUser) {
        return null;
    }
    const updateFields = {};
    if (userInfo.name) {
        updateFields.name = userInfo.name;
    }
    if (userInfo.nickname) {
        updateFields.nickname = userInfo.nickname;
    }
    if (userInfo.introduce) {
        updateFields.introduce = userInfo.introduce;
    }
    if (userInfo.profile_image) {
        updateFields.profile_image = userInfo.profile_image;
    }
    try {
        const user = await existUser.update(updateFields);
        delete user.dataValues.password;
        return user;
    }
    catch (err) {
        console.log(err);
        return null;
    }
};
exports.modifyUser = modifyUser;
