import { EntityRepository } from '@mikro-orm/mongodb';
import { Product } from '../model/product.model';

export class ProductRepository extends EntityRepository<Product> {
  async findOneByProductIdWithVariants(productId: number): Promise<Product> {
    return this.findOne(
      {
        productId,
      },
      {
        populate: ['variants'],
      },
    );
  }

  async findOneById(id: string) {
    return this.findOne({ id });
  }
}
