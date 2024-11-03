import Order from '#models/order';
import { IOrderData, IOrderSku } from '#types/order';
import { randomUUID } from 'crypto';
import StockService from './stock_service.js';
import db from '@adonisjs/lucid/services/db';

export default class OrderService {
  async fetchUserOrderList(userId: number) {
    const userOrderList: Array<IOrderData> = await Order.findManyBy({ userId });
    return userOrderList;
  }

  async createOrder(orderedItems: Array<IOrderSku>, userId: number) {
    const stockService = new StockService();
    const availableStock = await stockService.isStockAvailable(orderedItems);

    if (!availableStock) {
      throw new Error('Stock is not available');
    }

    const orderId = randomUUID();
    await db.transaction(async (trx) => {
      const savedOrderHead = await Order.create({ orderId, userId }, { client: trx });

      const savedOrderSku = await savedOrderHead
        .related('details')
        .createMany(orderedItems, { client: trx });
      if (!savedOrderHead || !savedOrderSku) {
        throw new Error('Unable to create order');
      }
    });

    return { orderId, userId, details: orderedItems } as IOrderData;
  }

  async fetchUserOrderDetails(orderId: string, userId: number) {
    const orderData = await Order.findBy({ orderId, userId });
    if (!orderData) {
      return null;
    }
    await orderData.load('details');
    return orderData.serialize() as IOrderData;
  }
}
