"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchResult = void 0;
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("../models/user"));
const tag_1 = __importDefault(require("../models/tag"));
const post_tag_1 = __importDefault(require("../models/post-tag"));
const profile_image_1 = __importDefault(require("../models/profile-image"));
const getSearchResult = async (searchKeyword, type) => {
    const limit = 50;
    let userSearch = false;
    let tagSearch = false;
    if (type === "user") {
        userSearch = true;
        tagSearch = false;
    }
    else if (type === "tag") {
        userSearch = false;
        tagSearch = true;
    }
    else {
        userSearch = true;
        tagSearch = true;
    }
    const [users, tags] = await Promise.all([
        userSearch
            ? user_1.default.findAll({
                attributes: ["id", "name", "nickname"],
                where: {
                    [sequelize_1.Op.or]: [
                        { nickname: { [sequelize_1.Op.like]: `%${searchKeyword}%` } },
                        { name: { [sequelize_1.Op.like]: `%${searchKeyword}%` } },
                    ],
                },
                include: {
                    model: profile_image_1.default,
                    attributes: ["path"],
                },
            })
            : Promise.resolve([]),
        tagSearch
            ? tag_1.default.findAll({
                attributes: [
                    "id",
                    "name",
                    [sequelize_1.Sequelize.fn("COUNT", sequelize_1.Sequelize.col("PostTags.id")), "tagCount"],
                ],
                where: {
                    name: { [sequelize_1.Op.like]: `%${searchKeyword}%` },
                },
                include: [
                    {
                        model: post_tag_1.default,
                        attributes: [],
                        required: false,
                    },
                ],
                group: ["tag.id"],
            })
            : Promise.resolve([]),
    ]);
    const usersWithType = users.map((user) => ({
        ...user.toJSON(),
        type: "user",
    }));
    const tagsWithType = tags.map((tag) => ({ ...tag.toJSON(), type: "tag" }));
    const result = [...usersWithType, ...tagsWithType].sort(() => Math.random() - 0.5);
    return result;
};
exports.getSearchResult = getSearchResult;
