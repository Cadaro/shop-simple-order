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
  ADMIN = '*',
  USER = 'user',
}

export enum UserRolesEnum {
  ADMIN = 'admin',
  USER = 'user',
}
