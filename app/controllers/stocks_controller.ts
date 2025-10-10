import ResponseErrorHandler from '#exceptions/response';
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

  async store({ request, response }: HttpContext) {
    // Admin middleware ensures only admins can reach this point
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
