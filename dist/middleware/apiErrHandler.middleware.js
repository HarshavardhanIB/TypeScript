"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apierr_middleware_1 = __importDefault(require("./apierr.middleware"));
function apiErrHandler(error, req, res, next) {
    console.log("=====================middle where==============================");
    if (error instanceof apierr_middleware_1.default) {
        res.status(error.code).json({
            "statusCode": error.code,
            "message": error.message
        });
        return;
    }
    res.status(500).send('Something went wrong');
    return;
}
exports.default = apiErrHandler;
