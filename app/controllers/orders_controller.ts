import { createOrderDetailValidator } from '#validators/order_detail';
import { HttpContext } from '@adonisjs/core/http';
import { OrderData } from '#types/order';
import StockService from '#services/stock_service';
import OrderService from '#services/order_service';
import { StatusCodeEnum } from '#types/response';
import ResponseErrorHandler from '#exceptions/response';
import { inject } from '@adonisjs/core';
import OrderPolicy from '#policies/order_policy';

@inject()
export default class OrdersController {
  constructor(
    private orderService: OrderService,
    private stockService: StockService
  ) {}

  async index({ auth, bouncer, response }: HttpContext) {
    // User middleware ensures authentication, so auth.user is guaranteed to exist
    const orderList = await this.orderService.fetchUserOrderList(auth.user!.id);
    if (await bouncer.with(OrderPolicy).denies('viewList', orderList)) {
      return response.forbidden();
    }

    return response.ok(orderList as Array<OrderData>);
  }

  async store({ auth, request, response }: HttpContext) {
    // User middleware ensures authentication, so auth.user is guaranteed to exist
    const orderedItems = await request.validateUsing(createOrderDetailValidator);

    try {
      await this.stockService.updateStock(orderedItems.items);
      const orderData: OrderData = await this.orderService.createOrder(
        orderedItems.items,
        auth.user!.id
      );

      return response.created(orderData);
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.BadRequest, e);
    }
  }

  async show({ bouncer, params, response }: HttpContext) {
    // User middleware ensures authentication, so auth.user is guaranteed to exist
    try {
      const orderData = await this.orderService.fetchUserSingleOrder(params.orderId);
      if (await bouncer.with(OrderPolicy).denies('view', orderData!)) {
        return response.forbidden();
      }

      const order: OrderData = {
        orderId: orderData.orderId,
        details: orderData.details,
        createdAt: orderData.createdAt,
      };

      return response.ok(order);
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.NotFound, e);
    }
  }
}
