import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import {
  ADD_DESCRIPTION_TO_PRODUCT_JOB_NAME,
  AddDescriptionToProductJob,
} from '../queue/add-description-to-product.job';
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CREATE_PRODUCT_QUEUE_NAME } from '../queue/create-product.queue-name';
import { ProductRepository } from '../repository/product.repository';
import { CreateProductConsumer } from './create-product.consumer';
import { ProductDescriptionGenerator } from '../generator/product-description.generator';

@Processor(CREATE_PRODUCT_QUEUE_NAME)
export class AddDescriptionToProductConsumer {
  private readonly logger = new Logger(CreateProductConsumer.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productDescriptionGenerator: ProductDescriptionGenerator,
    private readonly orm: MikroORM, //required by create request context decorator
  ) {}

  @Process(ADD_DESCRIPTION_TO_PRODUCT_JOB_NAME)
  @CreateRequestContext()
  async handle(job: Job<AddDescriptionToProductJob>) {
    this.logger.debug(`Handler invoked`, job.data);

    const product = await this.productRepository.findOneByProductIdWithVariants(
      job.data.productId,
    );

    if (!product) {
      this.logger.debug(`Product ${job.data.productId} does not exist`);
      return;
    }

    this.productDescriptionGenerator.generateForProductById(product.id);
  }
}
