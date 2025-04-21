import { DateTime } from 'luxon';

export enum Currency {
  PLN = 'PLN',
  EUR = 'EUR',
}

export interface IOrderSku {
  itemId: string;
  qty: number;
  itemPrice: number;
  currency: Currency;
}

export interface IOrderData {
  orderId: string;
  createdAt?: DateTime;
  details: Array<IOrderSku>;
}
