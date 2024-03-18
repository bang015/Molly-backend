"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./express"));
const sequelize_1 = __importDefault(require("./sequelize"));
const cloudinary_1 = __importDefault(require("./cloudinary"));
const associations_1 = require("../models/associations");
exports.default = async ({ expressApp }) => {
    await (0, sequelize_1.default)();
    (0, associations_1.defineRelationships)();
    (0, express_1.default)({ app: expressApp });
    (0, cloudinary_1.default)();
};
