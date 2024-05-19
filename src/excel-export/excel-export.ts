// @ts-ignore
import excel from 'excel4node';

export async function getExcelExportBuffer(fields: { label: string, value: string }[], data: any[]): Promise<Buffer> {
  // Create a new instance of a Workbook class
  var workbook = new excel.Workbook();

  // Add Worksheets to the workbook
  var worksheet = workbook.addWorksheet('Sheet 1');

  // Create a reusable style
  var style = workbook.createStyle({
    font: {
      color: '#000000',
      size: 12
    }
  });

  let k = 1;
  for (const field of fields) {
    worksheet.cell(1, k++).string(field.label).style(style);
  }

  let i = 2;
  for (const item_data of data) {
    let j = 1;
    for (const field of fields) {
      console.log(field.value, item_data[field.value]);
      if (typeof item_data[field.value] === 'number') {
        worksheet.cell(i, j++).number(item_data[field.value]).style(style);
      } else {
        worksheet.cell(i, j++).string(String(item_data[field.value])).style(style);
      }
    }
    i++;
  }

  return await workbook.writeToBuffer();
}
