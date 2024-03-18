"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_1 = require("../../services/search");
const checkJwt_1 = require("../middleware/checkJwt");
const redis_1 = __importDefault(require("../../config/redis"));
const searchRouter = (0, express_1.Router)();
searchRouter.get("/q/:type", async (req, res) => {
    try {
        const { query } = req.query;
        const type = req.params.type;
        console.log(type);
        const result = await (0, search_1.getSearchResult)(query, type);
        return res.status(200).json(result);
    }
    catch { }
});
searchRouter.post("/history", checkJwt_1.checkJWT, async (req, res, next) => {
    const userId = req.decoded?.id;
    const { result } = req.body;
    const timestamp = Date.now();
    const reversedTimestamp = Math.floor(timestamp / 1000) * -1;
    const member = JSON.stringify(result);
    if (userId) {
        const cacheKey = `searchUId:${userId}`;
        redis_1.default.ZSCORE(cacheKey, member, (err, reply) => {
            if (err) {
                console.error("Failed to check search history:", err);
            }
            else {
                // 같은 검색어가 있으면 시간을 갱신
                if (reply !== null) {
                    redis_1.default.ZADD(cacheKey, reversedTimestamp, member, (err, reply) => {
                        if (err) {
                            console.error("Failed to update search history:", err);
                        }
                        else {
                            console.log("Search history updated successfully:", reply);
                            return res.status(200).json();
                        }
                    });
                }
                else {
                    // 같은 검색어가 없으면 새로 추가
                    redis_1.default.ZADD(cacheKey, reversedTimestamp, member, (err, reply) => {
                        if (err) {
                            console.error("Failed to save search history:", err);
                        }
                        else {
                            console.log("Search history saved successfully:", reply);
                            return res.status(200).json();
                        }
                    });
                }
            }
        });
    }
});
searchRouter.get("/history1", checkJwt_1.checkJWT, async (req, res) => {
    const userId = req.decoded?.id;
    if (userId) {
        const cacheKey = `searchUId:${userId}`;
        redis_1.default.zRange(cacheKey, 0, -1, (err, reply) => {
            if (err) {
                console.error("Failed to get search history:", err);
            }
            else {
                if (reply?.length) {
                    console.log("Search history:", reply);
                    const response = reply.map((history) => {
                        return JSON.parse(history);
                    });
                    return res.status(200).json(response);
                }
                else {
                    console.log("No search history found for the given key.");
                    return res.status(200).json([]);
                }
            }
        });
    }
});
searchRouter.delete("/history", checkJwt_1.checkJWT, async (req, res) => {
    const userId = req.decoded?.id;
    const history = req.query.history;
    if (userId) {
        const cacheKey = `searchUId:${userId}`;
        if (!history) {
            redis_1.default.del(cacheKey, (err, reply) => {
                if (err) {
                    console.error("Failed to delete search history:", err);
                }
                else {
                    console.log(reply);
                    return res.status(200).json();
                }
            });
        }
        else {
            redis_1.default.zrem(cacheKey, history, (err, reply) => {
                if (err) {
                    console.error("Failed to delete search history:", err);
                }
                else {
                    return res.status(200).json();
                }
            });
        }
    }
});
exports.default = searchRouter;
