"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const cloudinary = require('cloudinary').v2;
const cloudinaryConfig = async () => {
    await cloudinary.config({
        cloud_name: config_1.default.cloudinaryApi.cloud_name,
        api_key: config_1.default.cloudinaryApi.api_key,
        api_secret: config_1.default.cloudinaryApi.api_secret,
    });
};
exports.default = () => cloudinaryConfig();
