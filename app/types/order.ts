import { DateTime } from 'luxon';

export enum Currency {
  PLN = 'PLN',
  EUR = 'EUR',
}

export type OrderSku = {
  itemId: string;
  itemName: string;
  qty: number;
  itemPrice: number;
  currency: Currency;
  vatAmount: number;
  vatRate: number;
};

export type OrderData = {
  orderId: string;
  createdAt?: DateTime;
  details: Array<OrderSku>;
};
