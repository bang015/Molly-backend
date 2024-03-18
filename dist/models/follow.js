"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Follow extends sequelize_1.Model {
}
exports.default = Follow;
Follow.init({}, {
    tableName: "follow",
    sequelize: database_1.default,
});
