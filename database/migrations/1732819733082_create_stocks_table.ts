import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'stocks';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').unsigned().notNullable().primary();
      table.string('item_id').notNullable().unique().index();
      table.string('item_description').notNullable();
      table.float('price').notNullable();
      table.string('price_currency').notNullable();
      table.string('name').notNullable();
      table.string('size').nullable();
      table.integer('available_qty').nullable();
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
