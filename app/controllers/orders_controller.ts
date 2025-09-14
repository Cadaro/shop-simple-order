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
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    if (!auth.user) {
      return response.unauthorized();
    }

    const orderList: Array<OrderData> = await this.orderService.fetchUserOrderList(auth.user.id);
    if (await bouncer.with(OrderPolicy).denies('viewList')) {
      return response.forbidden();
    }

    return response.ok(orderList);
  }

  async store({ auth, request, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    const orderedItems = await request.validateUsing(createOrderDetailValidator);

    try {
      await this.stockService.updateStock(orderedItems.items);
      const orderData: OrderData = await this.orderService.createOrder(
        orderedItems.items,
        auth.user!.id
      );

      return response.ok(orderData);
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.BadRequest, e);
    }
  }

  async show({ bouncer, auth, params, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }
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
