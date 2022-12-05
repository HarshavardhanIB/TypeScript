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
exports.styleforFirstSevenows = exports.stylesfprexcel = exports.reqResArray = exports.insertRowdatatoExcel = exports.insertRoe = exports.inserSheetData = exports.jsontoexcel = void 0;
const excel = __importStar(require("exceljs"));
const keys = __importStar(require("./responseKeys"));
let MISC_KEYS = [keys.XPOS, keys.YPOS, keys.PAGEURL, keys.CATEGORY, keys.WAITTIME, keys.ACTIVEVALUE, keys.HEIGHT, keys.WIDTH, keys.STATE];
function jsontoexcel(input) {
    return __awaiter(this, void 0, void 0, function* () {
        input = JSON.parse(input);
        const workbook = new excel.Workbook();
        for (let i = 0; i <= input.length - 1; i++) {
            let inputForObj = input[i];
            const sheet = workbook.addWorksheet(inputForObj.name, {
                pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 10 }
            });
            let insetsheet = yield inserSheetData(sheet, input[i]);
            // // console.log(input[i])
        }
        workbook.xlsx.writeFile("sample.xlsx");
    });
}
exports.jsontoexcel = jsontoexcel;
function inserSheetData(sheet, input) {
    return __awaiter(this, void 0, void 0, function* () {
        let generalObj = input.general;
        let dataset = input.datasets;
        let software = generalObj.Software;
        let Project = generalObj.Project;
        sheet.getCell('A1').value = "Name";
        sheet.getCell('B1').value = input.name;
        sheet.getCell('A2').value = "Description";
        sheet.getCell('B2').value = generalObj.testcaseDesc;
        sheet.getCell('A3').value = "Requirement";
        sheet.getCell('B3').value = generalObj.requirement;
        sheet.getCell('A4').value = "Project";
        sheet.getCell('B4').value = Project.projectName + " " + Project.projectVersion;
        sheet.getCell('C4').value = Project.sprintName + " " + Project.sprintVersion;
        sheet.getCell('A5').value = "Software";
        sheet.getCell('B5').value = software.serverName + " " + software.serverVersion;
        sheet.getCell('C5').value = software.appName + " " + software.appVersion;
        sheet.getCell('A6').value = "Created On";
        sheet.getCell('B6').value = generalObj.createdAt;
        sheet.getCell('A7').value = "Prerequisite";
        sheet.getCell('B7').value = generalObj.prerequisite;
        let datasetCount = Object.keys(dataset).length;
        let stepCount = dataset[1].length;
        for (let j = 1; j <= datasetCount - 3; j++) {
            let insertDatasetrow = yield insertRoe(sheet, sheet.rowCount + 1, ["DataSet=" + j, "steps=" + stepCount]);
            yield stylesfprexcel(sheet, sheet.rowCount, 1, "964B00");
            yield stylesfprexcel(sheet, sheet.rowCount, 2, "964B00");
            let steps = dataset[j];
            let stepsLength = Object.keys(steps).length;
            for (let k = 0; k < stepsLength; k++) {
                let stepsData = steps[k];
                let requestData = stepsData.Request;
                let reponseData = stepsData.Response;
                let rowNum = sheet.rowCount + 1;
                let insertRowstatus = yield insertRowdatatoExcel(sheet, requestData, reponseData, rowNum, k + 1, stepCount);
            }
        }
        styleforFirstSevenows(sheet);
        sheet.getColumn(1).width = 20;
        sheet.getColumn(2).width = 30;
        console.log("sheet last ");
        console.log(sheet.columnCount);
        for (let i = 3; i < sheet.columnCount; i++) {
            sheet.getColumn(i).width = 35;
        }
        console.log("excel created");
    });
}
exports.inserSheetData = inserSheetData;
function insertRoe(sheet, RowNum, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            sheet.insertRow(RowNum, data);
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.insertRoe = insertRoe;
function insertRowdatatoExcel(sheet, requestData, reponseData, rowNum, currentLoop, stepCount) {
    return __awaiter(this, void 0, void 0, function* () {
        let reqCount = requestData.length;
        let resCount = reponseData.length;
        let reqResArrayStatus = yield reqResArray(sheet, reqCount, resCount, currentLoop, stepCount, rowNum);
        let reqResData = [];
        reqResData.push(" ");
        reqResData.push(reqCount);
        console.log(reqCount);
        for (let i = 0; i <= reqCount - 1; i++) {
            let ReqDataitem = requestData[i];
            let dynamicControl = yield ReqDataitem.dynamicControl;
            let miscKeys = yield ReqDataitem.misc;
            let reqString = "";
            reqString = "Action" + " : " + ReqDataitem["action"] + "\n" +
                "ActionableEvent" + " : " + miscKeys["actionableEvent"] + "\n" +
                "Category" + " : " + miscKeys["category"] + "\n" +
                "ClassName" + " : " + ReqDataitem["className"] + "\n" +
                "Css" + " : " + ReqDataitem["css"] + "\n" +
                "DynamicControl-" + Object.keys(dynamicControl)[0] + " : " + dynamicControl[Object.keys(dynamicControl)[0]] + "\n" +
                "Execute" + " : " + ReqDataitem["execute"] + "\n" +
                "Id" + " : " + ReqDataitem["id"] + "\n" +
                "Position_X" + " : " + miscKeys["position_X"] + "\n" +
                "Position_Y" + " : " + miscKeys["position_Y"] + "\n" +
                "Value" + " : " + ReqDataitem["value"] + "\n" +
                "WaitTime" + " : " + miscKeys["waitTime"] + "\n" +
                "WidgetName" + " : " + ReqDataitem["widgetName"] + "\n" +
                "Xpath" + " : " + ReqDataitem["xpath"] + "\n" +
                "XpathRelative" + " : " + ReqDataitem["xpathRelative"] + "\n";
            reqResData.push(reqString);
        }
        reqResData.push(resCount);
        for (let i = 0; i <= resCount - 1; i++) {
            let ResDataitem = reponseData[i];
            let dynamicControl = yield ResDataitem.dynamicControl;
            let miscKeys = yield ResDataitem.misc;
            let reqString = "";
            reqString = "Action" + " : " + ResDataitem["action"] + "\n" +
                "ActionableEvent" + " : " + miscKeys["actionableEvent"] + "\n" +
                "Category" + " : " + miscKeys["category"] + "\n" +
                "ClassName" + " : " + ResDataitem["className"] + "\n" +
                "Css" + " : " + ResDataitem["css"] + "\n" +
                "DynamicControl-" + Object.keys(dynamicControl)[0] + " : " + dynamicControl[Object.keys(dynamicControl)[0]] + "\n" +
                "Execute" + " : " + ResDataitem["execute"] + "\n" +
                "Id" + " : " + ResDataitem["id"] + "\n" +
                "Position_X" + " : " + miscKeys["position_X"] + "\n" +
                "Position_Y" + " : " + miscKeys["position_Y"] + "\n" +
                "Value" + " : " + ResDataitem["value"] + "\n" +
                "WaitTime" + " : " + miscKeys["waitTime"] + "\n" +
                "WidgetName" + " : " + ResDataitem["widgetName"] + "\n" +
                "Xpath" + " : " + ResDataitem["xpath"] + "\n" +
                "XpathRelative" + " : " + ResDataitem["xpathRelative"] + "\n" +
                "Actionable" + " : " + ResDataitem["actionable"] + "\n" +
                "Height" + " : " + miscKeys["height"] + "\n" +
                "Width" + " : " + miscKeys["width"] + "\n" +
                "State" + " : " + miscKeys["state"] + "\n";
            reqResData.push(reqString);
        }
        insertRoe(sheet, sheet.rowCount + 1, reqResData);
    });
}
exports.insertRowdatatoExcel = insertRowdatatoExcel;
function reqResArray(sheet, reqCount, resCount, currentLoop, stepCount, RowNum) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("req count items " + reqCount);
            let arrayForSteps = [];
            let stepsNum = "Step:" + currentLoop + ":" + stepCount;
            arrayForSteps.push(stepsNum);
            arrayForSteps.push("Request Items Count");
            for (let i = 1; i <= reqCount; i++) {
                arrayForSteps.push("Request_Item " + i);
            }
            arrayForSteps.push("Response Items Count");
            for (let i = 1; i <= resCount; i++) {
                arrayForSteps.push("Response_Item " + i);
            }
            yield insertRoe(sheet, RowNum, arrayForSteps);
            yield stylesfprexcel(sheet, RowNum, 1, "964B00");
            for (let i = 2; i <= arrayForSteps.length - resCount - 1; i++) {
                yield stylesfprexcel(sheet, RowNum, i, "FFFF00");
            }
            for (let j = reqCount + 3; j <= resCount + reqCount + 3; j++) {
                yield stylesfprexcel(sheet, RowNum, j, "0000FF");
            }
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    });
}
exports.reqResArray = reqResArray;
function stylesfprexcel(sheet, Rownum, cellNum, fgColorCode) {
    return __awaiter(this, void 0, void 0, function* () {
        sheet.getCell(Rownum, cellNum).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fgColorCode }
        };
    });
}
exports.stylesfprexcel = stylesfprexcel;
function styleforFirstSevenows(sheet) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 1; i <= 8; i++) {
            for (let j = 1; j <= 2; j++) {
                sheet.getCell(i, j).fill =
                    {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '964B00' }
                    };
            }
        }
        for (let i = 4; i <= 5; i++) {
            sheet.getCell(i, 3).fill =
                {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '964B00' }
                };
        }
    });
}
exports.styleforFirstSevenows = styleforFirstSevenows;
