import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'order_details';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').unsigned().notNullable().primary();
      table
        .string('order_id')
        .notNullable()
        .references('order_id')
        .inTable('orders')
        .onDelete('CASCADE');
      table.string('item_id').notNullable();
      table.integer('qty').notNullable();
      table.float('item_price').notNullable();
      table.string('currency').notNullable();
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
