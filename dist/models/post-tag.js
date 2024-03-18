"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const post_1 = __importDefault(require("./post"));
const tag_1 = __importDefault(require("./tag"));
class PostTag extends sequelize_1.Model {
}
exports.default = PostTag;
PostTag.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
}, {
    tableName: "post_tag",
    sequelize: database_1.default,
});
post_1.default.belongsToMany(tag_1.default, { through: PostTag });
tag_1.default.belongsToMany(post_1.default, { through: PostTag });
