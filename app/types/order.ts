export interface IOrderHead {
  orderId: string;
  userId: number;
}

export interface IOrderSku {
  itemId: string;
  qty: number;
  itemPrice: number;
  currency: string;
}

export interface IOrderData {
  orderId: string;
  items: Array<IOrderSku>;
}
