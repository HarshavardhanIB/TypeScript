import express, { Response, request, NextFunction } from "express";
import { Builder, Capabilities, By, Key, until } from 'selenium-webdriver';
import * as webdriver from 'selenium-webdriver';
import fetch from 'node-fetch';
import * as date from 'date-and-time';
import * as fs from 'fs';
import path from "path";
import os from 'os';
import firefox from 'selenium-webdriver/firefox';
import { etj } from './exceltoJson.service'
import { IncomingMessage } from 'http';
import { readFile, writeFile } from 'fs/promises';
import * as constants from './constants'
import { getElement } from './getElement.service'
import { openurl } from './openUrl.service'
import { validateImg } from './validateImg.service'
import chrome, { Driver } from "selenium-webdriver/chrome";
import { dir, log } from "console";
import { Console } from 'console';

let elemntInAction: string[] = [constants.ACTION_OPENURL, constants.ACTION_DISPACTIVEPAGE];
export async function test(input: any, browser: string) {
    var ostype = os.type();
    let now = new Date();
    let keyy = '';
    let constNumfilelength=fs.readdirSync('./public/resources/logfile').length
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
    let driver: any;
    let logss  = "";
    try {
        console.log("osType", ostype);
        if (ostype == 'Linux') {
            if (browser == "firefox") {
                var optionsff = new firefox.Options();
                optionsff.addArguments("--headless");
                optionsff.addArguments("--no-sandbox");
                optionsff.addArguments("start-maximized");
                optionsff.addArguments("disable-infobars");
                optionsff.addArguments("--disable-extensions");
                const serviceBuilder = new firefox.ServiceBuilder(path.resolve('./public/resources/drivers/geckodriver'));
                driver = await new Builder().forBrowser('firefox').setFirefoxService(serviceBuilder).setFirefoxOptions(optionsff).build();
            }
            else {
                var optionsGC = new chrome.Options();
                optionsGC.addArguments("--headless");
                optionsGC.addArguments("--no-sandbox");
                optionsGC.addArguments("start-maximized");
                optionsGC.addArguments("disable-infobars");
                optionsGC.addArguments("--disable-extensions");
                const serviceBuilder = new chrome.ServiceBuilder(path.resolve('./public/resources/drivers/chromedriver'));
                driver = await new Builder().forBrowser('chrome').setChromeService(serviceBuilder).setChromeOptions(optionsGC).build();
            }
        }
        else {
            if (browser == "firefox") {
                const serviceBuilder = new firefox.ServiceBuilder(path.resolve('./public/resources/drivers/geckodriver.exe'));
                driver = await new Builder().forBrowser('firefox').setFirefoxService(serviceBuilder).build();
            }
            else {

                const serviceBuilder = new chrome.ServiceBuilder(path.resolve('./public/resources/drivers/chromedriver.exe'));
                driver = await new Builder().forBrowser('chrome').setChromeService(serviceBuilder).build();
            }
        }
       

        let locatorType: any = "xpath";
        for (let k = 0; k < input.length; k++) {
            console.log('k >>>>>', k)
            let data: any = await input[k];
            let testCaseName: any = data.name;
            let datasets: any = await data.datasets;
            for (let m = 1; m <= Object.keys(datasets).length; m++) {
                let steps = datasets[m];
                for (let i = 0; i < steps.length; i++) {
                    let element: any;
                    let OUS: any;
                    let request = steps[i].request;
                    let response = steps[i].response;
                    for (let j = 0; j < Object.keys(request).length; j++) {
                        let reqData = request[j];
                        if (!elemntInAction.includes(reqData.action)) {
                            element = await getElement(driver, locatorType, reqData[locatorType]);
                            if (element != null) {
                               
                                // logss += testCaseName + " sheet in " + [k + 1] + "st dataset " + [m] + " stepnum " + [i + 1] + " request at " + [j + 1] + " locatoe name " + locatorType + " locator value " + reqData.xpath + " widgetname =" + reqData.widgetName + " failed to  get the element in the test case" + "\n";
                                let times=Math.floor(timestamp/1000)
                                logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Request_item_"+[j + 1]+" Widgetname = "+ reqData.widgetName+" failed "+constFile+" "+times+ "\n";
                                // myConsole.log(log);
                                continue;
                            }
                            else {
                                // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " request at " + [j + 1] + " locatoe name " + locatorType + " locator value " + reqData.xpath + " widgetname =" + reqData.widgetName + "success " + "\n";
                                let times=Math.floor(timestamp/1000)
                                logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Request_item_"+[j + 1]+" Widgetname = "+ reqData.widgetName+" Pass "+constFile+" "+times+ "\n";
                               
                                // myConsole.log(log);
                                continue;
                            }
                        }
                        switch (reqData.action) {
                            case constants.ACTION_OPENURL:
                                if (driver.getCurrentUrl() == reqData.pageURL) {
                                    continue;
                                }
                                OUS = await openurl(driver, reqData.value);
                                if (OUS == false) {
                                    // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " request at " + [j + 1] + "locatoe name " + reqData.xpath + " widgetname =" + reqData.widgetName + " failed to  get the element in the test case" + "\n";
                                    // myConsole.log(log);
                                    let times=Math.floor(timestamp/1000)
                                    logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Request_item_"+[j + 1]+" Widgetname = "+ reqData.widgetName+" failed "+constFile+" "+times+ "\n";
                                
                                    continue;
                                }
                                else {
                                    // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " request at " + [j + 1] + "locatoe name " + reqData.xpath + " widgetname =" + reqData.widgetName + "success " + "\n";
                                    let times=Math.floor(timestamp/1000)
                                    logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Request_item_"+[j + 1]+" Widgetname = "+ reqData.widgetName+" Pass "+constFile+" "+times+ "\n";
                                   // myConsole.log(log);
                                    continue;
                                }
                                break;
                            case constants.ACTION_DISPACTIVEPAGE:
                                if (driver.getCurrentUrl() == reqData.value) {
                                    continue;
                                }
                                OUS = await openurl(driver, reqData.value);
                                if (OUS == false) {
                                    // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " request at " + [j + 1] + "locatoe name " + reqData.xpath + " widgetname =" + reqData.widgetName + " fail to  open the url" + "\n"
                                    let times=Math.floor(timestamp/1000)
                                    logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Request_item_"+[j + 1]+" Widgetname = "+ reqData.widgetName+" fail "+constFile+" "+times+ "\n";
                                    // myConsole.log(log);
                                    continue;
                                }
                                else {
                                    // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " request at " + [j + 1] + "locatoe name " + reqData.xpath + " widgetname =" + reqData.widgetName + "success " + "\n";
                                    // myConsole.log(log);
                                    let times=Math.floor(timestamp/1000)
                                    logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Request_item_"+[j + 1]+" Widgetname = "+ reqData.widgetName+" Pass "+constFile+" "+times+ "\n";
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
                        let valueInweb: any;
                        // console.log('>>>>>>>',n)
                        // console.log(resData[locatorType]);
                        let element: any = await getElement(driver, locatorType, resData[locatorType]);
                        switch (resData.action) {
                            case constants.ACTION_GET_TEXT:
                                valueInweb =await element.getAttribute("textContent");
                                console.log(valueInweb);
                                if (valueInweb != resData.value) {
                                    // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " failed because the values are not matching" + "\n";
                                    // myConsole.log(log);
                                    let times=Math.floor(timestamp/1000)
                                    logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" failed and the value in web ="+valueInweb+" "+constFile+" "+times+ "\n";
                                }
                                else {
                                    // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + "success " + "\n";
                                    // myConsole.log(log);
                                    let times=Math.floor(timestamp/1000)
                                    logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" Pass "+constFile+" "+times+ "\n";
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
                                let actualTag = await element.getAttribute("type");
                                switch (actualTag) {
                                    case "input":
                                        if (resData.action == constants.ACTION_TEXT) {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success " + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" Pass "+constFile+" "+times+ "\n";
                                            continue;
                                        }
                                        else {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" failed "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        break;
                                    case "text":

                                        if (resData.action == constants.ACTION_TEXT) {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success " + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" Pass "+constFile+" "+times+ "\n";
                                            continue;
                                        }
                                        else {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" failed "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        break;
                                    case "password":
                                        if (resData.action = constants.ACTION_TEXT) {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success " + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" Pass "+constFile+" "+times+ "\n";
                                            continue;
                                        }
                                        else {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" failed "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        break;
                                    case "email":
                                        if (resData.action = constants.ACTION_TEXT) {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" Pass "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        else {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" failed "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        break;
                                    case "tel":
                                        break;
                                    case "reset":
                                        if (resData.action = constants.ACTION_BUTTON) {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" Pass "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        else {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" failed "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        break;
                                    case "submit":
                                        if (resData.action = constants.ACTION_BUTTON) {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" Pass "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        else {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" failed "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        break;
                                    case "a":
                                        if (resData.action = constants.ACTION_LINK) {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" Pass "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        else {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" failed "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        break;
                                    case "button":
                                        if (resData.action = constants.ACTION_BUTTON) {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" Pass "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        else {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" failed "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        break;

                                    case "select":
                                        if (resData.action = constants.ACTION_DROPDOWN) {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" Pass "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        else {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" failed "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        break;
                                    case "radio":
                                        if (resData.action = constants.ACTION_RADIO) {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" Pass "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        else {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" failed "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        break;
                                    case "checkbox":
                                        if (resData.action = constants.ACTION_CHECKBOX) {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" Pass "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        else {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" failed "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        break;
                                    case "span":
                                    case "p":
                                        if (resData.action = constants.ACTION_GET_TEXT) {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" Pass "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        else {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" failed "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        break;
                                    case "textarea":
                                        if (resData.action = constants.ACTION_TEXT) {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " success" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" Pass "+constFile+" "+times+ "\n";
                                            
                                            continue;
                                        }
                                        else {
                                            // logss += testCaseName + " sheet in " + [k + 1] + " dataset " + [m] + " stepnum " + [i + 1] + " response at " + [n + 1] + " locatoe name " + locatorType + " locator value " + resData.xpath + " widgetname =" + resData.widgetName + " fail because the values are not matching" + "\n";
                                            // myConsole.log(log);
                                            let times=Math.floor(timestamp/1000)
                                            logss += testCaseName +" TC_"+[k+1]+" Dataset_"+[m]+" Steps_"+[i+1]+" Response_item_"+[n + 1]+" Widgetname = "+ resData.widgetName+" failed "+constFile+" "+times+ "\n";
                                            
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
        console.log("******************************finished*******************************************")
        driver.close();
        console.log(log)
        // writeFile(directForlog+"/log file "+nowdate+".txt",log);
        myConsole.log(log);
        return "/logfile_" +constNumfilelength + ".txt";
    }
    catch (e: any) {
        driver.close();
        if (e == "NoSuchElementError") {
            myConsole.log(e);
        }
        // fs.writeFileSync( directForlog + "/logfile" + constFile + ".txt",log);
        // return directForlog + "/log file " + constFile + ".txt";
        
        myConsole.log(logss);
        return "/logfile_" +constNumfilelength + ".txt";
    }
    finally {
        // fs.writeFileSync( directForlog + "/logfile" + constFile + ".txt",log);
    }

    myConsole.log(log);
    return "/logfile_" +constNumfilelength + ".txt";

}
export async function closeDriver(driver: any) {
    driver.close();
}