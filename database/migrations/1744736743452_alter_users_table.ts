import { BaseSchema } from '@adonisjs/lucid/schema';
import { randomUUID } from 'crypto';

export default class extends BaseSchema {
  protected tableName = 'users';

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('uuid').unique();
    });
    this.defer(async (db) => {
      const users = await db.from(this.tableName).select('id').whereNull('uuid');
      const promises = users.map((user) =>
        db.from(this.tableName).where('id', user.id).update({ uuid: randomUUID() })
      );

      await Promise.all(promises);

      await db.schema.alterTable(this.tableName, (table) => {
        table.string('uuid').notNullable().alter();
      });
    });
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('uuid');
    });
  }
}
