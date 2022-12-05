import * as excel from 'exceljs';
import * as keys from './responseKeys'
import * as fs from 'fs';
import path from 'path';
let MISC_KEYS = [keys.XPOS, keys.YPOS, keys.PAGEURL, keys.CATEGORY, keys.WAITTIME, keys.ACTIVEVALUE, keys.HEIGHT, keys.WIDTH, keys.STATE]
export async function etj(path:any) {
    console.log("ejt")
    let workbook = new excel.Workbook();
    console.log(path)
    workbook = await workbook.xlsx.readFile(path);
    
    let ws = workbook.worksheets;
    let jsondata: any = [];
    for (let i = 0; i < ws.length; i++) {
        let worksheet = workbook.worksheets[i];
        let data = await datafromtheSheets(worksheet);
        jsondata.push(data);
    }

    fs.writeFileSync("./input.json", JSON.stringify(jsondata));
    console.log("json input created")
    return jsondata;
    

}
export async function datafromtheSheets(ws: excel.Worksheet) {
    let general: any = {};
    let datasetSteps: any;
    let datasetStepsForOriginal: any = {};
    let dataSet: any = {};
    let sheetname = ws.name;
    let geberalObj: any = {};
   
    for (let i = 1; i <= 7; i++) {
        let cellValueatj;
        
        let project = await Project(ws);
        let softwaredata = await softWare(ws);
        let cretaedat: any = ws.getRow(6).getCell(2).value;
        
        let requirement: any = ws.getRow(3).getCell(2).value;
        let testcaseDesc: any = ws.getRow(2).getCell(2).value;
        let prerequisite: any = ws.getRow(7).getCell(2).value;
    
        general["requirement"] = requirement;
        general["testcaseDesc"] = testcaseDesc;
        general["prerequisite"] = prerequisite;
        general["createdAt"] = cretaedat;
        general["Project"] = project;
        general["Software"] = softwaredata;
        let rowEightRow = ws.getRow(8);
        let Firststepvalue: any = rowEightRow.getCell(2).value;
        let stepCountinNum = parseInt(Firststepvalue.split("=")[1]);
        let stepCount: number = 2 * stepCountinNum + 1;
        let NumberofRows: number = ws.rowCount;
        let datasetsCount = (NumberofRows - 7) / stepCount;
        let startPoint: number = 8;
        for (let j = 1; j <= datasetsCount; j++) {
            let endpoint = startPoint + (stepCountinNum * 2);
            datasetSteps = await getDataset(ws, startPoint, endpoint);
            startPoint = endpoint + 1;
         
            dataSet[j] = datasetSteps;
           
        }
    }
    datasetStepsForOriginal["datasets"] = dataSet;
    datasetStepsForOriginal["general"] = general;
    datasetStepsForOriginal["name"] = sheetname;
    return datasetStepsForOriginal;
}
export async function Project(ws: excel.Worksheet) {
    let ProjectRowdata = ws.getRow(4);
    let ProjectNameAndverion: any = ProjectRowdata.getCell(2).value?.toString().split("  ");
    let sprinttNameAndverion: any = ProjectRowdata.getCell(2).value?.toString().split("  ");
    let projectName: string = ProjectNameAndverion[0];
    let projectVersion = ProjectNameAndverion[1];
    let sprintName = sprinttNameAndverion[0];
    let sprintVersion = sprinttNameAndverion[1];
    let projectData = {
        "projectName": projectName,
        "projectVersion": projectVersion,
        "sprintName": sprintName,
        "sprintVersion": sprintVersion
    }
    return projectData;
}
export async function softWare(ws: excel.Worksheet) {

    let ProjectRowdata = ws.getRow(5);
    let AppNameAndverion: any = ProjectRowdata.getCell(2).value?.toString().split("  ");
    let ServerNameAndverion: any = ProjectRowdata.getCell(3).value?.toString().split("  ");
    let appName: string = AppNameAndverion[0];
    let appVersion = AppNameAndverion[1];
    let serverName = ServerNameAndverion[0];
    let serverVersion = ServerNameAndverion[1];
    let softwaredata = {
        "serverName": serverName,
        "serverVersion": serverVersion,
        "appName": appName,
        "appVersion": appVersion
    }
    return softwaredata;



}
export async function getDataset(ws: excel.Worksheet, start: number, endpoint: number) {
    // let steps={};
    let dataset = [];
    for (let i = start + 1; i <= endpoint; i = i + 2) {
        let ReqItemCount: any = ws.getRow(i + 1).getCell(2).value;
        let ResItemsCount: any = ws.getRow(i + 1).getCell(2 + ReqItemCount + 1).value;
        let Request = await getReqdata(ws, i + 1, ReqItemCount);
        let response = await getResdata(ws, i + 1, ResItemsCount, ReqItemCount);
        let steps = { "request": Request, "response": response };
        dataset.push(steps);
    }
    return dataset;
}
export async function getReqdata(ws: excel.Worksheet, CurrentRow: number, ReqItemCount: number) {
    let Request = [];
    let row = ws.getRow(CurrentRow);
    for (let i = 3; i <= ReqItemCount + 2; i++) {
        let cellValue: any = row.getCell(i).value;
        let convertedcellvalue = await converttoJson(cellValue)
        let stepsinres = { convertedcellvalue };
        Request.push(convertedcellvalue);
    }
    return Request;

}
export async function getResdata(ws: excel.Worksheet, CurrentRow: number, ResItemsCount: number, ReqItemCount: number) {
    let Response = [];
    let row = ws.getRow(CurrentRow);
    for (let i = ReqItemCount + 4; i <= ResItemsCount + ReqItemCount + 3; i++) {
        let cellValue: any = row.getCell(i).value;
        let convertedcellvalue = await converttoJson(cellValue)
        let stepsinres = { convertedcellvalue };
        Response.push(convertedcellvalue);
    }
    return Response;
}
export async function convertCellValuetoJson(input: string) {
    let splitbynn = input.split("\n");
    const json = input.split('\\n').reduce((acc: any, i) => {
        const [key, value] = i.split(' : ')
        acc[key] = value
        return acc
    })
    return json;
}
export async function converttoJson(input: string) {
    let acc: any;
    var json: any = {};
    let dynamicControl: any = {};
    let misc_keys: any = {};
    let splitbynn = input.split("\n");
    var obj: any;
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
    json["misc"] = misc_keys
    return json;
}
