/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const exportToExcel = (data: any[], fileName: string) => {
    // Chuyển đổi JSON thành worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Tạo workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Ghi file Excel
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
    });

    // Tạo blob và tải file về
    const dataBlob = new Blob([excelBuffer], {
        type: "application/octet-stream"
    });
    saveAs(dataBlob, `${fileName}.xlsx`);
};
export default exportToExcel
