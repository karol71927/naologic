import { Embeddable, Property } from '@mikro-orm/mongodb';

@Embeddable()
export class ProductVariant {
  @Property()
  itemId: number;

  @Property()
  available: boolean;

  @Property()
  attributes: any;

  @Property()
  cost: number;

  @Property()
  currency: 'USD' | 'EUR';

  @Property({ nullable: true })
  depth: number | null;

  @Property({ nullable: true })
  dimensionUom: number | null;

  @Property({ nullable: true })
  height: number | null;

  @Property({ nullable: true })
  width: number | null;

  @Property()
  manufacturerItemId: string;

  @Property()
  packaging: string;

  @Property()
  price: number;

  @Property({ nullable: true })
  volume: number;

  @Property({ nullable: true })
  volumeUom: number;

  @Property({ nullable: true })
  weight: number;

  @Property({ nullable: true })
  weightUom: number;

  @Property()
  optionName: string;

  @Property()
  optionsPath: string;

  @Property()
  optionItemsPath: string;

  @Property()
  sku: string;

  @Property()
  active: boolean;

  @Property()
  images: {
    fileName: string;
    cdnLink: string;
    i: number;
    alt: string | null;
  }[];

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

  constructor(
    itemId: number,
    name: string,
    description: string,
    unitPrice: number,
    manufacturerItemCode: number,
    quantity: number,
    availability: string,
    available: boolean,
    attributes: any,
    cost: number,
    currency: 'USD' | 'EUR',
    depth: number | null,
    dimensionUom: number | null,
    height: number | null,
    width: number | null,
    manufacturerItemId: string,
    packaging: string,
    price: number,
    volume: number,
    volumeUom: number,
    weight: number,
    weightUom: number,
    optionName: string,
    optionsPath: string,
    optionItemsPath: string,
    sku: string,
    active: boolean,
    images?: {
      name: string;
      url: string;
    }[],
  ) {
    this.itemId = itemId;
    this.name = name;
    this.description = description;
    this.unitPrice = unitPrice;
    this.manufacturerItemCode = manufacturerItemCode;
    this.quantity = quantity;
    this.availability = availability;
    this.available = available;
    this.attributes = attributes;
    this.cost = cost;
    this.currency = currency;
    this.depth = depth;
    this.dimensionUom = dimensionUom;
    this.height = height;
    this.width = width;
    this.manufacturerItemId = manufacturerItemId;
    this.packaging = packaging;
    this.price = price;
    this.volume = volume;
    this.volumeUom = volumeUom;
    this.weight = weight;
    this.weightUom = weightUom;
    this.optionName = optionName;
    this.optionsPath = optionsPath;
    this.optionItemsPath = optionItemsPath;
    this.sku = sku;
    this.active = active;
    this.images = images.map((image, index) => {
      return {
        alt: null,
        cdnLink: image.url,
        fileName: image.name,
        i: index,
      };
    });
  }
}
