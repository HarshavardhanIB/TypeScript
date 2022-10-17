"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = require("../controllers/auth.controller");
router.post("/registration", auth_controller_1.registration);
router.post("/login", auth_controller_1.login);
router.get("/activation", auth_controller_1.activate);
exports.default = router;