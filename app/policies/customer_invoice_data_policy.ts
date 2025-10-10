import User from '#models/user';
import InvoiceCustomer from '#models/invoice_customer';
import { BasePolicy } from '@adonisjs/bouncer';
import type { AuthorizerResponse } from '@adonisjs/bouncer/types';

export default class CustomerInvoiceDataPolicy extends BasePolicy {
  view(user: User, customerInvoiceData: InvoiceCustomer): AuthorizerResponse {
    // User middleware ensures authentication and abilities
    // Only check ownership
    return user.uuid === customerInvoiceData.userId;
  }

  create(_user: User): AuthorizerResponse {
    // User middleware ensures authentication and abilities
    // Any authenticated user can create invoice data
    return true;
  }

  edit(user: User, customerInvoiceData: InvoiceCustomer): AuthorizerResponse {
    // User middleware ensures authentication and abilities
    // Only check ownership
    return user.uuid === customerInvoiceData.userId;
  }
}
