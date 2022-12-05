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
exports.converttoJson = exports.convertCellValuetoJson = exports.getResdata = exports.getReqdata = exports.getDataset = exports.softWare = exports.Project = exports.datafromtheSheets = exports.etj = void 0;
const excel = __importStar(require("exceljs"));
const keys = __importStar(require("./responseKeys"));
const fs = __importStar(require("fs"));
let MISC_KEYS = [keys.XPOS, keys.YPOS, keys.PAGEURL, keys.CATEGORY, keys.WAITTIME, keys.ACTIVEVALUE, keys.HEIGHT, keys.WIDTH, keys.STATE];
function etj(path) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("ejt");
        let workbook = new excel.Workbook();
        console.log(path);
        workbook = yield workbook.xlsx.readFile(path);
        let ws = workbook.worksheets;
        let jsondata = [];
        for (let i = 0; i < ws.length; i++) {
            let worksheet = workbook.worksheets[i];
            let data = yield datafromtheSheets(worksheet);
            jsondata.push(data);
        }
        fs.writeFileSync("./input.json", JSON.stringify(jsondata));
        console.log("json input created");
        return jsondata;
    });
}
exports.etj = etj;
function datafromtheSheets(ws) {
    return __awaiter(this, void 0, void 0, function* () {
        let general = {};
        let datasetSteps;
        let datasetStepsForOriginal = {};
        let dataSet = {};
        let sheetname = ws.name;
        let geberalObj = {};
        for (let i = 1; i <= 7; i++) {
            let cellValueatj;
            let project = yield Project(ws);
            let softwaredata = yield softWare(ws);
            let cretaedat = ws.getRow(6).getCell(2).value;
            let requirement = ws.getRow(3).getCell(2).value;
            let testcaseDesc = ws.getRow(2).getCell(2).value;
            let prerequisite = ws.getRow(7).getCell(2).value;
            general["requirement"] = requirement;
            general["testcaseDesc"] = testcaseDesc;
            general["prerequisite"] = prerequisite;
            general["createdAt"] = cretaedat;
            general["Project"] = project;
            general["Software"] = softwaredata;
            let rowEightRow = ws.getRow(8);
            let Firststepvalue = rowEightRow.getCell(2).value;
            let stepCountinNum = parseInt(Firststepvalue.split("=")[1]);
            let stepCount = 2 * stepCountinNum + 1;
            let NumberofRows = ws.rowCount;
            let datasetsCount = (NumberofRows - 7) / stepCount;
            let startPoint = 8;
            for (let j = 1; j <= datasetsCount; j++) {
                let endpoint = startPoint + (stepCountinNum * 2);
                datasetSteps = yield getDataset(ws, startPoint, endpoint);
                startPoint = endpoint + 1;
                dataSet[j] = datasetSteps;
            }
        }
        datasetStepsForOriginal["datasets"] = dataSet;
        datasetStepsForOriginal["general"] = general;
        datasetStepsForOriginal["name"] = sheetname;
        return datasetStepsForOriginal;
    });
}
exports.datafromtheSheets = datafromtheSheets;
function Project(ws) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let ProjectRowdata = ws.getRow(4);
        let ProjectNameAndverion = (_a = ProjectRowdata.getCell(2).value) === null || _a === void 0 ? void 0 : _a.toString().split("  ");
        let sprinttNameAndverion = (_b = ProjectRowdata.getCell(2).value) === null || _b === void 0 ? void 0 : _b.toString().split("  ");
        let projectName = ProjectNameAndverion[0];
        let projectVersion = ProjectNameAndverion[1];
        let sprintName = sprinttNameAndverion[0];
        let sprintVersion = sprinttNameAndverion[1];
        let projectData = {
            "projectName": projectName,
            "projectVersion": projectVersion,
            "sprintName": sprintName,
            "sprintVersion": sprintVersion
        };
        return projectData;
    });
}
exports.Project = Project;
function softWare(ws) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let ProjectRowdata = ws.getRow(5);
        let AppNameAndverion = (_a = ProjectRowdata.getCell(2).value) === null || _a === void 0 ? void 0 : _a.toString().split("  ");
        let ServerNameAndverion = (_b = ProjectRowdata.getCell(3).value) === null || _b === void 0 ? void 0 : _b.toString().split("  ");
        let appName = AppNameAndverion[0];
        let appVersion = AppNameAndverion[1];
        let serverName = ServerNameAndverion[0];
        let serverVersion = ServerNameAndverion[1];
        let softwaredata = {
            "serverName": serverName,
            "serverVersion": serverVersion,
            "appName": appName,
            "appVersion": appVersion
        };
        return softwaredata;
    });
}
exports.softWare = softWare;
function getDataset(ws, start, endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        // let steps={};
        let dataset = [];
        for (let i = start + 1; i <= endpoint; i = i + 2) {
            let ReqItemCount = ws.getRow(i + 1).getCell(2).value;
            let ResItemsCount = ws.getRow(i + 1).getCell(2 + ReqItemCount + 1).value;
            let Request = yield getReqdata(ws, i + 1, ReqItemCount);
            let response = yield getResdata(ws, i + 1, ResItemsCount, ReqItemCount);
            let steps = { "request": Request, "response": response };
            dataset.push(steps);
        }
        return dataset;
    });
}
exports.getDataset = getDataset;
function getReqdata(ws, CurrentRow, ReqItemCount) {
    return __awaiter(this, void 0, void 0, function* () {
        let Request = [];
        let row = ws.getRow(CurrentRow);
        for (let i = 3; i <= ReqItemCount + 2; i++) {
            let cellValue = row.getCell(i).value;
            let convertedcellvalue = yield converttoJson(cellValue);
            let stepsinres = { convertedcellvalue };
            Request.push(convertedcellvalue);
        }
        return Request;
    });
}
exports.getReqdata = getReqdata;
function getResdata(ws, CurrentRow, ResItemsCount, ReqItemCount) {
    return __awaiter(this, void 0, void 0, function* () {
        let Response = [];
        let row = ws.getRow(CurrentRow);
        for (let i = ReqItemCount + 4; i <= ResItemsCount + ReqItemCount + 3; i++) {
            let cellValue = row.getCell(i).value;
            let convertedcellvalue = yield converttoJson(cellValue);
            let stepsinres = { convertedcellvalue };
            Response.push(convertedcellvalue);
        }
        return Response;
    });
}
exports.getResdata = getResdata;
function convertCellValuetoJson(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let splitbynn = input.split("\n");
        const json = input.split('\\n').reduce((acc, i) => {
            const [key, value] = i.split(' : ');
            acc[key] = value;
            return acc;
        });
        return json;
    });
}
exports.convertCellValuetoJson = convertCellValuetoJson;
function converttoJson(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let acc;
        var json = {};
        let dynamicControl = {};
        let misc_keys = {};
        let splitbynn = input.split("\n");
        var obj;
        for (let i = 0; i < splitbynn.length; i++) {
            var ss = splitbynn[i].split(' : ');
            let key = ss[0].charAt(0).toLocaleLowerCase() + ss[0].slice(1);
            let value = ss[1];
            if (key.includes("dynamiccontrol-check") || key.includes("dynamicControl-check")) {
                let dynamicControlKey = key.split("-")[1];
                json["dynamicControl"] = { "check": value };
                continue;
            }
            if (MISC_KEYS.includes(key)) {
                misc_keys[key] = value;
                continue;
            }
            json[key] = value;
        }
        json["misc"] = misc_keys;
        return json;
    });
}
exports.converttoJson = converttoJson;
