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
exports.closeDriver = exports.test = void 0;
const selenium_webdriver_1 = require("selenium-webdriver");
const date = __importStar(require("date-and-time"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const firefox_1 = __importDefault(require("selenium-webdriver/firefox"));
const constants = __importStar(require("./constants"));
const getElement_service_1 = require("./getElement.service");
const openUrl_service_1 = require("./openUrl.service");
const chrome_1 = __importDefault(require("selenium-webdriver/chrome"));
const console_1 = require("console");
let elemntInAction = [constants.ACTION_OPENURL, constants.ACTION_DISPACTIVEPAGE];
function test(input, browser) {
    return __awaiter(this, void 0, void 0, function* () {
        var ostype = os_1.default.type();
        let now = new Date();
        let keyy = '';
        let constNumfilelength = fs.readdirSync('./public/resources/logfile').length;
        const charactersLength = constants.characters.length;
        for (let i = 0; i < 19; i++) {
            keyy += constants.characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        const constFile = date.format(now, 'YYYY-MM-DD');
        var directForlog = './public/resources/logfile';
        if (!fs.existsSync(directForlog)) {
            fs.mkdirSync(directForlog);
        }
        let txtFile = directForlog + "/logfile_" + constNumfilelength + ".txt";
        const myConsole = new console.Console(fs.createWriteStream(txtFile));
        let timestamp = Date.now();
        // let driver = new webdriver.Builder().forBrowser(browser).build();
        // let driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
        let driver;
        let logss = "";
        try {
            console.log("osType", ostype);
            if (ostype == 'Linux') {
                if (browser == "firefox") {
                    var optionsff = new firefox_1.default.Options();
                    optionsff.addArguments("--headless");
                    optionsff.addArguments("--no-sandbox");
                    optionsff.addArguments("start-maximized");
                    optionsff.addArguments("disable-infobars");
                    optionsff.addArguments("--disable-extensions");
                    const serviceBuilder = new firefox_1.default.ServiceBuilder(path_1.default.resolve('./public/resources/drivers/geckodriver'));
                    driver = yield new selenium_webdriver_1.Builder().forBrowser('firefox').setFirefoxService(serviceBuilder).setFirefoxOptions(optionsff).build();
                }
                else {
                    var optionsGC = new chrome_1.default.Options();
                    optionsGC.addArguments("--headless");
                    optionsGC.addArguments("--no-sandbox");
                    optionsGC.addArguments("start-maximized");
                    optionsGC.addArguments("disable-infobars");
                    optionsGC.addArguments("--disable-extensions");
                    const serviceBuilder = new chrome_1.default.ServiceBuilder(path_1.default.resolve('./public/resources/drivers/chromedriver'));
                    driver = yield new selenium_webdriver_1.Builder().forBrowser('chrome').setChromeService(serviceBuilder).setChromeOptions(optionsGC).build();
                }
            }
            else {
                if (browser == "firefox") {
                    const serviceBuilder = new firefox_1.default.ServiceBuilder(path_1.default.resolve('./public/resources/drivers/geckodriver.exe'));
                    driver = yield new selenium_webdriver_1.Builder().forBrowser('firefox').setFirefoxService(serviceBuilder).build();
                }
                else {
                    const serviceBuilder = new chrome_1.default.ServiceBuilder(path_1.default.resolve('./public/resources/drivers/chromedriver.exe'));
                    driver = yield new selenium_webdriver_1.Builder().forBrowser('chrome').setChromeService(serviceBuilder).build();
                }
            }
            let locatorType = "xpath";
            for (let k = 0; k < input.length; k++) {
                console.log('k >>>>>', k);
                let data = yield input[k];
                let testCaseName = data.name;
                let datasets = yield data.datasets;
                for (let m = 1; m <= Object.keys(datasets).length; m++) {
                    let steps = datasets[m];
                    for (let i = 0; i < steps.length; i++) {
                        let element;
                        let OUS;
                        let request = steps[i].request;
                        let response = steps[i].response;
                        for (let j = 0; j < Object.keys(request).length; j++) {
                            let reqData = request[j];
                            if (!elemntInAction.includes(reqData.action)) {
                                element = yield (0, getElement_service_1.getElement)(driver, locatorType, reqData[locatorType]);
                                if (element != null) {
                                    // logss += testCaseName + " sheet in " + [k + 1] + "st dataset " + [m] + " stepnum " + [i + 1] + " request at " + [j + 1] + " locatoe name " + locatorType + " locator value " + reqData.xpath + " widgetname =" + reqData.widgetName + " failed to  get the element in the test case" + "\n";
                                    let times = Math.floor(timestamp / 1000);
                                    logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Request_item_" + [j + 1] + " Widgetname = " + reqData.widgetName + " failed " + constFile + " " + times + "\n";
                                    // myConsole.log(log);
                                    continue;
                                }
                                else {
                                    // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " request at " + [j + 1] + " locatoe name " + locatorType + " locator value " + reqData.xpath + " widgetname =" + reqData.widgetName + "success " + "\n";
                                    let times = Math.floor(timestamp / 1000);
                                    logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Request_item_" + [j + 1] + " Widgetname = " + reqData.widgetName + " Pass " + constFile + " " + times + "\n";
                                    // myConsole.log(log);
                                    continue;
                                }
                            }
                            switch (reqData.action) {
                                case constants.ACTION_OPENURL:
                                    if (driver.getCurrentUrl() == reqData.pageURL) {
                                        continue;
                                    }
                                    OUS = yield (0, openUrl_service_1.openurl)(driver, reqData.value);
                                    if (OUS == false) {
                                        // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " request at " + [j + 1] + "locatoe name " + reqData.xpath + " widgetname =" + reqData.widgetName + " failed to  get the element in the test case" + "\n";
                                        // myConsole.log(log);
                                        let times = Math.floor(timestamp / 1000);
                                        logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Request_item_" + [j + 1] + " Widgetname = " + reqData.widgetName + " failed " + constFile + " " + times + "\n";
                                        continue;
                                    }
                                    else {
                                        // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " request at " + [j + 1] + "locatoe name " + reqData.xpath + " widgetname =" + reqData.widgetName + "success " + "\n";
                                        let times = Math.floor(timestamp / 1000);
                                        logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Request_item_" + [j + 1] + " Widgetname = " + reqData.widgetName + " Pass " + constFile + " " + times + "\n";
                                        // myConsole.log(log);
                                        continue;
                                    }
                                    break;
                                case constants.ACTION_DISPACTIVEPAGE:
                                    if (driver.getCurrentUrl() == reqData.value) {
                                        continue;
                                    }
                                    OUS = yield (0, openUrl_service_1.openurl)(driver, reqData.value);
                                    if (OUS == false) {
                                        // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " request at " + [j + 1] + "locatoe name " + reqData.xpath + " widgetname =" + reqData.widgetName + " fail to  open the url" + "\n"
                                        let times = Math.floor(timestamp / 1000);
                                        logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Request_item_" + [j + 1] + " Widgetname = " + reqData.widgetName + " fail " + constFile + " " + times + "\n";
                                        // myConsole.log(log);
                                        continue;
                                    }
                                    else {
                                        // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " request at " + [j + 1] + "locatoe name " + reqData.xpath + " widgetname =" + reqData.widgetName + "success " + "\n";
                                        // myConsole.log(log);
                                        let times = Math.floor(timestamp / 1000);
                                        logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Request_item_" + [j + 1] + " Widgetname = " + reqData.widgetName + " Pass " + constFile + " " + times + "\n";
                                        continue;
                                    }
                                    break;
                                case constants.ACTION_TEXT:
                                    element.sendKeys(reqData.value);
                                    break;
                                case constants.ACTION_BUTTON:
                                    element.click();
                                    break;
                                case constants.ACTION_ALERTCANCEL:
                                    break;
                                case constants.ACTION_GET_TEXT:
                                    break;
                                case constants.ACTION_INNERTEXT:
                                    break;
                                case constants.ACTION_RC_BUTTON:
                                    break;
                                case constants.ACTION_LINK:
                                    break;
                                case constants.ACTION_DROPDOWN:
                                    break;
                                case constants.ACTION_RADIO:
                                    break;
                                case constants.ACTION_CHECKBOX:
                                    break;
                                case constants.ACTION_CLICKINPUT:
                                    break;
                                case constants.ACTION_CLICKMISC:
                                    break;
                                case constants.ACTION_SWITCHFRAME:
                                    break;
                                case constants.ACTION_SWITCHDEFAULT:
                                    break;
                                case constants.ACTION_SWITCHPARENTFRAME:
                                    break;
                                case constants.ACTION_ALERTOK:
                                    break;
                                case constants.ACTION_ALERTCANCEL:
                                    break;
                                case constants.ACTION_KEY_ENTER:
                                    break;
                                case constants.ACTION_KEY_ESCAPE:
                                    break;
                                case constants.ACTION_KEY_TAB:
                                    break;
                                case constants.ACTION_HANDLE_PRINT:
                                    break;
                                case constants.ACTION_VALIDATE_IMAGE:
                                    break;
                                default:
                            }
                        }
                        for (let n = 0; n < Object.keys(response).length; n++) {
                            // console.log(Object.keys(response).length)
                            let resData = response[n];
                            let valueInweb;
                            // console.log('>>>>>>>',n)
                            // console.log(resData[locatorType]);
                            let element = yield (0, getElement_service_1.getElement)(driver, locatorType, resData[locatorType]);
                            switch (resData.action) {
                                case constants.ACTION_GET_TEXT:
                                    valueInweb = yield element.getAttribute("textContent");
                                    console.log(valueInweb);
                                    if (valueInweb != resData.value) {
                                        // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " failed because the values are not matching" + "\n";
                                        // myConsole.log(log);
                                        let times = Math.floor(timestamp / 1000);
                                        logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " failed and the value in web =" + valueInweb + " " + constFile + " " + times + "\n";
                                    }
                                    else {
                                        // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + "success " + "\n";
                                        // myConsole.log(log);
                                        let times = Math.floor(timestamp / 1000);
                                        logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " Pass " + constFile + " " + times + "\n";
                                        continue;
                                    }
                                    break;
                                case constants.ACTION_VALIDATE_IMAGE:
                                    // let resultForImage: Boolean = await validateImg(element, resData);
                                    // if (resultForImage == false) {
                                    //     let times=Math.floor(timestamp/1000)
                                    //     logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" The image validation is failed "+constFile+" "+times+ "\n";
                                    // }
                                    // else{
                                    //     let times=Math.floor(timestamp/1000)
                                    //     logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" image validation pass "+constFile+" "+times+ "\n";
                                    // }
                                    break;
                                default:
                                    let actualTag = yield element.getAttribute("type");
                                    switch (actualTag) {
                                        case "input":
                                            if (resData.action == constants.ACTION_TEXT) {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success " + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " Pass " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            else {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " failed " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            break;
                                        case "text":
                                            if (resData.action == constants.ACTION_TEXT) {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success " + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " Pass " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            else {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " failed " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            break;
                                        case "password":
                                            if (resData.action = constants.ACTION_TEXT) {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success " + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " Pass " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            else {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " failed " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            break;
                                        case "email":
                                            if (resData.action = constants.ACTION_TEXT) {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " Pass " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            else {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " failed " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            break;
                                        case "tel":
                                            break;
                                        case "reset":
                                            if (resData.action = constants.ACTION_BUTTON) {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " Pass " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            else {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " failed " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            break;
                                        case "submit":
                                            if (resData.action = constants.ACTION_BUTTON) {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " Pass " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            else {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " failed " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            break;
                                        case "a":
                                            if (resData.action = constants.ACTION_LINK) {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " Pass " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            else {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " failed " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            break;
                                        case "button":
                                            if (resData.action = constants.ACTION_BUTTON) {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " Pass " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            else {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " failed " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            break;
                                        case "select":
                                            if (resData.action = constants.ACTION_DROPDOWN) {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " Pass " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            else {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " failed " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            break;
                                        case "radio":
                                            if (resData.action = constants.ACTION_RADIO) {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " Pass " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            else {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " failed " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            break;
                                        case "checkbox":
                                            if (resData.action = constants.ACTION_CHECKBOX) {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " Pass " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            else {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " failed " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            break;
                                        case "span":
                                        case "p":
                                            if (resData.action = constants.ACTION_GET_TEXT) {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " Pass " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            else {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " failed " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            break;
                                        case "textarea":
                                            if (resData.action = constants.ACTION_TEXT) {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " Pass " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            else {
                                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                                // myConsole.log(log);
                                                let times = Math.floor(timestamp / 1000);
                                                logss += testCaseName + " TC_" + [k + 1] + " Dataset_" + [m] + " Steps_" + [i + 1] + " Response_item_" + [n + 1] + " Widgetname = " + resData.widgetName + " failed " + constFile + " " + times + "\n";
                                                continue;
                                            }
                                            break;
                                        default:
                                            resData.action = "";
                                    }
                            }
                        }
                    }
                }
            }
            console.log("******************************finished*******************************************");
            driver.close();
            console.log(console_1.log);
            // writeFile(directForlog+"/log file "+nowdate+".txt",log);
            myConsole.log(console_1.log);
            return "/logfile_" + constNumfilelength + ".txt";
        }
        catch (e) {
            driver.close();
            if (e == "NoSuchElementError") {
                myConsole.log(e);
            }
            // fs.writeFileSync( directForlog + "/logfile" + constFile + ".txt",log);
            // return directForlog + "/log file " + constFile + ".txt";
            myConsole.log(logss);
            return "/logfile_" + constNumfilelength + ".txt";
        }
        finally {
            // fs.writeFileSync( directForlog + "/logfile" + constFile + ".txt",log);
        }
        myConsole.log(console_1.log);
        return "/logfile_" + constNumfilelength + ".txt";
    });
}
exports.test = test;
function closeDriver(driver) {
    return __awaiter(this, void 0, void 0, function* () {
        driver.close();
    });
}
exports.closeDriver = closeDriver;
