import { FileRecord } from '../scheduler/type/file-record';

export const CREATE_PRODUCT_JOB_NAME = 'CREATE_PRODUCT_JOB';

export class CreateProductJob {
  readonly name = CREATE_PRODUCT_JOB_NAME;
  readonly data: FileRecord[];

  constructor(data: FileRecord[]) {
    this.data = data;
  }
}
