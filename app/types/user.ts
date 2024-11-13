export interface IAddress {
  street: string;
  streetNumber: string;
  apartmentNumber?: string;
  city: string;
  postalCode: string;
  region?: string;
}

export interface ISavedDeliveryData {
  deliveryAddress?: IAddress;
  courierPickupPointData?: Map<string, string>;
}

export interface IUserData {
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
  firstName: string;
  lastName?: string;
  deliveryData?: ISavedDeliveryData;
  invoiceAddress?: IAddress;
}

export interface IUserDb {
  fullName?: string;
  email: string;
  password: string;
}
