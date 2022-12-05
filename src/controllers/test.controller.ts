import express, { Response, Request, NextFunction } from "express";
import * as webdriver from 'selenium-webdriver';
import fetch from 'node-fetch';
import * as date from 'date-and-time';
import * as fs from 'fs';
import Jimp from 'jimp';
import axios from 'axios';
import * as messages from '../services/messges'
import { etj } from '../services/exceltoJson.service'
import { readFile, writeFile } from 'fs/promises';
import * as formidable from 'formidable';
import * as constants from '../services/constants'
import { test } from '../services/seleniumTest.service'
import apiErrHandler from "../middleware/apiErrHandler.middleware";
import apierr from "../middleware/apierr.middleware";
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import {fetchXml} from '../services/fetchXlm'
export async function excelInput(req: Request, res: Response, next: NextFunction) {
    let form = new formidable.IncomingForm();
    form.parse(req, async function (error, fields, files: any) {
        if (error) {
            console.log(error)
        }
        else {

            try {
                let excelFilepath: any = await readFile(files.filetoupload.filepath);
                console.log('the excel file path is ', excelFilepath)
                let input = await etj(files.filetoupload._writeStream.path);
                let testResult = await test(input, "chrome");
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
                console.log(error)
                next(apierr.badReq("Error in excel input service"));
            }
        }

    })
}
export async function jsonInput(req: Request, res: Response, next: NextFunction) {
    const input = req.body;
    let testResult = await test(input, "chrome");
    next(apierr.badReq("Functionality still updating"))
}
export async function dynamicTest(req: Request, res: Response, next: NextFunction) {
    const { browser, fileType, excelFile, jsonFile } = req.body;
    if (fileType == "excel") {
        console.log("enter")
        var dir = './public/resources/excelFile';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        await fetchXml(excelFile,dir);
        let input = await etj(dir + "/excel.xlsx");
        let testResult = await test(input, "chrome");     
            res.status(200).json({
                "StatusCode": 200,
                "Message": "logs file created successfully.",
                "log":"https://apitracer.aitestpro.com/logfile"+testResult,
                // "log File":"https://apitracer.aitestpro.com/logfile/logfile.txt"
            })
            res.end();
    }
    else {
        const response = await fetch(jsonFile);
        const input = await response.json();
        let testResult = await test(input, "chrome");
        console.log(testResult)
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

}
// export async function fetchXml(url: string, dir: any) {
//     const streamPipeline = promisify(pipeline);
//     const response = await fetch(url);
//     if (!response.ok) {
//         return false
//     }
//     await streamPipeline(response.body, createWriteStream(dir + '/excel.xlsx'));
//     return true;
// }
export async function uploadImg(req: Request, res: Response, next: NextFunction) {
    console.log("upload img");
    let form = new formidable.IncomingForm();    
    form.parse(req, async function (error, fields, files: any) {
        let data: any = await readFile(files.filetoupload.filepath);
        let size=fs.statSync("./1.png").size;
        console.log(">>>>>>",size)
        console.log(data);
        (await Jimp.read(data)).resize(Jimp.AUTO,100).write('./public/resources/convertedimg.png');   
        console.log("file is created ")
})
}