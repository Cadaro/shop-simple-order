import { Currency } from '#types/order';
import { IAddress } from '#types/user';

type InvoiceCustomer = {
  firstName: string;
  lastName: string;
  address: IAddress;
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
  customer: InvoiceCustomer;
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

export interface Invoice {
  prepareNumber(): Promise<PreparedInvoiceNumber>;
}
