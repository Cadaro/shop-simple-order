import { DateTime } from 'luxon';
import { CountryCode } from '#types/countryCode';

export interface IAddress {
  streetName: string;
  streetNumber: string;
  apartmentNumber?: string;
  city: string;
  postalCode: string;
  region?: string;
  countryCode: CountryCode;
}

export interface ISavedDeliveryData {
  deliveryAddress?: IAddress;
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
  invoiceAddress?: IAddress;
}

export interface IUserDb {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}
