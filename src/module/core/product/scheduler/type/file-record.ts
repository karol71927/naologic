export interface FileRecord {
  SiteSource: string;
  ItemID: number;
  ManufacturerID: number;
  ManufacturerCode: number;
  ManufacturerName: string;
  ProductID: number;
  ProductName: string;
  ProductDescription: string;
  ManufacturerItemCode: number;
  ItemDescription: string;
  ImageFileName: string;
  ItemImageURL: string;
  NDCItemCode: string;
  PKG: string;
  UnitPrice: number;
  QuantityOnHand: number;
  PriceDescription: string;
  Availability: string;
  PrimaryCategoryID: number;
  PrimaryCategoryName: string;
  SecondaryCategoryID: number;
  SecondaryCategoryName: string;
  CategoryID: number;
  CategoryName: string;
  IsRX: 'N' | 'Y';
  IsTBD: 'N' | 'Y';
}
