import { IOrderData } from '#types/order';
import { IAddress } from '#types/user';

export default class CreateOrderInvoice {
  handle(invoiceData: { invoiceAddress: IAddress; order: IOrderData }) {}
}
