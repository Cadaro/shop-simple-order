import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'order_invoice_details';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.unique(['invoice_id', 'item_id']);
      table.bigIncrements('id').unsigned().notNullable().primary();
      table
        .string('invoice_id')
        .notNullable()
        .index()
        .references('invoice_id')
        .inTable('order_invoices')
        .onDelete('CASCADE');
      table.string('item_id').notNullable().index().comment('item id');
      table.string('item_name').notNullable().comment('name of ordered item');
      table.integer('qty').notNullable().comment('ordered qty');
      table.float('price_gross').notNullable().comment('gross price');
      table.string('price_currency').notNullable().comment('price currency');
      table.float('vat_amount').notNullable().comment('total price with vat');
      table.float('vat_rate').notNullable().comment('vat rate');
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
