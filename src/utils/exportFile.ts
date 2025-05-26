import * as XLSX from 'xlsx';

const exportToExcel = (data: unknown[][], fileName: string) => {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export default exportToExcel;
