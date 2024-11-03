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
  userId?: number;
  details: Array<IOrderSku>;
}
