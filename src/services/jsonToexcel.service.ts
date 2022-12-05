import * as excel from 'exceljs';
import * as keys from './responseKeys'
import * as fs from 'fs';
let MISC_KEYS = [keys.XPOS, keys.YPOS, keys.PAGEURL, keys.CATEGORY, keys.WAITTIME, keys.ACTIVEVALUE, keys.HEIGHT, keys.WIDTH, keys.STATE]
export async function jsontoexcel(input: any) {
    input = JSON.parse(input);
    const workbook = new excel.Workbook();

    for (let i = 0; i <= input.length - 1; i++) {
        let inputForObj = input[i];
        const sheet = workbook.addWorksheet(inputForObj.name, {
            pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 10 }
        });
        let insetsheet = await inserSheetData(sheet, input[i]);
        // // console.log(input[i])
    }
    workbook.xlsx.writeFile("sample.xlsx");
}
export async function inserSheetData(sheet: excel.Worksheet, input: any) {
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
        let insertDatasetrow = await insertRoe(sheet, sheet.rowCount + 1, ["DataSet=" + j, "steps=" + stepCount])
        await stylesfprexcel(sheet,sheet.rowCount,1,"964B00")
        await stylesfprexcel(sheet,sheet.rowCount,2,"964B00")
        let steps = dataset[j];
        let stepsLength = Object.keys(steps).length;
        for (let k = 0; k < stepsLength; k++) {
            let stepsData = steps[k];
            let requestData = stepsData.Request;
            let reponseData = stepsData.Response;
            let rowNum = sheet.rowCount + 1;
            let insertRowstatus = await insertRowdatatoExcel(sheet, requestData, reponseData, rowNum, k + 1, stepCount);
        }
    }
    styleforFirstSevenows(sheet);
    sheet.getColumn(1).width=20;
    sheet.getColumn(2).width=30;
    console.log("sheet last ")
    console.log(sheet.columnCount);
    for(let i=3;i<sheet.columnCount;i++)
    {
        sheet.getColumn(i).width=35;
    }
    console.log("excel created")
}

export async function insertRoe(sheet: excel.Worksheet, RowNum: number, data: any) {

    try {
        sheet.insertRow(RowNum, data);
    }
    catch (e) {
        console.log(e)
    }
}
export async function insertRowdatatoExcel(sheet: excel.Worksheet, requestData: any, reponseData: any, rowNum: number, currentLoop: number, stepCount: number) {
    let reqCount = requestData.length;
    let resCount = reponseData.length;
    let reqResArrayStatus = await reqResArray(sheet, reqCount, resCount, currentLoop, stepCount, rowNum);
    let reqResData: any = [];
    reqResData.push(" ");
    reqResData.push(reqCount);
    console.log(reqCount)
    for (let i = 0; i <= reqCount - 1; i++) {
        let ReqDataitem = requestData[i];
        let dynamicControl = await ReqDataitem.dynamicControl;
        let miscKeys = await ReqDataitem.misc;
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
        let dynamicControl = await ResDataitem.dynamicControl;
        let miscKeys = await ResDataitem.misc;
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
}
export async function reqResArray(sheet: excel.Worksheet, reqCount: number, resCount: number, currentLoop: number, stepCount: number, RowNum: number) {
    try {
        console.log("req count items "+reqCount)
        let arrayForSteps: any = [];
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
        await insertRoe(sheet, RowNum, arrayForSteps);
        await stylesfprexcel(sheet,RowNum,1,"964B00");
        
        for(let i=2;i<=arrayForSteps.length-resCount-1;i++)
        {
            await stylesfprexcel(sheet,RowNum,i,"FFFF00");
        }
        for(let j=reqCount+3;j<=resCount+reqCount+3;j++)
        {
            await stylesfprexcel(sheet,RowNum,j,"0000FF");
        }
        return true;
    }
    catch (e) {

        console.log(e);
        return false;
    }
}
export async function stylesfprexcel(sheet: excel.Worksheet, Rownum: number, cellNum: number,fgColorCode:string) {
    sheet.getCell(Rownum, cellNum).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fgColorCode }
    };
}
export async function styleforFirstSevenows(sheet: excel.Worksheet) {
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
}