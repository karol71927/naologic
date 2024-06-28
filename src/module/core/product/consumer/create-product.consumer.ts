import { Process, Processor } from '@nestjs/bull';
import { CREATE_PRODUCT_QUEUE_NAME } from '../queue/create-product.queue-name';
import { Job } from 'bull';
import {
  CREATE_PRODUCT_JOB_NAME,
  CreateProductJob,
} from '../queue/create-product.job';
import { Logger } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { Product } from '../model/product.model';
import { ProductVariant } from '../model/product-variant.model';
import { FileRecord } from '../scheduler/type/file-record';
import { nanoid } from 'nanoid';
import { ProductOption } from '../model/product-option.model';

@Processor(CREATE_PRODUCT_QUEUE_NAME)
export class CreateProductConsumer {
  private readonly logger = new Logger(CreateProductConsumer.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly orm: MikroORM, //required by create request context decorator
  ) {}

  @Process(CREATE_PRODUCT_JOB_NAME)
  @CreateRequestContext()
  async handle(job: Job<CreateProductJob>) {
    this.logger.debug(`Handler invoked`, job.data);

    const productsData = job.data.batch.data;

    const groupedProducts = this.groupRecordsByProductId(productsData);

    for (const [productId, productData] of groupedProducts) {
      if (!productId) {
        this.logger.debug('Product ID is missing', productData[0].ProductName);
        continue;
      }
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
          'inventory',
          nanoid(),
          nanoid(),
          'members-only',
        );
      }

      for (const variantData of productData) {
        const variant = product.variants.find(
          (variant) => variant.itemId === variantData.ItemID,
        );

        if (!variant) {
          this.logger.debug(
            `Product ${productId} - ${productData[0].ProductName} does not have variant ${variantData.ItemID} creating new one`,
          );

          const newProductVariant = new ProductVariant(
            variantData.ItemID,
            variantData.ItemDescription,
            variantData.ItemDescription,
            variantData.UnitPrice,
            variantData.ManufacturerItemCode,
            variantData.QuantityOnHand,
            variantData.Availability,
            variantData.QuantityOnHand > 0,
            {},
            variantData.UnitPrice,
            'USD',
            null,
            null,
            null,
            null,
            null,
            variantData.PKG,
            variantData.UnitPrice,
            null,
            null,
            null,
            null,
            nanoid(),
            nanoid(),
            nanoid(),
            nanoid(),
            true,
            [
              {
                name: variantData.ImageFileName,
                url: variantData.ItemImageURL,
              },
            ],
          );

          product.variants.push(newProductVariant);

          const packagingOptions = this.createOptions(
            product,
            'packaging',
            variantData.PKG,
          );
          const descriptionOptions = this.createOptions(
            product,
            'description',
            variantData.ItemDescription,
          );

          product.options = [descriptionOptions, packagingOptions];
        } else {
          this.logger.debug(
            `Product ${productId} - ${productData[0].ProductName} has variant ${variantData.ItemID} updating`,
          );

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

  private createOptions(
    product: Product,
    type: 'description' | 'packaging',
    value: string,
  ): ProductOption {
    const packagingOptions = product.options.find(
      (option) => option.name === type,
    );

    if (packagingOptions) {
      packagingOptions.values.push({
        id: nanoid(),
        name: nanoid(),
        value: value,
      });
      return packagingOptions;
    }
    return new ProductOption(
      'packaging',
      [
        {
          id: nanoid(),
          name: nanoid(),
          value: value,
        },
      ],
      nanoid(),
      null,
    );
  }
}
