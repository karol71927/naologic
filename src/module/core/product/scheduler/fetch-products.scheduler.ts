import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SpreadsheetReader } from '../../../generic/spreadsheet/reader/spreadsheet.reader';
import { FileRecord } from './type/file-record';
import { splitArrayIntoBatches } from '../../../../shared/utils/split-array-into-batches';
import { InjectQueue } from '@nestjs/bull';
import { CREATE_PRODUCT_QUEUE_NAME } from '../queue/create-product.queue-name';
import { Queue } from 'bull';
import {
  CREATE_PRODUCT_JOB_NAME,
  CreateProductJob,
} from '../queue/create-product.job';
import { readFile } from 'fs/promises';
import * as path from 'path';
import {
  ADD_DESCRIPTION_TO_PRODUCT_JOB_NAME,
  AddDescriptionToProductJob,
} from '../queue/add-description-to-product.job';

@Injectable()
export class FetchProductsScheduler {
  constructor(
    private readonly spreadsheetReader: SpreadsheetReader,
    @InjectQueue(CREATE_PRODUCT_QUEUE_NAME) private readonly queue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  async fetchDocuments() {
    // TODO: Implement fetching documents from external source
    const buffer = await readFile(
      path.join(__dirname, '../../../../../sample-file.csv'),
    );

    const file = this.spreadsheetReader.read<FileRecord>(buffer);

    const batches = splitArrayIntoBatches<FileRecord>(file, 100);

    for (const batch of batches) {
      await this.queue.add(
        CREATE_PRODUCT_JOB_NAME,
        new CreateProductJob(batch),
      );
    }

    for (const { ProductID } of batches[0].slice(0, 10)) {
      await this.queue.add(
        ADD_DESCRIPTION_TO_PRODUCT_JOB_NAME,
        new AddDescriptionToProductJob(ProductID),
      );
    }
  }
}
