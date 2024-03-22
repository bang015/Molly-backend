"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const celebrate_1 = require("celebrate");
const auth_1 = require("../../services/auth");
const checkJwt_1 = require("../middleware/checkJwt");
const authRouter = (0, express_1.Router)();
authRouter.post("/", (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().required(),
    }),
}), async (req, res, next) => {
    const user = await (0, auth_1.authenticate)(req.body);
    if (!user) {
        return res.status(401).json({ status: false });
    }
    const token = (0, auth_1.authorize)(user);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ token, status: true });
});
authRouter.get("/", checkJwt_1.checkJWT, async (req, res, next) => {
    try {
        const userId = req.decoded?.id;
        const user = await (0, auth_1.getUserById)(userId);
        return res.status(200).json(user);
    }
    catch (err) {
        return next(err);
    }
});
consol
exports.default = authRouter;
