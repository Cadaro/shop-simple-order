import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'invoice_customers';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').unsigned().notNullable().primary();
      table.string('user_id').notNullable().comment('user uuid');
      table.string('first_name').notNullable().comment("customer's first name");
      table.string('last_name').notNullable().comment("customer's last name");
      table.string('street_name').notNullable().comment('street name');
      table.string('street_number').notNullable().comment('street number');
      table.string('apartment_number').nullable().comment('apartment number');
      table.string('city').notNullable().comment('city');
      table.string('postal_code').notNullable().comment('postal code');
      table.string('region').nullable().comment('country region');
      table.string('country_code').notNullable().comment('country code');
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
