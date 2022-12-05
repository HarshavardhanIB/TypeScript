"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchXml = void 0;
const fs_1 = require("fs");
const stream_1 = require("stream");
const util_1 = require("util");
const node_fetch_1 = __importDefault(require("node-fetch"));
function fetchXml(url, dir) {
    return __awaiter(this, void 0, void 0, function* () {
        const streamPipeline = (0, util_1.promisify)(stream_1.pipeline);
        const res = yield (0, node_fetch_1.default)(url);
        if (!res.ok) {
            return false;
        }
        yield streamPipeline(res.body, (0, fs_1.createWriteStream)(dir + '/excel.xlsx'));
        return true;
    });
}
exports.fetchXml = fetchXml;
