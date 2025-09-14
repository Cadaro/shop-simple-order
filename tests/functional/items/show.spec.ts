import { StockItem } from '#types/stock';
import { test } from '@japa/runner';

test.group('Items show', () => {
  test('get list of items (stocks)', async ({ assert, client }) => {
    const response = await client.get('/api/stocks');
    const stocks: Array<StockItem> = response.body();
    response.assertStatus(200);
    assert.isArray(stocks);
    assert.properties(
      stocks[0],
      Object.keys({
        itemId: '12345-tshirt-m',
        itemDescription: 'It is a nice test item, very soft. Pls buy me.',
        name: 'Test item',
        price: 9.99,
        priceCurrency: 'EUR',
        size: 'M',
        availableQty: 10,
        photos: { url: '../some/path/to/photo' },
      })
    );
  });
  test('get detail of stock item', async ({ assert, client }) => {
    const responseStocks = await client.get('/api/stocks');
    const stocks: Array<StockItem> = responseStocks.body();
    const responseSingleStockItem = await client.get(`/api/stocks/${stocks[0].itemId}`);
    const singleStockItem: StockItem = responseSingleStockItem.body();
    responseSingleStockItem.assertStatus(200);
    assert.isObject(singleStockItem);
    assert.properties(
      singleStockItem,
      Object.keys({
        itemId: '12345-tshirt-m',
        itemDescription: 'It is a nice test item, very soft. Pls buy me.',
        name: 'Test item',
        price: 9.99,
        priceCurrency: 'EUR',
        size: 'M',
        availableQty: 10,
        photos: { url: '../some/path/to/photo', name: 'photo of nice t-shirt' },
      })
    );
  });
});
