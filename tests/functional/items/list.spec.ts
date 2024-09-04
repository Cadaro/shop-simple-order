import { test } from '@japa/runner';
import { IItem } from '#types/item';

test.group('Items list', () => {
  test('get a list of items in the shop', async ({ assert, client }) => {
    const response = await client.get('/api/items');

    response.assertStatus(200);
    assert.isArray(response.body());
    assert.includeDeepMembers(response.body(), Array<IItem>());
  });
});

test.group('Typeof item list', () => {
  test('item list has typeof array of IItem', async ({ client, expectTypeOf }) => {
    const response = await client.get('/api/items');

    response.assertStatus(200);

    const res: Array<IItem> = response.body();
    expectTypeOf(res).toEqualTypeOf<Array<IItem>>();
  });
});
