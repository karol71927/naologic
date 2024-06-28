import {
  Collection,
  Embedded,
  Entity,
  OneToMany,
  Property,
} from '@mikro-orm/mongodb';
import { ProductRepository } from '../repository/product.repository';
import { ProductVariant } from './product-variant.model';
import { BaseEntity } from '../../../../shared/mikro-orm/base-entity';
import { nanoid } from 'nanoid';
import { ProductOption } from './product-option.model';

@Entity({
  repository: () => ProductRepository,
})
export class Product extends BaseEntity {
  @Property({
    unique: true,
  })
  docId: string;

  @Property()
  type: 'non-inventory' | 'inventory';

  @Property()
  vendorId: string;

  @Property()
  manufacturerId: string;

  @Property()
  storefrontPriceVisibility: 'members-only' | 'everyone';

  @Property({
    unique: true,
  })
  productId: number;

  @Property()
  name: string;

  @Property({
    nullable: true,
  })
  shortDescription: string;

  @Property()
  manufacturerName: string;

  @Property({
    nullable: true,
  })
  description: string;

  @Embedded(() => ProductVariant, { array: true, nullable: true })
  variants: ProductVariant[] = [];

  @Embedded(() => ProductOption, { array: true, nullable: true })
  options: ProductOption[] = [];

  @Property({
    nullable: true,
  })
  deletedAt: Date | null;

  constructor(
    productId: number,
    name: string,
    description: string,
    manufacturerName: string,
    type: 'non-inventory' | 'inventory',
    vendorId: string,
    manufacturerId: string,
    storefrontPriceVisibility: 'members-only' | 'everyone',
  ) {
    super();
    this.docId = nanoid();
    this.productId = productId;
    this.name = name;
    this.shortDescription = description;
    this.manufacturerName = manufacturerName;
    this.type = type;
    this.vendorId = vendorId;
    this.manufacturerId = manufacturerId;
    this.storefrontPriceVisibility = storefrontPriceVisibility;
  }

  setAsDeleted() {
    this.deletedAt = new Date();
  }
}
