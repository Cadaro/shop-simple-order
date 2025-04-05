import { IToken } from '#types/token';
import { IUserData } from '#types/user';
import { test } from '@japa/runner';

test.group('Users create', () => {
  test('create new user', async ({ client, assert }) => {
    const response = await client
      .post('/api/auth/users')
      .json({ email: 'test@example.com', password: 'Test123' });
    response.assertStatus(200);
    const user: IUserData = response.body();
    assert.properties(user, ['userId']);
  });
  test('get user token', async ({ client, assert, expectTypeOf }) => {
    const response = await client
      .post('/api/auth/token')
      .json({ email: 'test@example.com', password: 'Test123' });

    response.assertStatus(200);
    const token: IToken = response.body();
    assert.onlyProperties(token, ['token', 'type', 'expiresAt']);
    expectTypeOf(token).toMatchTypeOf<{
      type: string;
      token: string;
      expiresAt: Date;
    }>();
  });
});
