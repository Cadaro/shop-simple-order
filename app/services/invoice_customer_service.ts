import InvoiceCustomerMapper from '#mappers/invoice/InvoiceCustomerMapper';
import InvoiceCustomers from '#models/invoice_customer';
import { BaseInvoiceCustomer, InvoiceCustomerData } from '#types/invoice';
import db from '@adonisjs/lucid/services/db';

/**
 * Service class for managing invoice customer data.
 * Provides methods to fetch, save, and update customer invoice information in the database.
 */
export default class InvoiceCustomer implements BaseInvoiceCustomer {
  private invoiceCustomerMapper = new InvoiceCustomerMapper();
  async fetchCustomerData(userId: string): Promise<InvoiceCustomerData> {
    const invoiceCustomerData = await InvoiceCustomers.findBy({ userId });

    if (!invoiceCustomerData) {
      throw new Error(`Invoice data for user ${userId} not found`);
    }
    return this.invoiceCustomerMapper.mapInvoiceCustomerModelToInvoiceCustomerType(
      invoiceCustomerData
    );
  }
  /**
   * Saves invoice customer data for the given user.
   * Throws an error if customer data already exists for the user.
   *
   * @param userId - The ID of the user.
   * @param data - The invoice customer data to save.
   * @throws Error if customer data already exists for the user.
   */
  async saveCustomerData(userId: string, data: Required<InvoiceCustomerData>): Promise<void> {
    await db.transaction(async (trx) => {
      const invoiceCustomer = await InvoiceCustomers.findBy({ userId }, { client: trx });
      if (invoiceCustomer) {
        throw new Error(`Invoice customer data already exists for user ${userId}`);
      }

      await InvoiceCustomers.create(
        this.invoiceCustomerMapper.mapInvoiceCustomerTypeToInvoiceCustomerModel(data)
      );
    });
  }

  /**
   * Updates the invoice customer data for the given user.
   * Throws an error if the user does not exist in the database.
   * @param userId - The ID of the user whose invoice data is to be updated.
   * @param data - The new invoice customer data.
   * @throws Error if invoice data for the user is not found.
   */
  async updateCustomerData(userId: string, data: Partial<InvoiceCustomerData>): Promise<void> {
    await db.transaction(async (trx) => {
      const invoiceCustomer = await InvoiceCustomers.findBy({ userId }, { client: trx });
      if (!invoiceCustomer) {
        throw new Error(`Invoice data for user ${userId} not found`);
      }

      await invoiceCustomer
        .merge(this.invoiceCustomerMapper.mapInvoiceCustomerTypeToInvoiceCustomerModel(data))
        .save();
    });
  }
}
