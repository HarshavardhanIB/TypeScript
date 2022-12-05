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
exports.uploadImg = exports.dynamicTest = exports.jsonInput = exports.excelInput = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs = __importStar(require("fs"));
const jimp_1 = __importDefault(require("jimp"));
const exceltoJson_service_1 = require("../services/exceltoJson.service");
const promises_1 = require("fs/promises");
const formidable = __importStar(require("formidable"));
const seleniumTest_service_1 = require("../services/seleniumTest.service");
const apierr_middleware_1 = __importDefault(require("../middleware/apierr.middleware"));
const fetchXlm_1 = require("../services/fetchXlm");
function excelInput(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let form = new formidable.IncomingForm();
        form.parse(req, function (error, fields, files) {
            return __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    console.log(error);
                }
                else {
                    try {
                        let excelFilepath = yield (0, promises_1.readFile)(files.filetoupload.filepath);
                        console.log('the excel file path is ', excelFilepath);
                        let input = yield (0, exceltoJson_service_1.etj)(files.filetoupload._writeStream.path);
                        let testResult = yield (0, seleniumTest_service_1.test)(input, "chrome");
                        // if (testResult == true) {
                        //     res.status(200).json({
                        //         "statusCode": 200,
                        //         "message": messages.testResult
                        //     })
                        //     res.end();
                        // }
                        // else {
                        //     res.status(200).json({
                        //         "statusCode": 200,
                        //         "message": "error while execue the test"
                        //     })
                        //     res.end();
                        // }
                    }
                    catch (error) {
                        console.log(error);
                        next(apierr_middleware_1.default.badReq("Error in excel input service"));
                    }
                }
            });
        });
    });
}
exports.excelInput = excelInput;
function jsonInput(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const input = req.body;
        let testResult = yield (0, seleniumTest_service_1.test)(input, "chrome");
        next(apierr_middleware_1.default.badReq("Functionality still updating"));
    });
}
exports.jsonInput = jsonInput;
function dynamicTest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { browser, fileType, excelFile, jsonFile } = req.body;
        if (fileType == "excel") {
            console.log("enter");
            var dir = './public/resources/excelFile';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            yield (0, fetchXlm_1.fetchXml)(excelFile, dir);
            let input = yield (0, exceltoJson_service_1.etj)(dir + "/excel.xlsx");
            let testResult = yield (0, seleniumTest_service_1.test)(input, "chrome");
            res.status(200).json({
                "StatusCode": 200,
                "Message": "logs file created successfully.",
                "log": "https://apitracer.aitestpro.com/logfile" + testResult,
                // "log File":"https://apitracer.aitestpro.com/logfile/logfile.txt"
            });
            res.end();
        }
        else {
            const response = yield (0, node_fetch_1.default)(jsonFile);
            const input = yield response.json();
            let testResult = yield (0, seleniumTest_service_1.test)(input, "chrome");
            console.log(testResult);
            // if (testResult == true) {
            //     res.status(200).json({
            //         "StatusCode": 200,
            //         "Message": messages.testResult,
            //         "Log file":testResult
            //     })
            //     res.end();
            // }
            // else {
            //     res.status(200).json({
            //         "StatusCode": 200,
            //         "Message": "error while execue the test"
            //     })
            //     res.end();
            // }
        }
    });
}
exports.dynamicTest = dynamicTest;
// export async function fetchXml(url: string, dir: any) {
//     const streamPipeline = promisify(pipeline);
//     const response = await fetch(url);
//     if (!response.ok) {
//         return false
//     }
//     await streamPipeline(response.body, createWriteStream(dir + '/excel.xlsx'));
//     return true;
// }
function uploadImg(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("upload img");
        let form = new formidable.IncomingForm();
        form.parse(req, function (error, fields, files) {
            return __awaiter(this, void 0, void 0, function* () {
                let data = yield (0, promises_1.readFile)(files.filetoupload.filepath);
                let size = fs.statSync("./1.png").size;
                console.log(">>>>>>", size);
                console.log(data);
                (yield jimp_1.default.read(data)).resize(jimp_1.default.AUTO, 100).write('./public/resources/convertedimg.png');
                console.log("file is created ");
            });
        });
    });
}
exports.uploadImg = uploadImg;
