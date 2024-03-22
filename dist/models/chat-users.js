"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class ChatUsers extends sequelize_1.Model {
}
ChatUsers.init({
    userId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "user",
            key: "id",
        },
    },
    roomId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "chat_room",
            key: "id",
        },
    },
}, {
    tableName: "chat_users",
    sequelize: database_1.default,
});
exports.default = ChatUsers;
