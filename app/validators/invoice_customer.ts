import { CountryCode } from '#types/countryCode';
import { InvoiceCustomerTypeEnum } from '#types/invoice';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';

/**
 * Custom postal code validation that validates against the specific country code
 */
const postalCodeForCountry = vine.createRule((value, _options, field) => {
  if (!field.isValid) {
    return;
  }

  // Get the country code from the same parent object
  const countryCode = field.parent.countryCode as CountryCode;

  if (!countryCode) {
    field.report(
      'The country code must be provided to validate postal code',
      'postalCodeRequiresCountry',
      field
    );
    return;
  }

  // Define postal code regex patterns for each country
  const postalCodePatterns: Record<CountryCode, RegExp> = {
    [CountryCode.AT]: /^\d{4}$/, // Austria: 4 digits
    [CountryCode.BE]: /^\d{4}$/, // Belgium: 4 digits
    [CountryCode.CH]: /^\d{4}$/, // Switzerland: 4 digits
    [CountryCode.DE]: /^\d{5}$/, // Germany: 5 digits
    [CountryCode.DK]: /^\d{4}$/, // Denmark: 4 digits
    [CountryCode.ES]: /^\d{5}$/, // Spain: 5 digits
    [CountryCode.FI]: /^\d{5}$/, // Finland: 5 digits
    [CountryCode.FR]: /^\d{5}$/, // France: 5 digits
    [CountryCode.GB]: /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i, // UK: postcode format
    [CountryCode.IE]: /^[A-Z]\d{2}\s?[A-Z0-9]{4}$|^D\d{2}$|^D6W\s?[A-Z0-9]{4}$/i, // Ireland: Eircode format
    [CountryCode.IT]: /^\d{5}$/, // Italy: 5 digits
    [CountryCode.NL]: /^\d{4}\s?[A-Z]{2}$/i, // Netherlands: 4 digits + 2 letters
    [CountryCode.NO]: /^\d{4}$/, // Norway: 4 digits
    [CountryCode.PL]: /^\d{2}-\d{3}$/, // Poland: XX-XXX format
    [CountryCode.PT]: /^\d{4}-\d{3}$/, // Portugal: XXXX-XXX format
    [CountryCode.SE]: /^\d{3}\s?\d{2}$/, // Sweden: XXX XX format
  };

  const pattern = postalCodePatterns[countryCode];
  if (!pattern) {
    field.report(
      `Postal code validation not supported for country ${countryCode}`,
      'postalCodeUnsupported',
      field
    );
    return;
  }

  if (!pattern.test(value as string)) {
    field.report(
      `The postal code format is invalid for country ${countryCode}`,
      'postalCodeInvalid',
      field
    );
    return;
  }
});

/**
 * Validator to validate the payload when creating invoice customer data
 */
export const createInvoiceCustomerValidator = vine.compile(
  vine.object({
    firstName: vine
      .string()
      .minLength(3)
      .maxLength(50)
      .optional()
      .requiredWhen('customerType', '=', InvoiceCustomerTypeEnum.PERSON),
    lastName: vine
      .string()
      .minLength(2)
      .maxLength(50)
      .optional()
      .requiredWhen('customerType', '=', InvoiceCustomerTypeEnum.PERSON),
    companyName: vine
      .string()
      .minLength(2)
      .maxLength(100)
      .optional()
      .requiredWhen('customerType', '=', InvoiceCustomerTypeEnum.COMPANY),
    taxId: vine
      .string()
      .minLength(2)
      .maxLength(100)
      .optional()
      .requiredWhen('customerType', '=', InvoiceCustomerTypeEnum.COMPANY),
    customerType: vine.enum(InvoiceCustomerTypeEnum),
    address: vine.object({
      streetName: vine.string().minLength(3),
      streetNumber: vine.string().minLength(1).maxLength(10),
      apartmentNumber: vine.string().minLength(1).maxLength(10).optional(),
      city: vine.string().minLength(3).maxLength(50),
      postalCode: vine.string().use(postalCodeForCountry()),
      region: vine.string().minLength(2).maxLength(50).optional(),
      countryCode: vine.enum(CountryCode),
    }),
  })
);
export const updateInvoiceCustomerValidator = vine.compile(
  vine.object({
    firstName: vine
      .string()
      .minLength(3)
      .maxLength(50)
      .optional()
      .requiredWhen('customerType', '=', InvoiceCustomerTypeEnum.PERSON),
    lastName: vine
      .string()
      .minLength(2)
      .maxLength(50)
      .optional()
      .requiredWhen('customerType', '=', InvoiceCustomerTypeEnum.PERSON),
    companyName: vine
      .string()
      .minLength(2)
      .maxLength(100)
      .optional()
      .requiredWhen('customerType', '=', InvoiceCustomerTypeEnum.COMPANY),
    taxId: vine
      .string()
      .minLength(2)
      .maxLength(100)
      .optional()
      .requiredWhen('customerType', '=', InvoiceCustomerTypeEnum.COMPANY),
    customerType: vine.enum(InvoiceCustomerTypeEnum),
    address: vine.object({
      streetName: vine.string().minLength(3),
      streetNumber: vine.string().minLength(1).maxLength(10),
      apartmentNumber: vine.string().minLength(1).maxLength(10).optional(),
      city: vine.string().minLength(3).maxLength(50),
      postalCode: vine.string().use(postalCodeForCountry()),
      region: vine.string().minLength(2).maxLength(50).optional(),
      countryCode: vine.enum(CountryCode),
    }),
  })
);

const message = {
  required: 'The {{ field }} field is required',
  countryCodeOptions: `The selected country code is invalid. Supported country codes are: ${Object.values(CountryCode).join(', ')}`,
  postalCode: 'The {{ field }} field must be a valid postal code',
  postalCodeRequiresCountry: 'The country code must be provided to validate postal code',
  postalCodeInvalid: 'The postal code format is invalid for the specified country',
  postalCodeUnsupported: 'Postal code validation not supported for the specified country',
  minLength: 'The {{ field }} field must be at least {{ options.minLength }} characters',
  maxLength: 'The {{ field }} field must not exceed {{ options.maxLength }} characters',
  enum: 'The selected {{ field }} is invalid. Valid options are: {{ options.choices }}',
  requiredWhen:
    'The {{ field }} field is required when {{ options.otherField }} is {{ options.value }}',
};

const fields = {
  'firstName': 'firstName',
  'lastName': 'lastName',
  'companyName': 'companyName',
  'taxId': 'taxId',
  'customerType': 'customerType',
  'invoiceAddress.streetName': 'streetName',
  'invoiceAddress.streetNumber': 'streetNumber',
  'invoiceAddress.city': 'city',
  'invoiceAddress.postalCode': 'postalCode',
  'invoiceAddress.countryCode': 'countryCode',
};

createInvoiceCustomerValidator.messagesProvider = new SimpleMessagesProvider(message, fields);
