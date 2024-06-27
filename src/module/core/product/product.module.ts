import { Module } from '@nestjs/common';
import { FetchProductsScheduler } from './scheduler/fetch-products.scheduler';
import { Product } from './model/product.model';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BullModule } from '@nestjs/bull';
import { CREATE_PRODUCT_QUEUE_NAME } from './queue/create-product.queue-name';
import { SpreadsheetModule } from '../../generic/spreadsheet/spreadsheet.module';
import { CreateProductConsumer } from './consumer/create-product.consumer';
import { ProductVariant } from './model/product-variant.model';

export const productModuleEntities = [Product, ProductVariant];

@Module({
  imports: [
    MikroOrmModule.forFeature(productModuleEntities),
    BullModule.registerQueue({
      name: CREATE_PRODUCT_QUEUE_NAME,
      defaultJobOptions: {
        attempts: 10,
        backoff: 59000,
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
    SpreadsheetModule,
  ],
  providers: [FetchProductsScheduler, CreateProductConsumer],
})
export class ProductModule {}
