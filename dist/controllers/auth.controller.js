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
exports.activate = exports.login = exports.registration = void 0;
const validation_services_1 = require("../services/validation.services");
const bcrypt = __importStar(require("bcryptjs"));
const constants = __importStar(require("../services/constants.services"));
const dotenv_1 = __importDefault(require("dotenv"));
const date = __importStar(require("date-and-time"));
const messages = __importStar(require("../services/messges.services"));
const jwt = __importStar(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../model/user.model"));
const email_services_1 = __importDefault(require("../services/email.services"));
const apierr_middleware_1 = __importDefault(require("../middleware/apierr.middleware"));
const userRepo = __importStar(require("../repositories/user.repository"));
dotenv_1.default.config();
const dataBase = process.env.DATABASE;
const emailId = process.env.EMAIL_ID;
function registration(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userName, emailid, password, roleId } = req.body;
            let active = 0;
            let now = new Date();
            let currentDateAndTime = date.format(now, 'YYYY-MM-DD HH:mm:ss');
            if (!userName || !emailid || !password || !roleId) {
                next(apierr_middleware_1.default.badReq("enter valid input"));
            }
            let emailIdcheckStatus = yield (0, validation_services_1.emailvalidation)(emailid);
            if (emailIdcheckStatus == false) {
                console.log("email id error");
                next(apierr_middleware_1.default.badReq("in valid mail id"));
            }
            let userNameValidation = yield (0, validation_services_1.AlphaNumberorNot)(userName);
            if (userNameValidation == false) {
                next(apierr_middleware_1.default.badReq("Enter User name alpha numaric values only"));
            }
            let userNamelengthValidation = yield (0, validation_services_1.lengthVerification)(userName, 2, 20);
            if (userNamelengthValidation == false) {
                next(apierr_middleware_1.default.badReq("enter the user name in between 2 and 20 characters only"));
            }
            if (dataBase == "MONGO") {
                let mailcount = yield user_model_1.default.find({ emailid: emailid }).count();
                if (mailcount > 0) {
                    next(apierr_middleware_1.default.badReq(messages.EIexists));
                    return;
                }
                let userNameCount = yield user_model_1.default.find({ userName: userName }).count();
                if (userNameCount > 0) {
                    next(apierr_middleware_1.default.badReq(messages.UNexists));
                    return res;
                }
            }
            else {
                // let mailcount:any = await User.findById({ emailid: emailid });
                var mailcount = yield userRepo.findById({ id: emailid });
                if (mailcount.length > 0) {
                    console.log("mail coyunt enter");
                    next(apierr_middleware_1.default.badReq(messages.EIexists));
                    return res;
                }
                var unCount = yield userRepo.findById({ id: userName });
                if (unCount.length > 0) {
                    next(apierr_middleware_1.default.badReq(messages.UNexists));
                    return res;
                }
            }
            const passwordHash = bcrypt.hashSync(password, 10);
            let key = yield (0, validation_services_1.autogenerateKey)(19);
            let user = new user_model_1.default({
                roleId: roleId,
                userName: userName,
                emailid: emailid,
                password: passwordHash,
                active: active,
                key: key,
                create_date_and_time: currentDateAndTime,
                update_date_and_time: currentDateAndTime
            });
            if (dataBase == "MONGO") {
                user.save().then(user => {
                    const emailIdformail = "harshavardhan.kadupu@ideabytes.com";
                    let HTMLcontentFile = process.env.APP_URL + "/user_activation.html?key=" + key;
                    let htmlContent = `<h2>Hello ${userName}</h2> 
                        <p>Thank you for register in ADMIN PORTAL</p>
                        <a href="${HTMLcontentFile}"> Click here to activate </a>`;
                    (0, email_services_1.default)(emailIdformail, emailid, "Admin Portal Registation Successfully", htmlContent, "User registered Successfully", "");
                    res.status(200).json({
                        "statusCode": 200,
                        "message": "user register successfully"
                    });
                }).catch(error => {
                    // console.log(error.stack);
                    next(apierr_middleware_1.default.badReq("eroor while insert the data "));
                });
            }
            else {
                userRepo.save(user).then(user => {
                    // user.save().then(user => {
                    const emailIdformail = "harshavardhan.kadupu@ideabytes.com";
                    let HTMLcontentFile = process.env.APP_URL + "/user_activation.html?key=" + key;
                    let htmlContent = `<h2>Hello ${userName}</h2> 
                <p>Thank you for register in ADMIN PORTAL</p>
                <a href="${HTMLcontentFile}"> Click here to activate </a>`;
                    (0, email_services_1.default)(emailIdformail, emailid, "Admin Portal Registation Successfully", htmlContent, "User registered Successfully", "");
                    res.status(200).json({
                        "statusCode": 200,
                        "message": "user register successfully"
                    });
                }).catch(error => {
                    // console.log(error.stack);
                    next(apierr_middleware_1.default.badReq("eroor while insert the data "));
                });
            }
        }
        catch (error) {
            // console.log(error);
        }
    });
}
exports.registration = registration;
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userName, password } = req.body;
            console.log(req.body);
            if (!userName || !password) {
                next(apierr_middleware_1.default.badReq("enter valid input"));
            }
            let secret = process.env.SECRET;
            if (dataBase == "MONGO") {
                yield user_model_1.default.findOne({ $or: [{ email: userName }, { UserName: userName }] }).then(user => {
                    if (user) {
                        // const passwordHash = bcrypt.hashSync(password, 10);
                        bcrypt.compare(password, user.password, function (error, result) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (error) {
                                    res.status(201).json({
                                        "statusCode": 201,
                                        "message": messages.invalidUSandPsw
                                    });
                                    return res;
                                    return;
                                }
                                console.log(result);
                                if (result) {
                                    console.log(user);
                                    if (user.active == 0) {
                                        res.status(202).json({
                                            "statusCode": 202,
                                            "message": messages.checkMail
                                        });
                                    }
                                    let accessToken = jwt.sign({ userid: user._id, roleId: user.roleId }, constants.secret, { expiresIn: constants.expiresIn, algorithm: constants.algorithm });
                                    if (user.roleId == 1) {
                                        let adminCount = yield user_model_1.default.find({ roleId: 1 }).count();
                                        let userCount = yield user_model_1.default.find({ roleId: 2 }).count();
                                        let total = adminCount + userCount;
                                        let count = { "users": userCount, "admins": adminCount, "total": total };
                                        let data = { "userName": user.userName, "userId": user._id, "roleId": user.roleId, "accessToken": accessToken, "count": count };
                                        res.status(200).json({
                                            "statusCode": 200,
                                            "message": messages.loginSuccess,
                                            data
                                        });
                                    }
                                    else {
                                        let data = { "userName": user.userName, "userId": user._id, "roleId": user.roleId, "accessToken": accessToken };
                                        res.status(200).json({
                                            "statusCode": 200,
                                            "message": messages.loginSuccess,
                                            data
                                        });
                                    }
                                }
                                else {
                                    res.status(201).json({
                                        "statusCode": 201,
                                        "message": messages.invalidUSandPsw
                                    });
                                    return res;
                                    return;
                                }
                            });
                        });
                    }
                    else {
                        res.status(201).json({
                            "statusCode": 201,
                            "message": messages.invalidUSandPsw
                        });
                    }
                });
            }
            else {
                // usre.findOne({ $or: [{ email: userName }, { UserName: userName }] }).then(user => {
                userRepo.findOne({ email: userName, UserName: userName }).then(user => {
                    console.log(user);
                    // await User.findOne({ $or: [{ email: userName }, { UserName: userName }] }).then(user => {
                    if (user) {
                        // const passwordHash = bcrypt.hashSync(password, 10);
                        bcrypt.compare(password, user[0].password, function (error, result) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (error) {
                                    res.status(201).json({
                                        "statusCode": 201,
                                        "message": messages.invalidUSandPsw
                                    });
                                    return res;
                                    return;
                                }
                                console.log(result);
                                if (result) {
                                    console.log(user);
                                    if (user[0].active == 0) {
                                        res.status(202).json({
                                            "statusCode": 202,
                                            "message": messages.checkMail
                                        });
                                    }
                                    let accessToken = jwt.sign({ userid: user[0].id, roleid: user[0].role_id }, constants.secret, { expiresIn: constants.expiresIn, algorithm: constants.algorithm });
                                    if (user[0].roleId == 1) {
                                        // let adminCount: number = await User.find({ roleId: 1 }).count();
                                        // let userCount: number = await User.find({ roleId: 2 }).count();
                                        let adminCount = yield userRepo.findCount({ id: 1 });
                                        let userCount = yield userRepo.findCount({ id: 2 });
                                        let total = adminCount + userCount;
                                        let count = { "users": userCount, "admins": adminCount, "total": total };
                                        let data = { "userName": user[0].user_name, "userId": user[0].id, "roleId": user[0].role_id, "accessToken": accessToken, "count": count };
                                        res.status(200).json({
                                            "statusCode": 200,
                                            "message": messages.loginSuccess,
                                            data
                                        });
                                    }
                                    else {
                                        let data = { "userName": user[0].user_name, "userId": user[0].id, "roleId": user[0].role_id, "accessToken": accessToken, };
                                        res.status(200).json({
                                            "statusCode": 200,
                                            "message": messages.loginSuccess,
                                            data
                                        });
                                    }
                                }
                                else {
                                    res.status(201).json({
                                        "statusCode": 201,
                                        "message": messages.invalidUSandPsw
                                    });
                                    return res;
                                    return;
                                }
                            });
                        });
                    }
                    else {
                        res.status(201).json({
                            "statusCode": 201,
                            "message": messages.invalidUSandPsw
                        });
                    }
                });
            }
        }
        catch (error) {
            console.error(error);
            console.log("==============================error========================");
            next(apierr_middleware_1.default.badReq("check the keys"));
        }
    });
}
exports.login = login;
function activate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(req);
            console.log(req.query);
            let key = req.query.key;
            key.replace(/\s/g, "");
            let update = { key: key };
            let active = { $set: { active: 1 } };
            let resultforId = yield user_model_1.default.updateOne(update, active);
            if (resultforId.length == 0) {
                let responseData = {
                    "statusCode": 202,
                    "message": messages.invalidKey,
                };
                const jsonContent = JSON.stringify(responseData);
                res.status(202).end(jsonContent);
                return res;
            }
            else {
                let responseData = {
                    "statusCode": 200,
                    "message": messages.userActivation
                };
                const jsonContent = JSON.stringify(responseData);
                res.status(200).end(jsonContent);
                return res;
            }
        }
        catch (error) {
            next(apierr_middleware_1.default.badReq("error while activate your account"));
        }
    });
}
exports.activate = activate;
