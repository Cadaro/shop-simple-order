import User from '#models/user';
import InvoiceCustomer from '#models/invoice_customer';
import { BasePolicy } from '@adonisjs/bouncer';
import type { AuthorizerResponse } from '@adonisjs/bouncer/types';
import { UserAbilitiesEnum, UserRolesEnum } from '#types/user';

export default class CustomerInvoiceDataPolicy extends BasePolicy {
  view(user: User, customerInvoiceData: InvoiceCustomer): AuthorizerResponse {
    if (!user.currentAccessToken) {
      return false;
    }
    return (
      user.uuid === customerInvoiceData.userId &&
      user.role === UserRolesEnum.USER &&
      user.currentAccessToken.allows(UserAbilitiesEnum.INVOICES_DATA_VIEW)
    );
  }
  create(user: User): AuthorizerResponse {
    if (!user.currentAccessToken) {
      return false;
    }

    return (
      user.role === UserRolesEnum.USER &&
      user.currentAccessToken.allows(UserAbilitiesEnum.INVOICES_DATA_CREATE)
    );
  }
  edit(user: User, customerInvoiceData: InvoiceCustomer): AuthorizerResponse {
    if (!user.currentAccessToken) {
      return false;
    }
    return (
      user.uuid === customerInvoiceData.userId &&
      user.role === UserRolesEnum.USER &&
      user.currentAccessToken.allows(UserAbilitiesEnum.INVOICES_DATA_UPDATE)
    );
  }
}
