import { Currency } from '#types/order';
import { Address } from '#types/address';

export type InvoiceCustomerData = {
  firstName: string;
  lastName: string;
  address: Address;
};
export type InvoiceItem = {
  itemId: string;
  itemName: string;
  qty: number;
  priceGross: number;
  priceCurrency: Currency;
  vatAmount: number;
  vatRate: number;
};
type InvoiceData = {
  orderId: string;
  items: Array<InvoiceItem>;
  customer: InvoiceCustomerData;
};
export type OrderInvoiceData = Readonly<InvoiceData>;

type InvoicePrefix = 'INV' | 'INVOICE' | 'FV';

export type InvoiceNumberOptions = Readonly<{
  prefix: InvoicePrefix;
  useCurrentMonth: boolean;
  separator: string;
}>;
export type DateSuffix = { year: string; month: string };
export type PreparedInvoiceNumber = Readonly<{
  newInvoiceNumber: string;
  currentInvoiceNumberSequence: number;
}>;

export interface InvoiceUtil {
  prepareNumber(): Promise<PreparedInvoiceNumber>;
}

export interface BaseInvoice {
  save(invoiceData: OrderInvoiceData, options?: InvoiceNumberOptions): Promise<string>;
}

export interface BaseInvoiceCustomer {
  fetchCustomerData(userId: string): Promise<InvoiceCustomerData>;
  saveCustomerData(userId: string, data: InvoiceCustomerData): Promise<void>;
  updateCustomerData(userId: string, data: Partial<InvoiceCustomerData>): Promise<void>;
}
