import { CountryCode } from '#types/countryCode';
import vine from '@vinejs/vine';

/**
 * Validator to validate the payload when creating
 * a new user.
 */
export const createUserValidator = vine.compile(
  vine.object({
    firstName: vine.string().minLength(3).maxLength(50).optional(),
    lastName: vine.string().minLength(2).maxLength(50).optional(),
    email: vine.string().email().maxLength(254).trim(),
    password: vine.string(),
  })
);

/**
 * Validator to validate the payload when updating
 * a user data
 */
export const updateUserValidator = vine.compile(
  vine.object({
    firstName: vine.string().minLength(3).maxLength(50).optional(),
    lastName: vine.string().minLength(2).maxLength(50).optional(),
    invoiceAddress: vine
      .object({
        streetName: vine.string().minLength(3),
        streetNumber: vine.string().minLength(1).maxLength(10),
        apartmentNumber: vine.string().minLength(1).maxLength(10).optional(),
        city: vine.string().minLength(3).maxLength(30),
        postalCode: vine.string().postalCode({ countryCode: [CountryCode.PL] }),
        region: vine.string().minLength(2).maxLength(20).optional(),
        countryCode: vine.enum(CountryCode),
      })
      .optional(),
  })
);
