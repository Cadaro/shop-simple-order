import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'order_details';

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('item_name').notNullable().comment('item short name');
      table.float('vat_amount').notNullable().comment('item vat amount');
      table.float('vat_rate').notNullable().comment('item vat rate for example 0.23, 0.19');
    });
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('item_name', 'vat_amount', 'vat_rate');
    });
  }
}
