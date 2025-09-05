import InvoiceCustomers from '#models/invoice_customer';
import { InvoiceCustomerData } from '#types/invoice';

export default class InvoiceCustomerMapper {
  mapInvoiceCustomerModelToInvoiceCustomerType(
    invoiceCustomersModel: InvoiceCustomers
  ): InvoiceCustomerData {
    return {
      firstName: invoiceCustomersModel.firstName,
      lastName: invoiceCustomersModel.lastName,
      address: {
        city: invoiceCustomersModel.city,
        countryCode: invoiceCustomersModel.countryCode,
        streetName: invoiceCustomersModel.streetName,
        streetNumber: invoiceCustomersModel.streetNumber,
        apartmentNumber: invoiceCustomersModel.apartmentNumber,
        postalCode: invoiceCustomersModel.postalCode,
        region: invoiceCustomersModel.region,
      },
    };
  }
  mapInvoiceCustomerTypeToInvoiceCustomerModel(
    invoiceCustomerData: Partial<InvoiceCustomerData>
  ): Partial<InvoiceCustomers> {
    return {
      firstName: invoiceCustomerData.firstName,
      lastName: invoiceCustomerData.lastName,
      city: invoiceCustomerData.address?.city,
      streetName: invoiceCustomerData.address?.streetName,
      streetNumber: invoiceCustomerData.address?.streetNumber,
      countryCode: invoiceCustomerData.address?.countryCode,
      apartmentNumber: invoiceCustomerData.address?.apartmentNumber,
      postalCode: invoiceCustomerData.address?.postalCode,
      region: invoiceCustomerData.address?.region,
    };
  }
}
