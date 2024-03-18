"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const celebrate_1 = require("celebrate");
const user_1 = require("../../services/user");
const checkJwt_1 = require("../middleware/checkJwt");
const multer_1 = require("../middleware/multer");
const image_1 = require("../../services/image");
const post_1 = require("../../services/post");
const follow_1 = require("../../services/follow");
const userRouter = (0, express_1.Router)();
userRouter.post("/", (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        email: celebrate_1.Joi.string().email().required(),
        name: celebrate_1.Joi.string().required(),
        nickname: celebrate_1.Joi.string().required(),
        password: celebrate_1.Joi.string().required(),
    }),
}), async (req, res, next) => {
    console.log(req.body);
    const { email, nickname } = req.body;
    try {
        console.log(req.body);
        const existUser = await (0, user_1.getUserByUserInfo)({ email, nickname });
        if (existUser) {
            return res.status(409).json({ error: "User already exists" });
        }
        await (0, user_1.createUser)(req.body);
        return res.status(200).json({ message: "user crearted success" });
    }
    catch (err) {
        return next(err);
    }
});
userRouter.get("/", (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.QUERY]: {
        id: celebrate_1.Joi.number().integer(),
        email: celebrate_1.Joi.string().email(),
        nickname: celebrate_1.Joi.string(),
    },
}), async (req, res, next) => {
    const { id, email, nickname } = req.query;
    try {
        if (!id && !email && !nickname) {
            const allUser = await (0, user_1.getAllUser)();
        }
        const user = await (0, user_1.getUserByUserInfo)(req.query);
        if (user) {
            return res.status(200).json(user);
        }
        return res.status(204).end();
    }
    catch (err) {
        return next(err);
    }
});
userRouter.get("/:nickname", async (req, res, next) => {
    const nickname = req.params.nickname;
    try {
        const user = await (0, user_1.getUserByUserInfo)({ nickname });
        if (user) {
            const { password, ...userInfo } = user.dataValues;
            const postCnt = await (0, post_1.postCount)(user.dataValues.id);
            const followCnt = await (0, follow_1.followCount)(user.dataValues.id);
            const followerCnt = await (0, follow_1.followerCount)(user.dataValues.id);
            userInfo.postCount = postCnt;
            userInfo.followCount = followCnt;
            userInfo.followerCount = followerCnt;
            return res.status(200).json(userInfo);
        }
    }
    catch (err) {
        return next(err);
    }
});
userRouter.patch("/", checkJwt_1.checkJWT, multer_1.uploadProfile, (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        nickname: celebrate_1.Joi.string(),
        password: celebrate_1.Joi.string(),
        name: celebrate_1.Joi.string(),
        introduce: celebrate_1.Joi.string().allow("", null),
    }),
}), async (req, res, next) => {
    const userId = req.decoded?.id;
    let modifyDetail = { id: userId, ...req.body };
    let message = "";
    const exisUser = await (0, user_1.getUserByUserInfo)({ id: modifyDetail.id });
    try {
        if (exisUser) {
            if (req.file) {
                const imageDetail = {
                    name: req.file.filename,
                    type: req.file.mimetype,
                    path: req.file.path,
                };
                const profileimageId = exisUser.dataValues.profile_image;
                if (profileimageId) {
                    await (0, image_1.deleteProfileImage)(profileimageId);
                }
                const newImage = await (0, image_1.profileImage)(imageDetail);
                modifyDetail = { ...modifyDetail, profile_image: newImage?.id };
                message = "프로필 사진이 수정되었습니다.";
            }
            const user = await (0, user_1.modifyUser)(modifyDetail);
            message = "프로필이 수정되었습니다.";
            if (user) {
                return res.status(200).json({ user, message });
            }
        }
    }
    catch (e) {
        return next(e);
    }
});
exports.default = userRouter;
