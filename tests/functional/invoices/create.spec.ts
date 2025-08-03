import SaveInvoice from '#services/save_invoice_service';
import { CountryCode } from '#types/countryCode';
import { InvoiceNumberOptions, OrderInvoiceData } from '#types/invoice';
import { Currency } from '#types/order';
import { test } from '@japa/runner';

test.group('Invoices create', () => {
  test('create invoice order with invoice number options, with month', async ({ assert }) => {
    const invoiceNumberOptions: InvoiceNumberOptions = {
      prefix: 'FV',
      separator: '/',
      useCurrentMonth: true,
    };
    const invoiceData: OrderInvoiceData = {
      order: {
        orderId: '12345AB',
        details: [
          {
            currency: Currency.PLN,
            itemId: '1234abc',
            itemPrice: 23.99,
            qty: 1,
          },
        ],
      },
      address: {
        city: 'Test city',
        countryCode: CountryCode.PL,
        postalCode: '01-234',
        streetName: 'Test street',
        streetNumber: '4A',
      },
    };
    const saveInvoiceService = new SaveInvoice();
    const result = await saveInvoiceService.save(invoiceData, invoiceNumberOptions);
    assert.match(result, /^(FV) (0*[1-9]\d{0,3})\/(0?[1-9]|1[0-2])\/\d{4}$/);
  });
  test('create invoice order with invoice number options, without month', async ({ assert }) => {
    const invoiceNumberOptions: InvoiceNumberOptions = {
      prefix: 'FV',
      separator: '/',
      useCurrentMonth: false,
    };
    const invoiceData: OrderInvoiceData = {
      order: {
        orderId: '12345AB',
        details: [
          {
            currency: Currency.PLN,
            itemId: '1234abc',
            itemPrice: 23.99,
            qty: 1,
          },
        ],
      },
      address: {
        city: 'Test city',
        countryCode: CountryCode.PL,
        postalCode: '01-234',
        streetName: 'Test street',
        streetNumber: '4A',
      },
    };
    const saveInvoiceService = new SaveInvoice();
    const result = await saveInvoiceService.save(invoiceData, invoiceNumberOptions);
    assert.match(result, /^(FV) (0*[1-9]\d{0,3})\/\d{4}$/);
  });
  test('create invoice order without invoice number options', async ({ assert }) => {
    const invoiceData: OrderInvoiceData = {
      order: {
        orderId: '12345AB',
        details: [
          {
            currency: Currency.PLN,
            itemId: '1234abc',
            itemPrice: 23.99,
            qty: 1,
          },
        ],
      },
      address: {
        city: 'Test city',
        countryCode: CountryCode.PL,
        postalCode: '01-234',
        streetName: 'Test street',
        streetNumber: '4A',
      },
    };
    const saveInvoiceService = new SaveInvoice();
    const result = await saveInvoiceService.save(invoiceData);
    assert.match(result, /^(INV) (0*[1-9]\d{0,3})\/(0?[1-9]|1[0-2])\/\d{4}$/);
  });
});
