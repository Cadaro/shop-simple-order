import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'orders';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('order_id').unique().notNullable();
      table.bigint('user_id').notNullable().references('id').inTable('users');
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
