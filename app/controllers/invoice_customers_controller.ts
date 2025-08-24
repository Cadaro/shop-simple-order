import { createInvoiceCustomerValidator } from '#validators/invoice_customer';
import type { HttpContext } from '@adonisjs/core/http';

export default class InvoiceCustomersController {
  async index({ auth, params, response }: HttpContext) {
    //call service to fetch customer's invoice data
  }

  async store({ auth, request, response }: HttpContext) {
    const validatedInvoiceCustomerData = await request.validateUsing(
      createInvoiceCustomerValidator
    );
    //call service to store customer's invoice data
  }

  async update({ auth, params, request }: HttpContext) {
    //call service to update customer's invoice data
  }
}
