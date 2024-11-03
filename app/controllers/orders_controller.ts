import { createOrderDetailValidator } from '#validators/order_detail';
import type { HttpContext } from '@adonisjs/core/http';
import { IOrderData } from '#types/order';
import StockService from '#services/stock_service';
import OrderService from '#services/order_service';

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
    } catch (error) {
      return response.badRequest({
        error: 'Order could not be created due to errors',
        details: error,
      });
    }
  }

  async show({ auth, params, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    const orderService = new OrderService();
    const orderData = await orderService.fetchUserOrderDetails(params.id, auth.user!.id);
    if (!orderData) {
      return response.notFound();
    }

    return response.status(200).send(orderData);
  }
}
