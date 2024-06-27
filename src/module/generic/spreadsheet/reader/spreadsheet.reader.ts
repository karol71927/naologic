import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class SpreadsheetReader {
  read<T>(data: Buffer): T[] {
    const workbook = XLSX.read(data, {
      type: 'buffer',
    });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows: T[] = XLSX.utils.sheet_to_json<T>(sheet);

    return rows;
  }
}
