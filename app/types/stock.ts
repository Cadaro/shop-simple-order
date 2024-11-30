export interface IStockPhoto {
  url: string;
  name?: string;
}
export interface IStock {
  itemId?: string;
  price: number;
  priceCurrency: string;
  name: string;
  itemDescription: string;
  size?: string;
  availableQty: number;
  photos: Array<IStockPhoto>;
}

export interface IItemWithQty {
  itemId: string;
  qty: number;
}
