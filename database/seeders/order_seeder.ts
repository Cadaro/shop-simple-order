import Order from '#models/order';
import { Currency } from '#types/order';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class extends BaseSeeder {
  static environment: string[] = ['development'];
  async run() {
    await new Order()
      .fill({
        orderId: '123ABC',
        userId: 1,
      })
      .related('details')
      .createMany([
        {
          itemId: 'test-stock-item',
          itemName: 'blue t-shirt',
          itemPrice: 7.99,
          currency: Currency.EUR,
          qty: 1,
          vatAmount: 1.43,
          vatRate: 0.19,
        },
      ]);
  }
}
