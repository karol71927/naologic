export const ADD_DESCRIPTION_TO_PRODUCT_JOB_NAME =
  'ADD_DESCRIPTION_TO_PRODUCT_JOB';

export class AddDescriptionToProductJob {
  readonly name = ADD_DESCRIPTION_TO_PRODUCT_JOB_NAME;

  productId: number;

  constructor(productId: number) {
    this.productId = productId;
  }
}
