import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'stock_photos';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table
        .string('item_id')
        .notNullable()
        .references('item_id')
        .inTable('stocks')
        .onDelete('CASCADE');
      table.string('url').notNullable();
      table.string('name').nullable();
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
