import { IOrderData } from '#types/order';
import { IToken } from '#types/token';
import { test } from '@japa/runner';

test.group('Orders show', () => {
  test("get list of user's orders", async ({ client, assert }) => {
    const responseAuth = await client
      .post('/api/auth/token')
      .json({ email: 'test@example.com', password: 'Test123' });
    const authToken: IToken = responseAuth.body();

    const response = await client
      .get('/api/orders')
      .bearerToken(authToken.token)
      .header('content-type', 'application/json');
    response.assertStatus(200);

    const orderData: Array<IOrderData> = response.body();

    assert.isArray(orderData);
    assert.onlyProperties(orderData[0], ['orderId', 'createdAt']);
  });

  test("get order's details", async ({ client, assert }) => {
    const responseAuth = await client
      .post('/api/auth/token')
      .json({ email: 'test@example.com', password: 'Test123' });
    const authToken: IToken = responseAuth.body();

    const responseOrderList = await client
      .get('/api/orders')
      .bearerToken(authToken.token)
      .header('content-type', 'application/json');
    const orderData: Array<IOrderData> = responseOrderList.body();

    const responseOrderDetails = await client
      .get(`/api/orders/${orderData[0].orderId}`)
      .bearerToken(authToken.token)
      .header('content-type', 'application/json');

    responseOrderDetails.assertStatus(200);

    const orderDeails: IOrderData = responseOrderDetails.body();

    assert.onlyProperties(orderDeails, ['orderId', 'createdAt', 'details']);
    assert.isArray(orderDeails.details);
    assert.onlyProperties(orderDeails.details[0], ['itemId', 'qty', 'itemPrice', 'currency']);
  });
});
