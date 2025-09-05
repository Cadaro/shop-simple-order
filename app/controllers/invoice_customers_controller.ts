import ResponseErrorHandler from '#exceptions/response';
import InvoiceCustomer from '#services/invoice_customer_service';
import { InvoiceCustomerData } from '#types/invoice';
import { StatusCodeEnum } from '#types/response';
import {
  createInvoiceCustomerValidator,
  updateInvoiceCustomerValidator,
} from '#validators/invoice_customer';
import type { HttpContext } from '@adonisjs/core/http';

export default class InvoiceCustomersController {
  private invoiceCustomerService = new InvoiceCustomer();
  async index({ auth, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    if (!auth.user?.uuid) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.Conflict, {
        errors: [{ message: 'User ID is missing' }],
      });
    }

    try {
      const customerInvoiceData = await this.invoiceCustomerService.fetchCustomerData(
        auth.user.uuid
      );
      return response.ok(customerInvoiceData);
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.NotFound, e);
    }
  }

  async store({ auth, request, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    if (!auth.user?.uuid) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.Conflict, {
        errors: [{ message: 'User ID is missing' }],
      });
    }
    const validatedInvoiceCustomerData = await request.validateUsing(
      createInvoiceCustomerValidator
    );
    try {
      await this.invoiceCustomerService.saveCustomerData(
        auth.user.uuid,
        validatedInvoiceCustomerData
      );
      return response.created();
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.BadRequest, e);
    }
  }

  async update({ auth, request, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    if (!auth.user?.uuid) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.Conflict, {
        errors: [{ message: 'User ID is missing' }],
      });
    }

    const validatedInvoiceCustomerData = await request.validateUsing(
      updateInvoiceCustomerValidator
    );

    // Use Partial<InvoiceCustomerData> and Partial<Address> to allow partial updates
    try {
      await this.invoiceCustomerService.updateCustomerData(
        auth.user.uuid,
        validatedInvoiceCustomerData as Partial<InvoiceCustomerData>
      );
      return response.noContent();
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.BadRequest, e);
    }
  }
}
