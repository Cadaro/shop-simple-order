import Order from '#models/order';
import { IOrderData, IOrderSku } from '#types/order';
import { randomUUID } from 'crypto';
import db from '@adonisjs/lucid/services/db';

export default class OrderService {
  async fetchUserOrderList(userId: number) {
    const userOrderList: Array<IOrderData> = await Order.findManyBy({ userId });
    return userOrderList;
  }

  async createOrder(orderedItems: Array<IOrderSku>, userId: number) {
    const orderId = randomUUID();
    await db.transaction(async (trx) => {
      const savedOrderHead = await Order.create({ orderId, userId }, { client: trx });

      const savedOrderSku = await savedOrderHead
        .related('details')
        .createMany(orderedItems, { client: trx });
      if (!savedOrderHead || !savedOrderSku) {
        throw new Error('Could not create new order');
      }
    });

    return { orderId, userId, details: orderedItems } as IOrderData;
  }

  async fetchUserOrderDetails(orderId: string) {
    const orderData = await Order.findBy({ orderId });
    if (!orderData) {
      return null;
    }
    await orderData.load('details');
    return orderData;
  }
}
