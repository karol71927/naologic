import { Collection, Entity, OneToMany, Property } from '@mikro-orm/mongodb';
import { ProductRepository } from '../repository/product.repository';
import { ProductVariant } from './product-variant.model';
import { BaseEntity } from '../../../../shared/mikro-orm/base-entity';
import { nanoid } from 'nanoid';

@Entity({
  repository: () => ProductRepository,
})
export class Product extends BaseEntity {
  @Property({
    unique: true,
  })
  docId: string;

  @Property({
    unique: true,
  })
  productId: number;

  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  manufacturerName: string;

  @Property()
  enhancedDescription: string;

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.product)
  variants = new Collection<ProductVariant>(this);

  @Property({
    nullable: true,
  })
  deletedAt: Date | null;

  constructor(
    productId: number,
    name: string,
    description: string,
    manufacturerName: string,
  ) {
    super();
    this.docId = nanoid();
    this.productId = productId;
    this.name = name;
    this.description = description;
    this.manufacturerName = manufacturerName;
  }

  setAsDeleted() {
    this.deletedAt = new Date();
  }
}
