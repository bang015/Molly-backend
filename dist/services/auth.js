"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.authorize = exports.authenticate = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const profile_image_1 = __importDefault(require("../models/profile-image"));
const config_1 = __importDefault(require("../config"));
const authenticate = async (authInfo) => {
    const user = await user_1.default.findOne({
        where: {
            email: authInfo.email,
        },
    });
    if (!user) {
        return null;
    }
    const isPasswordMatch = bcrypt_1.default.compareSync(authInfo.password, user.password);
    if (!isPasswordMatch) {
        return null;
    }
    return user;
};
exports.authenticate = authenticate;
const authorize = (user) => {
    const token = jwt.sign({ id: user.id, email: user.email, nick: user.nickname }, config_1.default.toString(), {
        expiresIn: "7d",
        issuer: "bletcher",
        subject: "userInfo",
    });
    return token;
};
exports.authorize = authorize;
const getUserById = async (id) => {
    if (id) {
        const user = await user_1.default.findOne({
            where: { id },
            attributes: {
                exclude: ["password"],
            },
            include: [
                {
                    model: profile_image_1.default,
                    attributes: ["id", "path"],
                },
            ],
        });
        return user;
    }
    return null;
};
exports.getUserById = getUserById;
