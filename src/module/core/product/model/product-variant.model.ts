import { Entity, ManyToOne, Property } from '@mikro-orm/mongodb';
import { Product } from './product.model';
import { BaseEntity } from '../../../../shared/mikro-orm/base-entity';

@Entity()
export class ProductVariant extends BaseEntity {
  @Property()
  itemId: number;

  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  unitPrice: number;

  @Property()
  manufacturerItemCode: number;

  @Property()
  quantity: number;

  @Property()
  availability: string;

  @Property({
    nullable: true,
  })
  imageFileName: string;

  @Property({
    nullable: true,
  })
  imageURL: string;

  @Property()
  NDCItemCode: string;

  @ManyToOne(() => Product)
  product: Product;

  constructor(
    itemId: number,
    name: string,
    description: string,
    unitPrice: number,
    manufacturerItemCode: number,
    quantity: number,
    availability: string,
    NDCItemCode: string,
    image?: {
      name: string;
      url: string;
    },
  ) {
    super();
    this.itemId = itemId;
    this.name = name;
    this.description = description;
    this.unitPrice = unitPrice;
    this.manufacturerItemCode = manufacturerItemCode;
    this.quantity = quantity;
    this.availability = availability;
    this.NDCItemCode = NDCItemCode;
    this.imageURL = image?.url ?? null;
    this.imageFileName = image?.name ?? null;
  }
}
