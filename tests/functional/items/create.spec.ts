import User from '#models/user';
import TokenService from '#services/token_service';
import { Currency } from '#types/order';
import { StockItem } from '#types/stock';
import { UserRolesEnum } from '#types/user';
import { test } from '@japa/runner';
import { randomUUID } from 'crypto';

const item: StockItem = {
  itemDescription: 'It is a nice test item, very soft. Pls buy me.',
  name: 'Test item',
  price: 9.99,
  vatAmount: 2.09,
  vatRate: 21,
  priceCurrency: Currency.EUR,
  size: 'M',
  availableQty: 10,
  photos: [{ url: '../some/path/to/photo', name: 'photo of nice t-shirt' }],
};
test.group('Items create', () => {
  async function createTokenForUser(user: InstanceType<typeof User>) {
    const tokenService = new TokenService();
    return await tokenService.createToken(user);
  }

  test('Create a new item by unauthenticated user', async ({ client }) => {
    const response = await client.post('/api/stocks').json(item);
    response.assertStatus(401);
  });

  test('Create a new item by role user', async ({ client }) => {
    const user = await User.create({
      email: 'user@example.com',
      password: 'user123',
      role: UserRolesEnum.USER,
      uuid: randomUUID(),
    });

    const token = await createTokenForUser(user);

    const response = await client.post('/api/stocks').json(item).bearerToken(token.token);
    response.assertStatus(403);
  });

  test('Create a new item by role admin', async ({ assert, client }) => {
    const admin = await User.create({
      email: 'admin@example.com',
      password: 'admin123',
      role: UserRolesEnum.ADMIN,
      uuid: randomUUID(),
    });

    const token = await createTokenForUser(admin);

    const response = await client.post('/api/stocks').json(item).bearerToken(token.token);
    response.assertStatus(201);
    const body = response.body();
    assert.onlyProperties(body, ['itemId']);
  });
});
