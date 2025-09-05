import { DateTime } from 'luxon';
import { Address } from '#types/address';

export interface ISavedDeliveryData {
  deliveryAddress?: Address;
  courierPickupPointData?: Map<string, string>;
}

export interface IUserData {
  userId: string;
  email?: string;
  createdAt?: DateTime;
  updatedAt?: DateTime;
  firstName?: string;
  lastName?: string;
  deliveryData?: ISavedDeliveryData;
  invoiceAddress?: Address;
}

export interface IUserDb {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}
