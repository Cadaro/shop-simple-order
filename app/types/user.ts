import { DateTime } from 'luxon';

export type UserData = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: DateTime;
  updatedAt: DateTime;
};

export type UserDb = {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
};

export enum UserAbilitiesEnum {
  ALL = '*',
  ORDERS_CREATE = 'orders:create',
  ORDERS_VIEW = 'orders:view',
  USERS_UPDATE = 'users:update',
  USERS_VIEW = 'users:view',
  STOCKS_VIEW = 'stocks:view',
  INVOICES_ORDER_VIEW = 'invoices-order:view',
  INVOICES_DATA_VIEW = 'invoices-data:view',
  INVOICES_DATA_CREATE = 'invoices-data:create',
  INVOICES_DATA_UPDATE = 'invoices-data:update',
  DELIVERY_DATA_VIEW = 'delivery-data:view',
  DELIVERY_DATA_CREATE = 'delivery-data:create',
  DELIVERY_DATA_UPDATE = 'delivery-data:update',
}

export enum UserRolesEnum {
  ADMIN = 'admin',
  USER = 'user',
}
