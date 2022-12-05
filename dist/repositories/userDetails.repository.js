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
Object.defineProperty(exports, "__esModule", { value: true });
exports.count = exports.findall = exports.deletee = exports.findOneAndUpdate = exports.save = void 0;
const dbcon = __importStar(require("../dbConnection/mysql"));
const querys = __importStar(require("../services/querys"));
const table = 'users';
function save(userDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("$$$$$$$$$$$$", userDetails);
            console.log("enter");
            const connect = yield dbcon.connection();
            let db = connect === null || connect === void 0 ? void 0 : connect.db;
            let queryforinsertproject = querys.insertUserDetailsWithProfilePic;
            let details = db(queryforinsertproject, [userDetails.user_id, userDetails.first_name, userDetails.last_name, userDetails.profile_pic, userDetails.created_on, userDetails.updated_on]);
            return details;
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.save = save;
function findOneAndUpdate(updatebasedonId, userDetailss) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(">>>>>>>>",updatebasedonId);
        const connect = yield dbcon.connection();
        let queryforUpdate = querys.updtaeUserDetailswithProfilePic;
        let db = connect === null || connect === void 0 ? void 0 : connect.db;
        let details = db(queryforUpdate, [userDetailss.first_name, userDetailss.last_name, userDetailss.profile_pic, userDetailss.updated_on, updatebasedonId.user_id]);
        return details;
    });
}
exports.findOneAndUpdate = findOneAndUpdate;
function deletee(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const connect = yield dbcon.connection();
        let queryfordelete = querys.deleteProject;
        let db = connect === null || connect === void 0 ? void 0 : connect.db;
        let details = db(queryfordelete, [id.id]);
        return details;
    });
}
exports.deletee = deletee;
function findall(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const connect = yield dbcon.connection();
        let queryfordetails = querys.getUserDetails;
        let db = connect === null || connect === void 0 ? void 0 : connect.db;
        let details = db(queryfordetails, [id.id]);
        return details;
    });
}
exports.findall = findall;
function count(id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id);
        const connect = yield dbcon.connection();
        let queryfordetails = querys.userdrtailsCount;
        let db = connect === null || connect === void 0 ? void 0 : connect.db;
        let details = db(queryfordetails, [id.id]);
        return details;
    });
}
exports.count = count;
