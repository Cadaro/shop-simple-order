import { OrderInvoiceData, InvoiceNumberOptions, PreparedInvoiceNumber } from '#types/invoice';
import db from '@adonisjs/lucid/services/db';
import PrepareInvoice from '#services/prepare_invoice_service';
import OrderInvoice from '#models/order_invoice';
import InvoiceNumber from '#models/invoice_number';
import InvoiceDataMapper from '#mappers/invoice/InvoiceDataToInvoiceDb';
import OrderService from './order_service.js';

export default class SaveInvoice {
  async save(invoiceData: OrderInvoiceData, options?: InvoiceNumberOptions) {
    const invoiceNumberOptions: InvoiceNumberOptions = options ?? {
      prefix: 'INV',
      separator: '/',
      useCurrentMonth: true,
    };
    const invoiceNumber = await db.transaction(async (trx) => {
      const prepareInvoice = new PrepareInvoice(invoiceNumberOptions);
      const { currentInvoiceNumberSequence, newInvoiceNumber }: PreparedInvoiceNumber =
        await prepareInvoice.prepareNumber();
      const invoiceMapper = new InvoiceDataMapper();
      const savedInvoiceHead = await OrderInvoice.create(
        invoiceMapper.mapInvoiceHead(invoiceData, newInvoiceNumber),
        { client: trx }
      );

      const orderService = new OrderService();
      const orderData = await orderService.fetchUserSingleOrder(invoiceData.orderId);
      if (!orderData) {
        throw Error(`Order ${invoiceData.orderId} is not found`);
      }

      const savedInvoiceDetails = await savedInvoiceHead
        .related('invoiceDetails')
        .createMany(invoiceMapper.mapInvoiceDetails(orderData.details));

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
