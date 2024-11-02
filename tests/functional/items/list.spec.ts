import { test } from '@japa/runner';
import { IItem } from '#types/item';

test.group('Items list', () => {
  test('get a list of items in the shop', async ({ assert, client }) => {
    const response = await client.get('/api/items');

    response.assertStatus(200);
    assert.isArray(response.body());
    assert.onlyProperties(
      (response.body() as Array<IItem>)[0],
      Object.keys({
        itemId: 'affcd999-ca5b-4ca6-812e-9650408ed8a1',
        itemDescription: 'It is a nice test item, very soft. Pls buy me.',
        name: 'Test item',
        price: 9.99,
        priceCurrency: 'EUR',
        size: 'M',
        availableQty: 10,
      })
    );
  });
});

test.group('Typeof item list', () => {
  test('item list has typeof array of IItem', async ({ client, expectTypeOf }) => {
    const response = await client.get('/api/items');

    response.assertStatus(200);

    const res: Array<IItem> = response.body();
    expectTypeOf(res).toEqualTypeOf<Array<IItem>>();
  });
});
