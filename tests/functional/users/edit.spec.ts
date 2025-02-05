import { IToken } from '#types/token';
import { test } from '@japa/runner';

test.group('Edit user', () => {
  test('edit user data with given firstName and lastName', async ({ client }) => {
    const responseAuth = await client
      .post('/api/auth/token')
      .json({ email: 'test@example.com', password: 'Test123' });
    const authToken: IToken = responseAuth.body();

    let responseUser = await client.get('/api/auth/users').bearerToken(authToken.token);

    let user = responseUser.body();

    const userDataToEdit = { firstName: 'testName', lastName: 'testLastName' };

    const responseEdit = await client
      .patch(`/api/auth/users/${user.userId}`)
      .bearerToken(authToken.token)
      .header('content-type', 'application/json')
      .json(userDataToEdit);
    responseEdit.assertStatus(204);
  });
  test('edit user data without given firstName and lastName', async ({ client }) => {
    const responseAuth = await client
      .post('/api/auth/token')
      .json({ email: 'test@example.com', password: 'Test123' });
    const authToken: IToken = responseAuth.body();

    let responseUser = await client.get('/api/auth/users').bearerToken(authToken.token);

    let user = responseUser.body();

    const responseEdit = await client
      .patch(`/api/auth/users/${user.userId}`)
      .bearerToken(authToken.token)
      .header('content-type', 'application/json');
    responseEdit.assertStatus(204);
  });
});
