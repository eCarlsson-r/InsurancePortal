import * as XLSX from 'xlsx';

interface ExportOptions {
    fileName: string;
    sheetName?: string;
    currencyColumns?: string[];
}

export function exportTableToExcel(
    data: Record<string, unknown>[],
    options: ExportOptions
) {
    const {
        fileName,
        sheetName = 'Report',
        currencyColumns = [],
    } = options;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Format currency columns
    currencyColumns.forEach((col) => {
        for (let i = 2; i <= data.length + 1; i++) {
            const cellRef = `${col}${i}`;
            if (worksheet[cellRef]) {
                worksheet[cellRef].z = '#,##0.00';
            }
        }
    });

    XLSX.writeFile(workbook, `${fileName}-${new Date().getTime()}.xlsx`);
}
