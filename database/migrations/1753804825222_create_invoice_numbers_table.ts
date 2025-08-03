import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'invoice_numbers';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary().notNullable();
      table
        .bigInteger('invoice_number_sequence')
        .notNullable()
        .defaultTo(0)
        .comment('sequence for invoice number');
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
