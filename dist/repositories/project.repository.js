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
exports.findasllProject = exports.findall = exports.find = exports.deleteOne = exports.findOneAndUpdate = exports.save = void 0;
const dbcon = __importStar(require("../dbConnection/mysql"));
const querys = __importStar(require("../services/querys"));
const apierr_middleware_1 = __importDefault(require("../middleware/apierr.middleware"));
const messages = __importStar(require("../services/messges"));
const table = 'users';
function save(project) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("enter");
            const connect = yield dbcon.connection();
            let db = connect === null || connect === void 0 ? void 0 : connect.db;
            let queryforinsertproject = querys.insertProject;
            let details = db(queryforinsertproject, [project.project_name, project.project_version, project.created_by, project.created_on, project.updated_on]);
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.save = save;
function findOneAndUpdate(updateusingId, updatingValues, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connect = yield dbcon.connection();
            let queryforupdate = querys.updtaeProject;
            let db = connect === null || connect === void 0 ? void 0 : connect.db;
            let details = db(queryforupdate, [updatingValues.project_name, updatingValues.project_version, updatingValues.updated_on, updateusingId.created_by]);
            return details;
        }
        catch (error) {
            next(apierr_middleware_1.default.badReq(messages.QueryError));
        }
    });
}
exports.findOneAndUpdate = findOneAndUpdate;
function deleteOne(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connect = yield dbcon.connection();
            let queryfordelete = querys.deleteProject;
            let db = connect === null || connect === void 0 ? void 0 : connect.db;
            let details = db(queryfordelete, [id.id]);
            return details;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.deleteOne = deleteOne;
function find(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connect = yield dbcon.connection();
            let getProjects = querys.getProjectsForparticularUsrer;
            let db = connect === null || connect === void 0 ? void 0 : connect.db;
            let details = db(getProjects, [id.user_id]);
            return details;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.find = find;
function findall() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connect = yield dbcon.connection();
            let getProjects = querys.getProjectsForAllDetails;
            let db = connect === null || connect === void 0 ? void 0 : connect.db;
            let details = db(getProjects);
            return details;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findall = findall;
function findasllProject(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connect = yield dbcon.connection();
            let getProjects = querys.getProjectsForAllDetailsforuser;
            let db = connect === null || connect === void 0 ? void 0 : connect.db;
            let details = db(getProjects, [id]);
            return details;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findasllProject = findasllProject;
