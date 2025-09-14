import { DateTime } from 'luxon';
import { Address } from '#types/address';

export type SavedDeliveryData = {
  deliveryAddress?: Address;
  courierPickupPointData?: Map<string, string>;
};

export type UserData = {
  userId: string;
  email?: string;
  createdAt?: DateTime;
  updatedAt?: DateTime;
  firstName?: string;
  lastName?: string;
  deliveryData?: SavedDeliveryData;
  invoiceAddress?: Address;
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
}

export enum UserRolesEnum {
  ADMIN = 'admin',
  USER = 'user',
}
