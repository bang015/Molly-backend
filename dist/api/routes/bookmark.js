"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkJwt_1 = require("../middleware/checkJwt");
const bookmark_1 = require("../../services/bookmark");
const bookmarkRouter = (0, express_1.Router)();
bookmarkRouter.post("/", checkJwt_1.checkJWT, async (req, res) => {
    const userId = req.decoded?.id;
    const { postId } = req.body;
    if (userId) {
        const check = await (0, bookmark_1.checkPostBookmark)(postId, userId);
        if (check) {
            await (0, bookmark_1.unBookmarkPost)(postId, userId);
        }
        else {
            await (0, bookmark_1.bookmarkPost)(postId, userId);
        }
        const result = await (0, bookmark_1.checkPostBookmark)(postId, userId);
        return res.status(200).json(result);
    }
});
bookmarkRouter.get("/:postId", checkJwt_1.checkJWT, async (req, res) => {
    const userId = req.decoded?.id;
    const postId = parseInt(req.params.postId, 10);
    if (userId) {
        const checkBookmark = await (0, bookmark_1.checkPostBookmark)(postId, userId);
        return res.status(200).json(checkBookmark);
    }
});
exports.default = bookmarkRouter;
