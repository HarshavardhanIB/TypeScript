"use strict";
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
exports.getElement = void 0;
const selenium_webdriver_1 = require("selenium-webdriver");
function getElement(driver, locatorType, locatorValue) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // console.log('locator value',locatorValue)
            let element;
            if (locatorType == "id") {
                element = yield driver.findElement(selenium_webdriver_1.By.id(locatorValue));
            }
            else if (locatorType == "class") {
                element = yield driver.findElement(selenium_webdriver_1.By.className(locatorValue));
            }
            else {
                element = yield driver.findElement(selenium_webdriver_1.By.xpath(locatorValue));
            }
            return element;
        }
        catch (e) {
            // // console.log("error in this ")
            return null;
        }
    });
}
exports.getElement = getElement;
