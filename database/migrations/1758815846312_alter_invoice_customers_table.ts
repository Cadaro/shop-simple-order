import { InvoiceCustomerTypeEnum } from '#types/invoice';
import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'invoice_customers';

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.setNullable('first_name');
      table.setNullable('last_name');
      table.string('company_name').nullable().comment('Customer company name');
      table.string('tax_id').nullable().comment('Customer company tax ID');
      table
        .string('customer_type')
        .notNullable()
        .defaultTo(InvoiceCustomerTypeEnum.PERSON)
        .comment('Customer type - person or company');
    });
  }

  async down() {
    // Update null values before making columns notNullable
    await this.db.rawQuery(`UPDATE ${this.tableName} SET first_name = '' WHERE first_name IS NULL`);
    await this.db.rawQuery(`UPDATE ${this.tableName} SET last_name = '' WHERE last_name IS NULL`);

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('company_name', 'tax_id', 'customer_type');
      table.string('first_name').notNullable().comment("customer's first name").alter();
      table.string('last_name').notNullable().comment("customer's last name").alter();
    });
  }
}
