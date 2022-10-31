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
exports.corsFunction = exports.verifyToken = exports.roleId = exports.userid = void 0;
const constants = __importStar(require("../services/constants.services"));
const message = __importStar(require("../services/messges.services"));
const jwt = __importStar(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function verifyToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("enter");
        console.log(req.path);
        let reqPath = req.path;
        let adminOrUser = reqPath.split("/")[2];
        if (reqPath.split("/")[3] == "appInfo") {
            next();
            return;
        }
        else {
            console.log(adminOrUser);
            if (adminOrUser == "admin" || adminOrUser == "user") {
                console.log("entered 2");
                try {
                    const authorizationKey = req.headers['authorization'];
                    if (!authorizationKey) {
                        let responseData = {
                            "statusCode": 500,
                            "message": message.tokenUnauthorized
                        };
                        const jsonContent = JSON.stringify(responseData);
                        res.status(500).end(jsonContent);
                        return res;
                    }
                    var token = authorizationKey.split(" ")[1];
                    var decoded = jwt.verify(token, constants.secret);
                    // console.log(decoded);
                    exports.userid = yield decoded.userid;
                    exports.roleId = yield decoded.roleid;
                    console.log(exports.userid);
                    console.log(exports.roleId);
                    console.log(adminOrUser);
                    console.log(exports.roleId);
                    if (adminOrUser == "admin" && exports.roleId == 1) {
                        next();
                    }
                    else if (adminOrUser == "user" && exports.roleId == 2) {
                        next();
                    }
                    else {
                        let responseData = {
                            "statusCode": 401,
                            "message": message.invalidRolePath
                        };
                        const jsonContent = JSON.stringify(responseData);
                        res.status(401).end(jsonContent);
                        return res;
                    }
                }
                catch (error) {
                    let message = "";
                    if (error.name == "TokenExpiredError") {
                        message = error.message;
                    }
                    else if (error.name == "JsonWebTokenError") {
                        message = error.message;
                    }
                    else {
                        message = error.message;
                    }
                    console.log(error.message);
                    let responseData = {
                        "statusCode": 401,
                        "message": message,
                    };
                    const jsonContent = JSON.stringify(responseData);
                    res.status(401).end(jsonContent);
                    return res;
                }
            }
            else {
                next();
            }
        }
    });
}
exports.verifyToken = verifyToken;
function corsFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Origin,Accept,Authorization');
        // res.setHeader('Access-Control-Allow-Credentials',"true");
        next();
    });
}
exports.corsFunction = corsFunction;
