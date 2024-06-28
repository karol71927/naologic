import { Embeddable, Property, t } from '@mikro-orm/core';

@Embeddable()
export class ProductOption {
  @Property()
  name: 'packaging' | 'description';

  @Property()
  values: {
    id: string;
    name: string;
    value: string;
  }[];

  @Property()
  id: string;

  @Property({ nullable: true })
  dataField: string | null;

  constructor(
    name: 'packaging' | 'description',
    values: {
      id: string;
      name: string;
      value: string;
    }[],
    id: string,
    dataField: string | null,
  ) {
    this.name = name;
    this.values = values;
    this.id = id;
    this.dataField = dataField;
  }
}
