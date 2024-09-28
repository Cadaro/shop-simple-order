import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'carts';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('item_id').notNullable().unique().index('idx_item_id');
      table.string('item_name').notNullable();
      table.integer('qty').notNullable();
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
