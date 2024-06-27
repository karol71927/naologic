import { Module } from '@nestjs/common';
import { SpreadsheetReader } from './reader/spreadsheet.reader';

@Module({
  providers: [SpreadsheetReader],
  exports: [SpreadsheetReader],
})
export class SpreadsheetModule {}
