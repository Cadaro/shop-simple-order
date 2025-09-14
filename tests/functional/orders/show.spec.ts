import { OrderData } from '#types/order';
import { Token } from '#types/token';
import { test } from '@japa/runner';

test.group('Orders show', () => {
  test("get list of user's orders", async ({ client, assert }) => {
    const responseAuth = await client
      .post('/api/auth/token')
      .json({ email: 'test@example.com', password: 'Test123' });
    const authToken: Token = responseAuth.body();

    const response = await client
      .get('/api/orders')
      .bearerToken(authToken.token)
      .header('content-type', 'application/json');
    response.assertStatus(200);

    const orderData: Array<OrderData> = response.body();

    assert.isArray(orderData);
    assert.onlyProperties(orderData[0], ['orderId', 'createdAt']);
  });

  test("get order's details", async ({ client, assert }) => {
    const responseAuth = await client
      .post('/api/auth/token')
      .json({ email: 'test@example.com', password: 'Test123' });
    const authToken: Token = responseAuth.body();

    const responseOrderList = await client
      .get('/api/orders')
      .bearerToken(authToken.token)
      .header('content-type', 'application/json');
    const orderData: Array<OrderData> = responseOrderList.body();

    const responseOrderDetails = await client
      .get(`/api/orders/${orderData[0].orderId}`)
      .bearerToken(authToken.token)
      .header('content-type', 'application/json');

    responseOrderDetails.assertStatus(200);

    const orderDeails: OrderData = responseOrderDetails.body();

    assert.onlyProperties(orderDeails, ['orderId', 'createdAt', 'details']);
    assert.isArray(orderDeails.details);
    assert.onlyProperties(orderDeails.details[0], [
      'itemId',
      'qty',
      'itemPrice',
      'currency',
      'itemName',
      'vatAmount',
      'vatRate',
    ]);
  });
});
