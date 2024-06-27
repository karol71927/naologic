import { Process, Processor } from '@nestjs/bull';
import { CREATE_PRODUCT_QUEUE_NAME } from '../queue/create-product.queue-name';
import { Job } from 'bull';
import { CreateProductJob } from '../queue/create-product.job';
import { Logger } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { Product } from '../model/product.model';
import { ProductVariant } from '../model/product-variant.model';
import { FileRecord } from '../scheduler/type/file-record';

@Processor(CREATE_PRODUCT_QUEUE_NAME)
export class CreateProductConsumer {
  private readonly logger = new Logger(CreateProductConsumer.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly orm: MikroORM, //required by create request context decorator
  ) {}

  @Process()
  @CreateRequestContext()
  async handle(job: Job<CreateProductJob>) {
    this.logger.debug(`Handler invoked`);

    const productsData = job.data.data;

    const groupedProducts = this.groupRecordsByProductId(productsData);

    for (const [productId, productData] of groupedProducts) {
      let product =
        await this.productRepository.findOneByProductIdWithVariants(productId);

      if (!product) {
        this.logger.debug(
          `Product ${productId} - ${productData[0].ProductName} does not exist creating new one`,
        );

        product = new Product(
          productId,
          productData[0].ProductName,
          productData[0].ProductDescription,
          productData[0].ManufacturerName,
        );
      }

      for (const variantData of productData) {
        const variant = product.variants
          .getItems()
          .find((variant) => variant.itemId === variantData.ItemID);

        if (!variant) {
          const newProductVariant = new ProductVariant(
            variantData.ItemID,
            variantData.ItemDescription,
            variantData.ItemDescription,
            variantData.UnitPrice,
            variantData.ManufacturerItemCode,
            variantData.QuantityOnHand,
            variantData.Availability,
            variantData.NDCItemCode,
            {
              name: variantData.ImageFileName,
              url: variantData.ItemImageURL,
            },
          );

          product.variants.add(newProductVariant);
        } else {
          variant.quantity = variantData.QuantityOnHand;
          variant.unitPrice = variantData.UnitPrice;
          variant.availability = variantData.Availability;
        }
      }

      await this.productRepository.getEntityManager().persistAndFlush(product);
    }
  }

  private groupRecordsByProductId(
    records: FileRecord[],
  ): Map<number, FileRecord[]> {
    const map = new Map<number, FileRecord[]>();

    for (const record of records) {
      const value = map.get(record.ProductID) ?? [];
      value.push(record);
      map.set(record.ProductID, value);
    }

    return map;
  }
}
