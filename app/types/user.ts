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

export interface _IUserData {
  userId: number;
  createdAt: Date;
  name: string;
  lastName: string;
  deliveryData?: ISavedDeliveryData;
  invoiceAddress?: string;
}
