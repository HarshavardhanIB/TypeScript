import * as XLSX from 'xlsx';

export async function generateExcel(data:any)
{
    var worksheet = XLSX.utils.json_to_sheet(data);
    var workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook,"userdata.xlsx");
    console.log("entered and excel cretated");
}