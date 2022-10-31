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
exports.allusers = exports.appInfo = exports.sendUserinfo = exports.usercount = exports.deleteUserDetails = exports.getUsreDetails = exports.deleteUsreDetails = exports.putUsreDetails = exports.postUsreDetails = exports.getProjects = exports.deleteProject = exports.putProject = exports.postproject = void 0;
const messages = __importStar(require("../services/messges.services"));
const validation = __importStar(require("../services/validation.services"));
const projects_model_1 = __importDefault(require("../model/projects.model"));
const userProfile_model_1 = __importDefault(require("../model/userProfile.model"));
const user_model_1 = __importDefault(require("../model/user.model"));
const middlewhere = __importStar(require("../middleware/verifyToken.middleware"));
const date = __importStar(require("date-and-time"));
const fs = __importStar(require("fs"));
const cron = __importStar(require("node-cron"));
const promises_1 = require("fs/promises");
const constants = __importStar(require("../services/constants.services"));
const apierr_middleware_1 = __importDefault(require("../middleware/apierr.middleware"));
const formidable = __importStar(require("formidable"));
const email_services_1 = __importDefault(require("../services/email.services"));
const userRepo = __importStar(require("../repositories/user.repository"));
const projectRepo = __importStar(require("../repositories/project.repository"));
const UserDetaRepo = __importStar(require("../repositories/userDetails.repository"));
const excel_services_1 = require("../services/excel.services");
let responseData;
let jsonContent;
const dataBase = process.env.DATABASE;
console.log(dataBase);
function postproject(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let now = new Date();
        let currentDateAndTime = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        const { project_name, project_version } = req.body;
        if (!project_name || !project_version) {
            res.status(201).json({
                "statusCode": 201,
                "message": messages.validinput
            });
        }
        else {
            let project = new projects_model_1.default({
                project_name: project_name,
                project_version: project_version,
                created_by: middlewhere.userid,
                created_on: currentDateAndTime,
                updated_on: currentDateAndTime
            });
            if (dataBase == "MONGO") {
                project.save().then(project => {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": messages.insertProjects
                    });
                    res.end();
                    return res;
                }).catch(e => {
                    console.log(e.stack);
                    next(apierr_middleware_1.default.badReq(messages.errorData));
                });
            }
            else {
                projectRepo.save(project).then(project => {
                    // project.save().then(project => {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": messages.insertProjects
                    });
                    res.end();
                    return res;
                }).catch(e => {
                    console.log(e.stack);
                    next(apierr_middleware_1.default.badReq(messages.errorData));
                });
            }
        }
    });
}
exports.postproject = postproject;
function putProject(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { project_name, project_version } = req.body;
        const id = req.query.id;
        if (!project_name || !project_version || !id) {
            res.status(201).json({
                "statusCode": 201,
                "message": messages.validinput
            });
        }
        else {
            let now = new Date();
            let currentDateAndTime = date.format(now, 'YYYY-MM-DD HH:mm:ss');
            let updateusingId = { created_by: id };
            let updatingValues = {
                project_name: project_name,
                project_version: project_version,
                updated_on: currentDateAndTime
            };
            if (dataBase == "MONGO") {
                yield projects_model_1.default.findOneAndUpdate(updateusingId, updatingValues).then(result => {
                    if (result) {
                        res.status(200).json({
                            "statusCode": 200,
                            "message": messages.updateProject
                        });
                    }
                    else {
                        res.status(200).json({
                            "statusCode": 200,
                            "message": messages.QueryError
                        });
                    }
                }).catch(err => {
                    res.status(500).json({
                        "statusCode": 500,
                        "message": messages.QueryError
                    });
                });
            }
            else {
                // await projects.findOneAndUpdate(updateusingId, updatingValues).then(result => {
                projectRepo.findOneAndUpdate(updateusingId, updatingValues, next).then(result => {
                    if (result) {
                        res.status(200).json({
                            "statusCode": 200,
                            "message": messages.updateProject
                        });
                    }
                    else {
                        res.status(200).json({
                            "statusCode": 200,
                            "message": messages.QueryError
                        });
                    }
                }).catch(err => {
                    res.status(500).json({
                        "statusCode": 500,
                        "message": messages.QueryError
                    });
                });
            }
        }
    });
}
exports.putProject = putProject;
function deleteProject(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.query.id;
        if (!id) {
            res.status(201).json({
                "statusCode": 201,
                "message": messages.validinput
            });
        }
        else {
            if (dataBase == "MONGO") {
                let deleteUsingId = { id: id };
                projects_model_1.default.deleteOne(deleteUsingId).then(result => {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": messages.deletedProject
                    });
                }).catch(err => {
                    next(apierr_middleware_1.default.badReq(messages.projectDelete));
                });
            }
            else {
                let deleteUsingId = { id: id };
                // projects.deleteOne(deleteUsingId).then(result => {
                projectRepo.deleteOne({ id: id }).then(result => {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": messages.deletedProject
                    });
                }).catch(err => {
                    next(apierr_middleware_1.default.badReq(messages.projectDelete));
                });
            }
        }
    });
}
exports.deleteProject = deleteProject;
function getProjects(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (dataBase == "MONGO") {
            projects_model_1.default.find({}).then(projects => {
                if (projects.length == 0) {
                    res.status(201).json({
                        "statusCode": 201,
                        "message": messages.NoProjects
                    });
                    return res;
                }
                else {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": messages.listOfProjects,
                        projects
                    });
                    return res;
                }
            }).catch(err => {
                res.status(500).json({
                    "statusCode": 500,
                    "message": messages.errorData
                });
                return res;
            });
        }
        { // projects.find({}).then(projects => {
            projectRepo.findall().then(projects => {
                if (projects.length == 0) {
                    res.status(201).json({
                        "statusCode": 201,
                        "message": messages.NoProjects
                    });
                    return res;
                }
                else {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": messages.listOfProjects,
                        projects
                    });
                    return res;
                }
            }).catch(err => {
                res.status(500).json({
                    "statusCode": 500,
                    "message": messages.errorData
                });
                return res;
            });
        }
    });
}
exports.getProjects = getProjects;
function postUsreDetails(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let now = new Date();
        let currentDateAndTime = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        let form = new formidable.IncomingForm();
        form.parse(req, function (error, fields, files) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                let firstName = fields.firstName;
                let lastName = fields.lastName;
                let checkFname = yield validation.isAlphaorNot(firstName);
                let checkLname = yield validation.isAlphaorNot(lastName);
                let fnLength = yield validation.lengthVerification(firstName, 2, 50);
                let lnLength = yield validation.lengthVerification(lastName, 2, 50);
                if (checkFname == false || checkLname == false) {
                    responseData =
                        {
                            "statusCode": 202,
                            "message": "First Name and last Name accepts only alphabets "
                        };
                    jsonContent = JSON.stringify(responseData);
                    res.status(202).end(jsonContent);
                    return res;
                }
                if (fnLength == false || lnLength == false) {
                    responseData =
                        {
                            "statusCode": 202,
                            "message": "Enter first name and last name range in between 3 to 50 chnaracter only "
                        };
                    jsonContent = JSON.stringify(responseData);
                    res.status(202).end(jsonContent);
                    return res;
                }
                if (((_a = files.filetoupload) === null || _a === void 0 ? void 0 : _a.mimetype) == 'image/png' || files.filetoupload.mimetype == 'image/jpg' || files.filetoupload.mimetype == 'image/jpeg') {
                    console.log("enter123");
                    var dir = './public/resources/images';
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    let data = yield (0, promises_1.readFile)(files.filetoupload.filepath);
                    (0, promises_1.writeFile)(dir + "/" + middlewhere.userid + ".png", data);
                    let profilePic = "/images/" + middlewhere.userid + ".png";
                    let userDetailss = new userProfile_model_1.default({
                        user_id: middlewhere.userid,
                        first_name: firstName,
                        last_name: lastName,
                        profile_pic: profilePic,
                        created_on: currentDateAndTime,
                        updated_on: currentDateAndTime
                    });
                    if (dataBase == "MONGO") {
                        userDetailss.save().then(result => {
                            res.status(200).json({
                                "statusCode": 200,
                                "message": "User details inserted successfully"
                            });
                        }).then(err => res.status(500).json({
                            "statusCode": 500,
                            "message": "error while insert the user details"
                        }));
                    }
                    else { // userDetailss.save().then(result => {
                        UserDetaRepo.save(userDetailss).then(result => {
                            res.status(200).json({
                                "statusCode": 200,
                                "message": "User details inserted successfully"
                            });
                        }).then(err => res.status(500).json({
                            "statusCode": 500,
                            "message": "error while insert the user details"
                        }));
                    }
                }
                else {
                    console.log("enter123456");
                    let responseData = {
                        "statusCode": 201,
                        "message": "Upload only jpg,jpeg,png format pictures only"
                    };
                    const jsonContent = JSON.stringify(responseData);
                    res.status(201).json(jsonContent);
                    return res;
                }
            });
        });
    });
}
exports.postUsreDetails = postUsreDetails;
function putUsreDetails(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let now = new Date();
        let currentDateAndTime = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                let firstName = fields.firstName;
                let lastName = fields.lastName;
                let checkFname = yield validation.isAlphaorNot(firstName);
                let checkLname = yield validation.isAlphaorNot(lastName);
                let fnLength = yield validation.lengthVerification(firstName, 2, 50);
                let lnLength = yield validation.lengthVerification(lastName, 2, 50);
                if (checkFname == false || checkLname == false) {
                    responseData =
                        {
                            "statusCode": 202,
                            "message": "First Name and last Name accepts only alphabets "
                        };
                    jsonContent = JSON.stringify(responseData);
                    res.status(202).end(jsonContent);
                    return res;
                }
                if (fnLength == false || lnLength == false) {
                    responseData =
                        {
                            "statusCode": 202,
                            "message": "Enter first name and last name range in between 3 to 50 chnaracter only "
                        };
                    jsonContent = JSON.stringify(responseData);
                    res.status(202).end(jsonContent);
                    return res;
                }
                // console.log(files);
                // console.log(files.filetoupload);
                if (((_a = files.filetoupload) === null || _a === void 0 ? void 0 : _a.mimetype) != 'image/png' || files.filetoupload.mimetype != 'image/jpg' || files.filetoupload.mimetype != 'image/jpeg') {
                    let responseData = {
                        "statusCode": 201,
                        "message": "Upload only jpg,jpeg,png format pictures only"
                    };
                    const jsonContent = JSON.stringify(responseData);
                    res.status(201).json(jsonContent);
                    return res;
                }
                var dir = './public/resources/images';
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                let data = (0, promises_1.readFile)(files.filetoupload.filepath);
                (0, promises_1.writeFile)(dir + "/" + middlewhere.userid + ".png", data);
                let profilePic = "/images/" + middlewhere.userid + ".png";
                let userDetailss = {
                    first_name: firstName,
                    last_name: lastName,
                    profile_pic: profilePic,
                    updated_on: currentDateAndTime
                };
                let updatebasedonId = { $set: { user_id: middlewhere.userid } };
                if (dataBase == "MONGO") {
                    yield userProfile_model_1.default.findOneAndUpdate(updatebasedonId, userDetailss).then(result => {
                        res.status(200).json({
                            "statusCode": 200,
                            "message": "User details updated successfully"
                        });
                    }).then(err => res.status(500).json({
                        "statusCode": 500,
                        "message": "error while insert the user details"
                    }));
                }
                else { // await userDetails.findOneAndUpdate(updatebasedonId, userDetailss).then(result => {
                    UserDetaRepo.findOneAndUpdate(updatebasedonId, userDetailss).then(result => {
                        res.status(200).json({
                            "statusCode": 200,
                            "message": "User details updated successfully"
                        });
                    }).then(err => res.status(500).json({
                        "statusCode": 500,
                        "message": "error while insert the user details"
                    }));
                }
            });
        });
    });
}
exports.putUsreDetails = putUsreDetails;
function deleteUsreDetails(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.query.id;
        if (!id) {
            res.status(201).json({
                "statusCode": 201,
                "message": messages.validinput
            });
        }
        else {
            let deleteUsingId = { id: id };
            if (dataBase == "MONGO") {
                userProfile_model_1.default.deleteOne(deleteUsingId).then(result => {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": "project details deleyte successfully"
                    });
                }).catch(err => {
                    res.status(500).json({
                        "statusCode": 500,
                        "message": "Error while delete the project details"
                    });
                });
            }
            else { // userDetails.deleteOne(deleteUsingId).then(result => {
                UserDetaRepo.deletee(deleteUsingId).then(result => {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": "project details deleyte successfully"
                    });
                }).catch(err => {
                    res.status(500).json({
                        "statusCode": 500,
                        "message": "Error while delete the project details"
                    });
                });
            }
        }
    });
}
exports.deleteUsreDetails = deleteUsreDetails;
function getUsreDetails(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (dataBase == "MONGO") {
            // userDetails.find({ user_id: middlewhere.userid }).then(userdetails => {
            UserDetaRepo.findall({ user_id: middlewhere.userid }).then(userdetails => {
                if (userdetails.length == 0) {
                    res.status(201).json({
                        "statusCode": 201,
                        "message": "Please add user details "
                    });
                    return res;
                }
                else {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": "Listing of user details successfully",
                        "userdetails": userdetails
                    });
                    return res;
                }
            }).catch(err => {
                res.status(500).json({
                    "statusCode": 500,
                    "message": "Error while getting the userdetails"
                });
            });
        }
        else {
            let id = middlewhere.userid;
            console.log("*********************************************");
            console.log(id);
            let data = yield UserDetaRepo.findall({ "id": id });
            if (data.length == 0) {
                res.status(201).json({
                    "statusCode": 201,
                    "message": "No data found"
                });
                return res;
            }
            else {
                res.status(200).json({
                    "statusCode": 200,
                    "message": messages.getUserdetails,
                    "data": data
                });
                return res;
            }
        }
    });
}
exports.getUsreDetails = getUsreDetails;
function deleteUserDetails(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = req.query.id;
        if (!id) {
            res.status(201).json({
                "statusCode": 201,
                "message": messages.validinput
            });
            return res;
        }
        else {
            if (dataBase == "MONGO") {
                let deleteUsersId = { _id: id };
                let deleteuserDetails = { user_id: id };
                let deleteProjects = { created_by: id };
                user_model_1.default.deleteOne(deleteUsersId).then(result => {
                    userProfile_model_1.default.deleteOne(deleteuserDetails).then(result => {
                        projects_model_1.default.deleteMany(deleteProjects).then(result => {
                            res.status(201).json({
                                "statusCode": 201,
                                "message": messages.deleteallUserdetailsSuccess
                            });
                            return res;
                        });
                    });
                }).catch(error => {
                    res.status(201).json({
                        "statusCode": 201,
                        "message": messages.QueryError
                    });
                    return res;
                });
            }
            else {
                let deleteUsersId = { id: id };
                let deleteuserDetails = { user_id: id };
                let deleteProjects = { created_by: id };
                // user.deleteOne(deleteUsersId).then(result => {
                userRepo.remove(deleteUsersId).then(result => {
                    // userDetails.deleteOne(deleteuserDetails).then(result => {
                    UserDetaRepo.deletee(deleteuserDetails).then(result => {
                        // projects.deleteMany(deleteProjects).then(result => {
                        projectRepo.deleteOne(deleteProjects).then(result => {
                            res.status(201).json({
                                "statusCode": 201,
                                "message": messages.deleteallUserdetailsSuccess
                            });
                            return res;
                        });
                    });
                }).catch(error => {
                    res.status(201).json({
                        "statusCode": 201,
                        "message": messages.QueryError
                    });
                    return res;
                });
            }
        }
    });
}
exports.deleteUserDetails = deleteUserDetails;
function usercount(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (dataBase == "MONGO") {
            let adminCount = yield user_model_1.default.find({ roleId: 1 }).count();
            let userCount = yield user_model_1.default.find({ roleId: 2 }).count();
            let total = adminCount + userCount;
            let data = { "users": userCount, "admins": adminCount, "total": total };
            let responseData = {
                "statusCode": 200,
                "message": messages.GetCountSuccess,
                "data": data
            };
            jsonContent = JSON.stringify(responseData);
            res.status(200).end(jsonContent);
            return res;
        }
        else { // let adminCount: number = await user.find({ roleId: 1 }).count();
            // let userCount: number = await user.find({ roleId: 2 }).count();
            let adminCount = yield userRepo.findCount({ roleId: 1 });
            let userCount = yield userRepo.findCount({ roleId: 2 });
            let total = adminCount + userCount;
            let data = { "users": userCount, "admins": adminCount, "total": total };
            let responseData = {
                "statusCode": 200,
                "message": messages.GetCountSuccess,
                "data": data
            };
            jsonContent = JSON.stringify(responseData);
            res.status(200).end(jsonContent);
            return res;
        }
    });
}
exports.usercount = usercount;
function sendUserinfo(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        cron.schedule('* * * * 1 *', function () {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("entered1");
                // let emailId = req.data.emailId;
                let result;
                const emailIdformail = "harshavardhan.kadupu@ideabytes.com";
                let emailId = "harshavardhan.kadupu@ideabytes.com";
                let userid = 10;
                let now = new Date();
                let today = now.getDate();
                let previosmonth = now.getMonth();
                if (previosmonth < 10) {
                    previosmonth = '0' + previosmonth;
                }
                let year = now.getFullYear();
                let time = date.format(now, 'HH:mm:ss');
                let previousMonth = year + "-" + previosmonth + "-" + today + " " + time;
                let currentDateAndTime = date.format(now, 'YYYY-MM-DD HH:mm:ss');
                if (dataBase == "MONGO") {
                    result = yield user_model_1.default.find({ create_date_and_time: { $gte: currentDateAndTime, $lte: previousMonth } });
                    if (result.length == 0) {
                        let message = "<p>" + "No users found in " + currentDateAndTime + " to " + previousMonth + "</p>";
                        (0, email_services_1.default)(emailIdformail, emailId, "User data", "", message, "");
                    }
                    else {
                        (0, excel_services_1.generateExcel)(result);
                        console.log("else block enterted");
                        let htmlfront = "<style>table, th, td {  border:1px solid black; }  </style>" +
                            "<table>" +
                            "<tr>" +
                            "<th> role_id </th>" +
                            "<th> id </th>" +
                            "<th>user name </th>" +
                            "<th>email_id</th>" +
                            "<th>created_date_and_time </th>" +
                            "</tr>" +
                            "<tr>";
                        var row = "";
                        for (let i = 0; i < result.length; i++) {
                            row += "<td>" + result[i].roleId + "</td>" +
                                "<td>" + result[i]._id + "</td>" +
                                "<td>" + result[i].userName + "</td>" +
                                "<td>" + result[i].emailid + "</td>" +
                                "<td>" + result[i].create_date_and_time + "</td>";
                        }
                        let tablelast = "</tr> </table>";
                        let html_content = htmlfront + row + tablelast;
                        let attachments = [{
                                filename: 'userdata.xlsx',
                                path: './userdata.xlsx'
                            }];
                        let sentemail = yield (0, email_services_1.default)(emailIdformail, emailId, "User data", html_content, "", attachments);
                        if (sentemail == true) {
                            let responseData = {
                                "statusCode": 200,
                                "message": messages.emailSend
                            };
                            const jsonContent = JSON.stringify(responseData);
                            res.status(200).end(jsonContent);
                            return res;
                        }
                        else {
                            let responseData = {
                                "statusCode": 200,
                                "message": messages.emailerr
                            };
                            const jsonContent = JSON.stringify(responseData);
                            res.status(200).end(jsonContent);
                            return res;
                        }
                    }
                }
                else {
                    result = yield userRepo.findd({ currentDateAndTime: currentDateAndTime, previousMonth: previousMonth });
                    if (result.length == 0) {
                        let message = "<p>" + "No users found in " + currentDateAndTime + " to " + previousMonth + "</p>";
                        (0, email_services_1.default)(emailIdformail, emailId, "User data", "", message, "");
                    }
                    else {
                        (0, excel_services_1.generateExcel)(result);
                        console.log("else block enterted");
                        let htmlfront = "<style>table, th, td {  border:1px solid black; }  </style>" +
                            "<table>" +
                            "<tr>" +
                            "<th> role_id </th>" +
                            "<th> id </th>" +
                            "<th>user name </th>" +
                            "<th>email_id</th>" +
                            "<th>created_date_and_time </th>" +
                            "</tr>" +
                            "<tr>";
                        var row = "";
                        for (let i = 0; i < result.length; i++) {
                            row += "<td>" + result[i].role_id + "</td>" +
                                "<td>" + result[i].id + "</td>" +
                                "<td>" + result[i].user_name + "</td>" +
                                "<td>" + result[i].email_id + "</td>" +
                                "<td>" + result[i].created_date_and_time + "</td>";
                        }
                        let tablelast = "</tr> </table>";
                        let html_content = htmlfront + row + tablelast;
                        let attachments = [{
                                filename: 'userdata.xlsx',
                                path: './userdata.xlsx'
                            }];
                        let sentemail = yield (0, email_services_1.default)(emailIdformail, emailId, "User data", html_content, "", attachments);
                        if (sentemail == true) {
                            let responseData = {
                                "statusCode": 200,
                                "message": messages.emailSend
                            };
                            const jsonContent = JSON.stringify(responseData);
                            res.status(200).end(jsonContent);
                            return res;
                        }
                        else {
                            let responseData = {
                                "statusCode": 200,
                                "message": messages.emailerr
                            };
                            const jsonContent = JSON.stringify(responseData);
                            res.status(200).end(jsonContent);
                            return res;
                        }
                    }
                }
            });
        });
    });
}
exports.sendUserinfo = sendUserinfo;
function appInfo(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = { "name": constants.name, "version": constants.version, "NodeVersion": process.versions.node, "NpmVersion": constants.npm_version };
        let responseData = {
            "statusCode": 200,
            "message": "The project details",
            "AppData": data
        };
        const jsonContent = JSON.stringify(responseData);
        res.status(200).end(jsonContent);
        return res;
    });
}
exports.appInfo = appInfo;
function allusers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (dataBase == "MONGO") {
            UserDetaRepo.findall({ user_id: middlewhere.userid }).then(userdetails => {
                if (userdetails.length == 0) {
                    res.status(201).json({
                        "statusCode": 201,
                        "message": "Please add user details "
                    });
                    return res;
                }
                else {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": "Listing of user details successfully",
                        "userdetails": userdetails
                    });
                    return res;
                }
            }).catch(err => {
                res.status(500).json({
                    "statusCode": 500,
                    "message": "Error while getting the userdetails"
                });
            });
        }
        else {
            let id = middlewhere.userid;
            console.log("*********************************************");
            console.log(id);
            let data = yield UserDetaRepo.findall({ "id": id });
            if (data.length == 0) {
                res.status(201).json({
                    "statusCode": 201,
                    "message": "No data found"
                });
                return res;
            }
            else {
                res.status(200).json({
                    "statusCode": 200,
                    "message": messages.getUserdetails,
                    "data": data
                });
                return res;
            }
        }
    });
}
exports.allusers = allusers;
