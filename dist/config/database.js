"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
const sequelize = new sequelize_1.Sequelize(index_1.default.database.dbname, index_1.default.database.username, index_1.default.database.password, {
    host: index_1.default.database.host,
    dialect: "mysql",
    dialectOptions: {
        timezone: "Asia/Seoul",
    },
    define: {
        timestamps: true,
    },
});
exports.default = sequelize;
