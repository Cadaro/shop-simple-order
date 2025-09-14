import ResponseErrorHandler from '#exceptions/response';
import StockPolicy from '#policies/stock_policy';
import StockService from '#services/stock_service';
import { StatusCodeEnum } from '#types/response';
import { createStockValidator } from '#validators/stock';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class StocksController {
  constructor(private stockService: StockService) {}

  async index({ response }: HttpContext) {
    const stocks = await this.stockService.fetchAvailableStock();

    return response.ok(stocks);
  }

  async show({ params, response }: HttpContext) {
    try {
      const singleStockItem = await this.stockService.fetchSingleStockItem(params.itemId);
      return response.ok(singleStockItem);
    } catch (error) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.NotFound, error);
    }
  }

  async store({ auth, bouncer, request, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    if (await bouncer.with(StockPolicy).denies('create')) {
      return response.forbidden();
    }

    const singleStockItem = await request.validateUsing(createStockValidator);
    try {
      const createdSingleStockItemId =
        await this.stockService.createSingleItemStock(singleStockItem);
      return response.created({ itemId: createdSingleStockItemId });
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.BadRequest, e);
    }
  }
}
