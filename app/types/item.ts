export interface IItem {
  itemId: string;
  price: number;
  priceCurrency: string;
  name: string;
  itemDescription: string;
  size: string;
  availableQty: number;
}

export interface IItemWithQty {
  itemId: string;
  qty: number;
}
