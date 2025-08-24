import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'stocks';

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.float('vat_amount').notNullable().defaultTo(0).comment('item vat amount');
      table
        .float('vat_rate')
        .notNullable()
        .defaultTo(0.0)
        .comment('item vat rate for example 0.23, 0.19');
    });
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('vat_amount', 'vat_rate');
    });
  }
}
