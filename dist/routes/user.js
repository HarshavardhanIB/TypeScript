"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = require("../controller/user");
router.post("/project", user_1.postproject);
router.get("/project", user_1.getProjects);
router.put("/project", user_1.putProject);
router.delete("/project", user_1.deleteProject);
router.post("/user_details_service", user_1.postUsreDetails);
router.get("/user_details_service", user_1.getUsreDetails);
router.put("/user_details_service", user_1.putUsreDetails);
router.delete("/user_details_service", user_1.deleteUsreDetails);
exports.default = router;
