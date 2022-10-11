"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../controller/auth");
router.post("/registration", auth_1.registration);
router.post("/login", auth_1.login);
router.get("/activation", auth_1.activate);
exports.default = router;
