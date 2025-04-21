import { Currency, IOrderData } from '#types/order';
import { IToken } from '#types/token';
import { test } from '@japa/runner';

test.group('Orders create', () => {
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
        items: [{ itemId: 'test-stock-item', qty: 1, itemPrice: 9.99, currency: Currency.EUR }],
      });
    const orderData: IOrderData = response.body();

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
        items: [{ itemId: 'test-stock-item', qty: 999, itemPrice: 9.99, currency: Currency.EUR }],
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
