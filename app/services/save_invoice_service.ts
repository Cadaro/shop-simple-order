import { OrderInvoiceData, InvoiceNumberOptions, PreparedInvoiceNumber } from '#types/invoice';
import db from '@adonisjs/lucid/services/db';
import PrepareInvoice from '#services/prepare_invoice_service';
import OrderInvoice from '#models/order_invoice';
import InvoiceNumber from '#models/invoice_number';

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
      // const savedInvoiceHead = await OrderInvoice.create(
      //   { ...invoiceData.order, invoiceId: invoiceNumber },
      //   { client: trx }
      // );

      const savedInvoiceHead = await OrderInvoice.create({
        invoiceId: newInvoiceNumber,
        orderId: invoiceData.order.orderId,
        userId: '',
        firstName: '',
        lastName: '',
        countryCode: invoiceData.address.countryCode,
        streetName: invoiceData.address.streetName,
        streetNumber: invoiceData.address.streetNumber,
        apartmentNumber: invoiceData.address.apartmentNumber,
        city: invoiceData.address.city,
        postalCode: invoiceData.address.postalCode,
        region: invoiceData.address.region,
      });
      // const savedInvoiceDetails = await savedInvoiceHead
      //   .related('invoiceDetails')
      //   .createMany(invoiceData.order.details);

      const savedInvoiceDetails = await savedInvoiceHead.related('invoiceDetails').create({
        invoiceId: newInvoiceNumber,
        itemId: invoiceData.order.details[0].itemId,
        itemName: '',
        priceCurrency: invoiceData.order.details[0].currency,
        qty: invoiceData.order.details[0].qty,
        priceGross: invoiceData.order.details[0].itemPrice,
        vatAmout: 0.0,
        vatRate: 0.23,
      });

      if (!savedInvoiceHead || !savedInvoiceDetails) {
        throw new Error(`Could not create invoice for orderId = ${invoiceData.order.orderId}`);
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
