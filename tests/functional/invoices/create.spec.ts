import SaveInvoice from '#services/save_invoice_service';
import OrderService from '#services/order_service';
import { CountryCode } from '#types/countryCode';
import { InvoiceItem, InvoiceNumberOptions, OrderInvoiceData } from '#types/invoice';
import { Currency, OrderSku } from '#types/order';
import { test } from '@japa/runner';

test.group('Invoices create', (group) => {
  const orderService = new OrderService();
  let invoicePersonData: OrderInvoiceData;
  let invoiceCompanyData: OrderInvoiceData;

  group.setup(async () => {
    const invoiceItems: Array<InvoiceItem> = [
      {
        priceCurrency: Currency.PLN,
        itemId: '1234abc',
        itemName: 'test item name',
        priceGross: 23.99,
        qty: 1,
        vatAmount: 4.99,
        vatRate: 0.23,
      },
    ];
    const items: Array<OrderSku> = [];
    invoiceItems.forEach((item) => {
      items.push({
        itemId: item.itemId,
        itemName: item.itemName,
        currency: item.priceCurrency,
        itemPrice: item.priceGross,
        qty: item.qty,
        vatAmount: item.vatAmount,
        vatRate: item.vatRate,
      });
    });
    const firstOrder = await orderService.createOrder(items, 1);
    const secondOrder = await orderService.createOrder(items, 1);
    invoicePersonData = {
      orderId: firstOrder.orderId,
      items: invoiceItems,
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
    invoiceCompanyData = {
      orderId: secondOrder.orderId,
      items: invoiceItems,
      customer: {
        companyName: 'Test Company',
        taxId: '123-456-32-18',
        address: {
          city: 'Test city',
          countryCode: CountryCode.PL,
          postalCode: '01-234',
          streetName: 'Test street',
          streetNumber: '4A',
        },
      },
    };
  });

  group.each.setup(async () => {
    const orderService = new (await import('#services/order_service')).default();
    const items: Array<OrderSku> = [];
    invoicePersonData.items.forEach((item) => {
      items.push({
        itemId: item.itemId,
        itemName: item.itemName,
        currency: item.priceCurrency,
        itemPrice: item.priceGross,
        qty: item.qty,
        vatAmount: item.vatAmount,
        vatRate: item.vatRate,
      });
    });
    await orderService.createOrder(items, 1);
  });

  test('create invoice order for type person with invoice number options, with month', async ({
    assert,
  }) => {
    const invoiceNumberOptions: InvoiceNumberOptions = {
      prefix: 'FV',
      separator: '/',
      useCurrentMonth: true,
    };

    const saveInvoiceService = new SaveInvoice();
    const result = await saveInvoiceService.save(invoicePersonData, invoiceNumberOptions);
    assert.match(result, /^(FV) (0*[1-9]\d{0,3})\/(0?[1-9]|1[0-2])\/\d{4}$/);
  });

  test('create invoice order for type person with invoice number options, without month', async ({
    assert,
  }) => {
    const invoiceNumberOptions: InvoiceNumberOptions = {
      prefix: 'FV',
      separator: '/',
      useCurrentMonth: false,
    };

    const saveInvoiceService = new SaveInvoice();
    const result = await saveInvoiceService.save(invoicePersonData, invoiceNumberOptions);
    assert.match(result, /^(FV) (0*[1-9]\d{0,3})\/\d{4}$/);
  });

  test('create invoice order for type person without invoice number options', async ({
    assert,
  }) => {
    const saveInvoiceService = new SaveInvoice();
    const result = await saveInvoiceService.save(invoicePersonData);
    assert.match(result, /^(INV) (0*[1-9]\d{0,3})\/(0?[1-9]|1[0-2])\/\d{4}$/);
  });

  test('create invoice order for type company without invoice number options', async ({
    assert,
  }) => {
    const saveInvoiceService = new SaveInvoice();
    const result = await saveInvoiceService.save(invoiceCompanyData);
    assert.match(result, /^(INV) (0*[1-9]\d{0,3})\/(0?[1-9]|1[0-2])\/\d{4}$/);
  });
});
