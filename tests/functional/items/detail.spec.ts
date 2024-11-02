import { IItem } from '#types/item';
import { test } from '@japa/runner';

test.group('Items detail', () => {
  test('get details of item in the shop', async ({ assert, client }) => {
    const responseItemList = await client.get('/api/items');
    const item = (responseItemList.body() as Array<IItem>)[0];
    const responseItemDetail = await client.get(`/api/items/${item.itemId}`);
    responseItemDetail.assertStatus(200);
    assert.isObject(responseItemDetail.body());
    assert.onlyProperties(
      responseItemDetail.body(),
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
