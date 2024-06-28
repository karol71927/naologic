import { Injectable } from '@nestjs/common';
import { OpenAiService } from '../../../generic/open-ai/service/open-ai.service';
import { ProductRepository } from '../repository/product.repository';

@Injectable()
export class ProductDescriptionGenerator {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly openAiService: OpenAiService,
  ) {}

  async generateForProductById(id: string) {
    const product = await this.productRepository.findOneById(id);

    const description = await this.openAiService.ask(
      `You are an expert in medical sales. Your specialty is medical consumables used by hospitals on a daily basis. Your task to enhance the description of a product based on the information provided.
Product name: ${product.name}
Product description: ${product.shortDescription}
New Description:`,
    );

    product.description = description;

    await this.productRepository.getEntityManager().persistAndFlush(product);
  }
}
