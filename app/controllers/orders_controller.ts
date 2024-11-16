import { createOrderDetailValidator } from '#validators/order_detail';
import { HttpContext } from '@adonisjs/core/http';
import { IOrderData } from '#types/order';
import StockService from '#services/stock_service';
import OrderService from '#services/order_service';
import OrderPolicy from '#policies/order_policy';
import { IResponseError, StatusCodeEnum } from '#types/response';
import ResponseErrorHandler from '#exceptions/response';

export default class OrdersController {
  async index({ auth, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    const orderService = new OrderService();
    const orderList = await orderService.fetchUserOrderList(auth.user!.id);

    return response.status(200).send(orderList);
  }

  async store({ auth, request, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    const orderedItems = await request.validateUsing(createOrderDetailValidator);

    try {
      const stockService = new StockService();
      const orderService = new OrderService();
      await stockService.updateStock(orderedItems.details);
      const orderData: IOrderData = await orderService.createOrder(
        orderedItems.details,
        auth.user!.id
      );

      return response.status(200).send(orderData);
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.BadRequest, e);
    }
  }

  async show({ bouncer, auth, params, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }
    const orderService = new OrderService();
    const orderData = await orderService.fetchUserOrderDetails(params.id);
    if (await bouncer.with(OrderPolicy).denies('view', orderData!)) {
      return response.forbidden();
    }
    if (!orderData) {
      const error: IResponseError = { errors: [{ message: `Order ${params.id} not found` }] };
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.NotFound, error);
    }

    return response.status(200).send(orderData!.serialize() as IOrderData);
  }
}
