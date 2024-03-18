"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkJwt_1 = require("../middleware/checkJwt");
const celebrate_1 = require("celebrate");
const follow_1 = require("../../services/follow");
const followRouter = (0, express_1.Router)();
followRouter.post("/", checkJwt_1.checkJWT, (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        followUserId: celebrate_1.Joi.number().required(),
    }),
}), async (req, res, next) => {
    try {
        const userId = req.decoded?.id;
        const { followUserId } = req.body;
        let check = await (0, follow_1.checkFollowed)(userId, followUserId);
        if (check) {
            await (0, follow_1.unfollow)(userId, followUserId);
        }
        else {
            await (0, follow_1.addFollowing)(userId, followUserId);
        }
        const count = await (0, follow_1.followCount)(userId);
        check = await (0, follow_1.checkFollowed)(userId, followUserId);
        return res.status(200).json({ check, followUserId, count });
    }
    catch { }
});
followRouter.get("/", checkJwt_1.checkJWT, async (req, res, next) => {
    try {
        const userId = req.decoded?.id;
        let limit = parseInt(req.query.limit);
        let followed = false;
        const followingUser = await (0, follow_1.selectFollowing)(userId);
        if (followingUser.length === 0) {
            followed = true;
        }
        const followerUser = await (0, follow_1.selectFollower)(userId);
        const sugFollower = await Promise.all(followerUser.map(async (follow) => {
            const check = await (0, follow_1.checkFollowed)(userId, follow.id);
            if (!check) {
                const result = { ...follow, message: "회원님을 팔로우합니다" };
                return result;
            }
        }));
        console.log(sugFollower.filter(Boolean));
        const filter = sugFollower.filter(Boolean).map((user) => {
            return user.id;
        });
        limit = limit - sugFollower.filter(Boolean).length;
        console.log(filter);
        const suggestList = await (0, follow_1.suggestFollowers)(userId, limit, filter);
        const suggestFollowerList = [...sugFollower.filter(Boolean), ...suggestList];
        return res.status(200).json({ suggestFollowerList, followed });
    }
    catch (err) { }
});
followRouter.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { query } = req.query;
    const { page } = req.query;
    const result = await (0, follow_1.selectFollowing)(id, query, page);
    return res.status(200).json(result);
});
followRouter.get("/r/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { query } = req.query;
    const { page } = req.query;
    const result = await (0, follow_1.selectFollower)(id, query, page);
    return res.status(200).json(result);
});
followRouter.get("/check/:followUserId", checkJwt_1.checkJWT, async (req, res) => {
    const userId = req.decoded?.id;
    const followUserId = parseInt(req.params.followUserId, 10);
    const check = await (0, follow_1.checkFollowed)(userId, followUserId);
    return res.status(200).json(check);
});
exports.default = followRouter;
