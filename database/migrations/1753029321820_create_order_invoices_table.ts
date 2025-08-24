import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'order_invoices';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.index(['invoice_id', 'order_id'], 'invoice_order_idx');
      table.bigIncrements('id').unsigned().notNullable().primary();
      table
        .string('invoice_id')
        .notNullable()
        .unique()
        .comment('invoice unique number related to order');
      table.string('order_id').notNullable().comment('order number related to invoice');
      table.string('first_name').notNullable().comment("customer's first name");
      table.string('last_name').notNullable().comment("customer's last name");
      table.string('street_name').notNullable().comment("customer's street name");
      table.string('street_number').notNullable().comment("customer's street number");
      table.string('apartment_number').nullable().comment("customer's apartment number");
      table.string('postal_code').notNullable().comment("customer's address postal code");
      table.string('city').notNullable().comment("customer's city");
      table.string('region').nullable().comment("customer's region");
      table.string('country_code', 2).notNullable().comment("customer's country code");
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
