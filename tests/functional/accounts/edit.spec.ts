import { CountryCode } from '#types/countryCode';
import { IToken } from '#types/token';
import { Address } from '#types/address';
import { test } from '@japa/runner';

test.group('Edit user', () => {
  test('edit user data with given firstName and lastName', async ({ client }) => {
    const responseAuth = await client
      .post('/api/auth/token')
      .json({ email: 'test@example.com', password: 'Test123' });
    const authToken: IToken = responseAuth.body();

    const userDataToEdit = { firstName: 'testName', lastName: 'testLastName' };

    const responseEdit = await client
      .patch(`/api/auth/users/`)
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

    const responseEdit = await client
      .patch(`/api/auth/users/`)
      .bearerToken(authToken.token)
      .header('content-type', 'application/json');
    responseEdit.assertStatus(400);
  });

  test('edit user data with invoice address', async ({ client }) => {
    const responseAuth = await client
      .post('/api/auth/token')
      .json({ email: 'test@example.com', password: 'Test123' });
    const authToken: IToken = responseAuth.body();

    const invoiceAddress: Address = {
      city: 'Test city',
      countryCode: CountryCode.PL,
      postalCode: '32-080',
      streetName: 'Akacjowa',
      streetNumber: '43A',
    };

    const userDataToEdit = { firstName: 'testName', lastName: 'testLastName', invoiceAddress };

    const responseEdit = await client
      .patch(`/api/auth/users/`)
      .bearerToken(authToken.token)
      .header('content-type', 'application/json')
      .json(userDataToEdit);
    responseEdit.assertStatus(204);
  });
});
