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
exports.findd = exports.remove = exports.findCount = exports.findOne = exports.findById = exports.save = void 0;
const dbcon = __importStar(require("../dbConnection/mysql"));
const querys = __importStar(require("../services/querys.service"));
const mysql = require('mysql'); // or use import if you use TS
const table = 'users';
function save(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("enter");
            const connect = yield dbcon.connection();
            let db = connect === null || connect === void 0 ? void 0 : connect.db;
            let queryforinsertUser = querys.insertUsers;
            let details = db(queryforinsertUser, [user.roleId, user.userName, user.emailid, user.password, user.active, user.create_date_and_time, user.update_date_and_time, user.key]);
            return details;
        }
        catch (error) {
        }
    });
}
exports.save = save;
function findById(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const connect = yield dbcon.connection();
        let db = connect === null || connect === void 0 ? void 0 : connect.db;
        let queryforfind = "select * from users where user_name=?||email_id=?||password=?||active=?||role_id=?";
        const result = yield db(queryforfind, [user.id, user.id, user.id, user.id, user.id]);
        console.log(result);
        return result;
    });
}
exports.findById = findById;
function findOne(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const connect = yield dbcon.connection();
        let db = connect === null || connect === void 0 ? void 0 : connect.db;
        let queryforfind = "select * from users where user_name=?||email_id=?";
        let details = db(queryforfind, [user.UserName, user.email]);
        return details;
    });
}
exports.findOne = findOne;
function findCount(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const connect = yield dbcon.connection();
        let db = connect === null || connect === void 0 ? void 0 : connect.db;
        let queryforfind = "select count(*) from users where role_id=?";
        let details = db(queryforfind, [user.id]);
        console.log(details);
        console.log("count of the query");
        return details;
    });
}
exports.findCount = findCount;
function remove(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const connect = yield dbcon.connection();
        let db = connect === null || connect === void 0 ? void 0 : connect.db;
        let queryfordelete = querys.deleteUser;
        let details = db(queryfordelete, [user.id]);
        console.log(details);
        console.log("count of the query");
        return details;
    });
}
exports.remove = remove;
function findd(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const connect = yield dbcon.connection();
        let db = connect === null || connect === void 0 ? void 0 : connect.db;
        let query = querys.MontlyUserdata;
        let result = db(query, [user.currentDateAndTime, user.previousMonth]);
        return result;
    });
}
exports.findd = findd;
