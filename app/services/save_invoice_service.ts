import {
  OrderInvoiceData,
  InvoiceNumberOptions,
  PreparedInvoiceNumber,
  BaseInvoice,
} from '#types/invoice';
import db from '@adonisjs/lucid/services/db';
import PrepareInvoice from '#services/prepare_invoice_service';
import OrderInvoice from '#models/order_invoice';
import InvoiceNumber from '#models/invoice_number';
import InvoiceDataMapper from '#mappers/invoice/InvoiceDataMapper';
import OrderService from '#services/order_service';

export default class SaveInvoice implements BaseInvoice {
  private orderService = new OrderService();
  private invoiceMapper = new InvoiceDataMapper();
  /**
   * Saves an invoice based on the provided order invoice data and optional invoice number options.
   * If no invoice number options are provided, default options are used.
   *
   * @param invoiceData - The data related to the order for which the invoice is to be created.
   * @param options - Optional settings for generating the invoice number, including prefix, separator, and whether to use the current month.
   * @returns The generated invoice number as a string.
   * @throws Error if the order is not found or if the invoice could not be created.
   */
  async save(invoiceData: OrderInvoiceData, options?: InvoiceNumberOptions) {
    const invoiceNumberOptions: InvoiceNumberOptions = options ?? {
      prefix: 'INV',
      separator: '/',
      useCurrentMonth: true,
    };
    const prepareInvoice = new PrepareInvoice(invoiceNumberOptions);
    const invoiceNumber = await db.transaction(async (trx) => {
      const { currentInvoiceNumberSequence, newInvoiceNumber }: PreparedInvoiceNumber =
        await prepareInvoice.prepareNumber();

      const orderData = await this.orderService.fetchUserSingleOrder(invoiceData.orderId);
      if (!orderData) {
        throw Error(`Order ${invoiceData.orderId} is not found`);
      }
      const savedInvoiceHead = await OrderInvoice.create(
        this.invoiceMapper.mapInvoiceHead(invoiceData, newInvoiceNumber),
        { client: trx }
      );

      const savedInvoiceDetails = await savedInvoiceHead
        .related('invoiceDetails')
        .createMany(this.invoiceMapper.mapInvoiceDetails(orderData.details));

      if (!savedInvoiceHead || !savedInvoiceDetails) {
        throw new Error(`Could not create invoice for orderId = ${invoiceData.orderId}`);
      }
      await InvoiceNumber.updateOrCreate(
        {
          id: 1,
        },
        { invoiceNumberSequence: currentInvoiceNumberSequence + 1 },
        { client: trx }
      );
      return newInvoiceNumber;
    });
    return invoiceNumber;
  }
}
