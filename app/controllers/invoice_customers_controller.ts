import ResponseErrorHandler from '#exceptions/response';
import CustomerInvoiceDataPolicy from '#policies/customer_invoice_data_policy';
import InvoiceCustomerService from '#services/invoice_customer_service';
import { StatusCodeEnum } from '#types/response';
import {
  createInvoiceCustomerValidator,
  updateInvoiceCustomerValidator,
} from '#validators/invoice_customer';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class InvoiceCustomersController {
  constructor(private invoiceCustomerService: InvoiceCustomerService) {}

  async index({ auth, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    if (!auth.user) {
      return response.unauthorized();
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

  async store({ auth, request, response, bouncer }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    if (!auth.user) {
      return response.unauthorized();
    }

    if (await bouncer.with(CustomerInvoiceDataPolicy).denies('create')) {
      return response.forbidden();
    }

    const validatedInvoiceCustomerData = await request.validateUsing(
      createInvoiceCustomerValidator
    );

    try {
      const customerInvoiceDataId = await this.invoiceCustomerService.saveCustomerData({
        userId: auth.user.uuid,
        ...validatedInvoiceCustomerData,
      });
      return response.created({ id: customerInvoiceDataId });
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.BadRequest, e);
    }
  }

  async update({ auth, request, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    if (!auth.user) {
      return response.unauthorized();
    }

    const validatedInvoiceCustomerData = await request.validateUsing(
      updateInvoiceCustomerValidator
    );

    try {
      await this.invoiceCustomerService.updateCustomerData({
        userId: auth.user.uuid,
        ...validatedInvoiceCustomerData,
      });
      return response.noContent();
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.BadRequest, e);
    }
  }
}
