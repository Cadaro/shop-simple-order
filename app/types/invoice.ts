import { IOrderData } from '#types/order';
import { IAddress } from '#types/user';

type InvoiceData = {
  order: IOrderData;
  address: IAddress;
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
