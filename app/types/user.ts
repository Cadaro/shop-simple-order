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
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  firstName: string | null;
  lastName: string | null;
  deliveryData?: ISavedDeliveryData;
  invoiceAddress?: IAddress;
}

export interface IUserDb {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  password: string;
}
