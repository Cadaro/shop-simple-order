import Order from '#models/order';
import { OrderData, OrderSku } from '#types/order';
import { randomUUID } from 'crypto';
import db from '@adonisjs/lucid/services/db';

export default class OrderService {
  async fetchUserOrderList(userId: number) {
    const userOrderList = await Order.findManyBy({ userId });
    return userOrderList;
  }

  async createOrder(orderedItems: Array<OrderSku>, userId: number) {
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

    const order: OrderData = { orderId, details: orderedItems };
    return order;
  }

  async fetchUserSingleOrder(orderId: string) {
    const orderData = await Order.findBy({ orderId });
    if (!orderData) {
      throw new Error(`Order ${orderId} not found`);
    }
    await orderData.load('details');
    return orderData;
  }
}
