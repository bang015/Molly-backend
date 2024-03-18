"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPostMedias = exports.uploadProfile = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
const getNand = (digit) => JSON.stringify(Math.round(Math.random() * 10 ** digit));
const getExtension = (filename) => {
    const lastDot = filename.lastIndexOf(".");
    return lastDot === -1 ? "png" : filename.substring(lastDot + 1);
};
const parser = (purpose) => (0, multer_1.default)({
    storage: new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_1.v2,
        params: async (req, file) => {
            const params = {
                folder: `/${purpose}`,
                format: getExtension(file.originalname), // 파일 확장자 가져오기
                public_id: new Date().valueOf() + getNand(10), // 고유한 public_id 생성
            };
            // purpose가 "post"일 때만 transformation 설정
            if (purpose === "post") {
                params.transformation = [
                    { width: 897, height: 897, crop: "fill" },
                ];
            }
            return params;
        },
    }),
});
// profile 및 post 업로드 설정
exports.uploadProfile = parser("profile").single("profile_image");
exports.uploadPostMedias = parser("post").array("post_images", 5);
