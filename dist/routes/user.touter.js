"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = require("../controllers/user.controller");
router.post("/project", user_controller_1.postproject);
router.get("/project", user_controller_1.getProjects);
router.put("/project", user_controller_1.putProject);
router.delete("/project", user_controller_1.deleteProject);
router.post("/user_details_service", user_controller_1.postUsreDetails);
router.get("/user_details_service", user_controller_1.getUsreDetails);
router.put("/user_details_service", user_controller_1.putUsreDetails);
router.delete("/user_details_service", user_controller_1.deleteUsreDetails);
exports.default = router;
