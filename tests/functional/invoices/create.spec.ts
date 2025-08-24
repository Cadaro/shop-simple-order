import SaveInvoice from '#services/save_invoice_service';
import { CountryCode } from '#types/countryCode';
import { InvoiceNumberOptions, OrderInvoiceData } from '#types/invoice';
import { Currency } from '#types/order';
import { test } from '@japa/runner';

test.group('Invoices create', () => {
  const invoiceData: OrderInvoiceData = {
    orderId: '12345AB',
    items: [
      {
        priceCurrency: Currency.PLN,
        itemId: '1234abc',
        itemName: 'test item name',
        priceGross: 23.99,
        qty: 1,
        vatAmount: 4.99,
        vatRate: 0.23,
      },
    ],
    customer: {
      firstName: 'Test Name',
      lastName: 'Test last Name',
      address: {
        city: 'Test city',
        countryCode: CountryCode.PL,
        postalCode: '01-234',
        streetName: 'Test street',
        streetNumber: '4A',
      },
    },
  };
  test('create invoice order with invoice number options, with month', async ({ assert }) => {
    const invoiceNumberOptions: InvoiceNumberOptions = {
      prefix: 'FV',
      separator: '/',
      useCurrentMonth: true,
    };

    const saveInvoiceService = new SaveInvoice();
    const result = await saveInvoiceService.save(invoiceData, invoiceNumberOptions);
    assert.match(result, /^(FV) (0*[1-9]\d{0,3})\/(0?[1-9]|1[0-2])\/\d{4}$/);
  }).skip(true, 'Invoice feature not ready');
  test('create invoice order with invoice number options, without month', async ({ assert }) => {
    const invoiceNumberOptions: InvoiceNumberOptions = {
      prefix: 'FV',
      separator: '/',
      useCurrentMonth: false,
    };

    const saveInvoiceService = new SaveInvoice();
    const result = await saveInvoiceService.save(invoiceData, invoiceNumberOptions);
    assert.match(result, /^(FV) (0*[1-9]\d{0,3})\/\d{4}$/);
  }).skip(true, 'Invoice feature not ready');
  test('create invoice order without invoice number options', async ({ assert }) => {
    const saveInvoiceService = new SaveInvoice();
    const result = await saveInvoiceService.save(invoiceData);
    assert.match(result, /^(INV) (0*[1-9]\d{0,3})\/(0?[1-9]|1[0-2])\/\d{4}$/);
  }).skip(true, 'Invoice feature not ready');
});
