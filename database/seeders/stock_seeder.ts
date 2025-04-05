import Stock from '#models/stock';
import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { randomUUID } from 'crypto';

export default class extends BaseSeeder {
  static environment: string[] = ['test', 'development'];
  async run() {
    await new Stock()
      .fill({
        itemId: randomUUID(),
        itemDescription: 'It is a nice test item, very soft. Pls buy me.',
        name: 'Test item',
        price: 9.99,
        priceCurrency: 'EUR',
        availableQty: 99,
      })
      .related('photos')
      .createMany([{ url: '/path/to/photo.jpg', name: 'photo' }]);
    await new Stock()
      .fill({
        itemId: 'test-stock-item',
        itemDescription: 'Blue t-shirt in M size. Unisex.',
        name: 'blue t-shirt',
        price: 7.99,
        priceCurrency: 'EUR',
        size: 'M',
        availableQty: 72,
      })
      .related('photos')
      .createMany([{ url: '/path/to/photo1.jpg', name: 'photo1' }, { url: '/path/to/photo2.jpg' }]);
  }
}
