import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'items';

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('available_qty').nullable();
    });
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('available_qty');
    });
  }
}
