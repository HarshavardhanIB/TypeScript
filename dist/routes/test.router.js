"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const test_controller_1 = require("../controllers/test.controller");
router.post("/testExcel", test_controller_1.excelInput);
router.post("/testJson", test_controller_1.jsonInput);
router.post("/testDynamically", test_controller_1.dynamicTest);
router.post("/uploadImg", test_controller_1.uploadImg);
exports.default = router;
