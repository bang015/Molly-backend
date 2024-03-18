"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const method_override_1 = __importDefault(require("method-override"));
const celebrate_1 = require("celebrate");
const morgan_1 = __importDefault(require("morgan"));
const config_1 = __importDefault(require("../config"));
const routes_1 = __importDefault(require("../api/routes"));
exports.default = ({ app }) => {
    app.get("/", (req, res) => {
        res.send("Hello Molly");
        console.log("hi");
    });
    const corsOptions = {
        origin: `${process.env.REQ_ADDRESS}`,
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    };
    app.use((0, cors_1.default)(corsOptions));
    /* FOR USE RESTful API */
    app.use((0, method_override_1.default)());
    /* Morgan Request Logger */
    app.use((0, morgan_1.default)(process.env.NODE_ENV === "development" ? "dev" : "combined"));
    /* REQUEST DATA */
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({
        extended: false,
    }));
    // 캐시 헤더 설정
    app.use((req, res, next) => {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        next();
    });
    /* ROUTER */
    app.use(config_1.default.api.prefix, routes_1.default);
    /* Celebrate error */
    app.use((0, celebrate_1.errors)());
    /* catch 404 and forward to error handler */
    app.use((req, res, next) => {
        const err = new Error("Not Found");
        err.status = 404;
        next(err);
    });
    /* error handler */
    app.use((err, req, res) => {
        res.status(err.status || 500).json({
            message: err.message,
            error: err,
        });
    });
};
