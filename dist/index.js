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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const admin_router_1 = __importDefault(require("./routes/admin.router"));
const user_touter_1 = __importDefault(require("./routes/user.touter"));
const apiErrHandler_middleware_1 = __importDefault(require("./middleware/apiErrHandler.middleware"));
const middlewhere = __importStar(require("./middleware/verifyToken.middleware"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const Options = {
    origin: '*',
};
app.use((0, cors_1.default)(Options));
app.use(middlewhere.corsFunction);
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send("express");
});
app.use(middlewhere.verifyToken);
app.use("/api/auth", auth_router_1.default);
app.use("/api/admin", admin_router_1.default);
app.use("/api/user", user_touter_1.default);
app.use(apiErrHandler_middleware_1.default);
app.listen(port, () => {
    console.log(`the app is running on the port ${port}`);
    // connect();
});
