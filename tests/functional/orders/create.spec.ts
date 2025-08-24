import { Currency, OrderData } from '#types/order';
import { IToken } from '#types/token';
import { test } from '@japa/runner';

test.group('Orders create', () => {
  const availableStock = [
    {
      itemId: 'test-stock-item',
      itemName: 'blue t-shirt',
      itemPrice: 7.99,
      currency: Currency.EUR,
      qty: 1,
      vatAmount: 1.43,
      vatRate: 0.19,
    },
  ];
  const unavailableStock = [
    {
      itemId: 'test-stock-item',
      itemName: 'blue t-shirt',
      itemPrice: 7.99,
      currency: Currency.EUR,
      qty: 99,
      vatAmount: 1.43,
      vatRate: 0.19,
    },
  ];
  test('create order with available stock', async ({ client, assert }) => {
    const responseAuth = await client
      .post('/api/auth/token')
      .json({ email: 'test@example.com', password: 'Test123' });
    const authToken: IToken = responseAuth.body();

    const response = await client
      .post('/api/orders')
      .bearerToken(authToken.token)
      .header('content-type', 'application/json')
      .json({
        items: availableStock,
      });
    const orderData: OrderData = response.body();

    response.assertStatus(200);
    assert.onlyProperties(orderData, ['orderId', 'details']);
  });

  test('create order without available stock', async ({ client }) => {
    const responseAuth = await client
      .post('/api/auth/token')
      .json({ email: 'test@example.com', password: 'Test123' });
    const authToken: IToken = responseAuth.body();

    const response = await client
      .post('/api/orders')
      .bearerToken(authToken.token)
      .header('content-type', 'application/json')
      .json({
        items: unavailableStock,
      });

    response.assertStatus(400);
  });

  test('create order without auth token', async ({ client }) => {
    const response = await client
      .post('/api/orders')
      .header('content-type', 'application/json')
      .json({
        items: [{ itemId: 'test-stock-item', qty: 1, itemPrice: 9.99, currency: Currency.EUR }],
      });

    response.assertStatus(401);
  });
});
