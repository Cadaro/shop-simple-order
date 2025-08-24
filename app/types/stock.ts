import { Currency } from './order.js';

type StockPhoto = {
  url: string;
  name?: string;
};
export type StockItem = {
  itemId?: string;
  price: number;
  priceCurrency: Currency;
  vatAmount: number;
  vatRate: number;
  name: string;
  itemDescription: string;
  size?: string;
  availableQty: number;
  photos: Array<StockPhoto>;
};

export type ItemWithQty = {
  itemId: string;
  qty: number;
};
