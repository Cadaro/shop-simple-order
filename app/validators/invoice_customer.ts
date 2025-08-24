import { CountryCode } from '#types/countryCode';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';

/**
 * Validator to validate the payload when updating
 * a user data
 */
export const createInvoiceCustomerValidator = vine.compile(
  vine.object({
    firstName: vine.string().minLength(3).maxLength(50),
    lastName: vine.string().minLength(2).maxLength(50),
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

const message = {
  required: 'The {{ field }} field is required',
};

const fields = {
  'firstName': 'firstName',
  'lastName': 'lastName',
  'invoiceAddress.streetName': 'streetName',
  'invoiceAddress.streetNumber': 'stretNumber',
  'invoiceAddress.city': 'city',
  'invoiceAddress.postalCode': 'postalCode',
  'invoiceAddress.countryCode': 'countryCode',
};

createInvoiceCustomerValidator.messagesProvider = new SimpleMessagesProvider(message, fields);
