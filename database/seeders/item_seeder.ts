import Item from '#models/item';
import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { randomUUID } from 'crypto';

export default class extends BaseSeeder {
  async run() {
    await Item.createMany([
      {
        itemId: randomUUID(),
        itemDescription: 'It is a nice test item, very soft. Pls buy me.',
        name: 'Test item',
        price: 9.99,
        priceCurrency: 'EUR',
        size: 'M',
        availableQty: 99,
      },
      {
        itemId: randomUUID(),
        itemDescription: 'Blue t-shirt in M size. Unisex.',
        name: 'blue t-shirt',
        price: 7.99,
        priceCurrency: 'EUR',
        size: 'M',
        availableQty: 72,
      },
      {
        itemId: randomUUID(),
        itemDescription: 'Black t-shirt in L size. Unisex.',
        name: 'black t-shirt',
        price: 7.99,
        priceCurrency: 'EUR',
        size: 'L',
        availableQty: 81,
      },
    ]);
  }
}
